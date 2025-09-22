import { supabase } from './supabase'
import { 
  extractKeywords, 
  normalizeRole, 
  categorizeSkills, 
  determineDifficulty,
  calculateKeywordSimilarity,
  getSkillWeight
} from './keyword-extraction'

export interface InterviewQuestion {
  id: string
  question_text: string
  company: string
  question_type: 'Behavioral' | 'Product Design'
  difficulty: 'Intern' | 'Junior' | 'Mid' | 'Senior'
  sample_answer: string
  skills: string
  keywords?: string[]
  relevance_score?: number
}

export interface RecommendationInput {
  resumeText?: string
  jobDescription?: string
  roleTitle: string
  company?: string
  experienceLevel?: string | number
  preferredQuestionTypes?: ('Behavioral' | 'Product Design')[]
  maxQuestions?: number
}

export interface RecommendationResult {
  questions: InterviewQuestion[]
  userProfile: {
    normalizedRole: string
    suggestedDifficulty: string
    extractedSkills: {
      technical: string[]
      soft: string[]
      industries: string[]
      tools: string[]
      experience: string[]
    }
    totalKeywords: number
  }
  matchingStats: {
    totalQuestionsAnalyzed: number
    averageRelevanceScore: number
    topSkillMatches: string[]
  }
}

/**
 * Get personalized question recommendations based on user profile
 */
export async function getQuestionRecommendations(
  input: RecommendationInput
): Promise<RecommendationResult> {
  try {
    // Extract and analyze user profile
    const userKeywords = new Set<string>()
    
    // Extract keywords from all available text sources
    if (input.resumeText) {
      extractKeywords(input.resumeText).forEach(keyword => userKeywords.add(keyword))
    }
    if (input.jobDescription) {
      extractKeywords(input.jobDescription).forEach(keyword => userKeywords.add(keyword))
    }
    if (input.roleTitle) {
      extractKeywords(input.roleTitle).forEach(keyword => userKeywords.add(keyword))
    }
    if (input.company) {
      extractKeywords(input.company).forEach(keyword => userKeywords.add(keyword))
    }
    
    const userKeywordArray = Array.from(userKeywords)
    const normalizedRole = normalizeRole(input.roleTitle)
    const suggestedDifficulty = determineDifficulty(input.roleTitle, input.experienceLevel)
    const categorizedSkills = categorizeSkills(userKeywordArray)
    
    // Try to fetch questions from database, fallback to mock data if it fails
    let questions: InterviewQuestion[] = []
    
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
      
      if (error) {
        console.warn('Supabase fetch failed, using mock data:', error.message)
        questions = getMockQuestions()
      } else if (data && data.length > 0) {
        questions = data
      } else {
        console.warn('No questions found in database, using mock data')
        questions = getMockQuestions()
      }
    } catch (fetchError) {
      console.warn('Database connection failed, using mock data:', fetchError)
      questions = getMockQuestions()
    }
    
    if (questions.length === 0) {
      return {
        questions: [],
        userProfile: {
          normalizedRole,
          suggestedDifficulty,
          extractedSkills: categorizedSkills,
          totalKeywords: userKeywordArray.length
        },
        matchingStats: {
          totalQuestionsAnalyzed: 0,
          averageRelevanceScore: 0,
          topSkillMatches: []
        }
      }
    }
    
    // Calculate relevance scores for each question
    const questionsWithScores = questions.map(question => {
      const questionKeywords = extractKeywords(
        `${question.question_text} ${question.skills} ${question.company}`
      )
      
      // Calculate base similarity score
      let relevanceScore = calculateKeywordSimilarity(userKeywordArray, questionKeywords)
      
      // Apply difficulty matching bonus
      if (question.difficulty === suggestedDifficulty) {
        relevanceScore *= 1.3
      } else if (
        (question.difficulty === 'Junior' && suggestedDifficulty === 'Mid') ||
        (question.difficulty === 'Mid' && suggestedDifficulty === 'Junior') ||
        (question.difficulty === 'Mid' && suggestedDifficulty === 'Senior') ||
        (question.difficulty === 'Senior' && suggestedDifficulty === 'Mid')
      ) {
        relevanceScore *= 1.1 // Adjacent difficulty levels get slight bonus
      }
      
      // Apply company matching bonus
      if (input.company && question.company.toLowerCase().includes(input.company.toLowerCase())) {
        relevanceScore *= 1.2
      }
      
      // Apply role-specific bonuses
      const roleBonus = calculateRoleSpecificBonus(normalizedRole, question.question_text, question.skills)
      relevanceScore *= roleBonus
      
      // Apply skill weight bonuses
      const skillWeightBonus = questionKeywords.reduce((bonus, keyword) => {
        if (userKeywords.has(keyword)) {
          return bonus + (getSkillWeight(keyword) - 1) * 0.1
        }
        return bonus
      }, 1)
      relevanceScore *= skillWeightBonus
      
      return {
        ...question,
        keywords: questionKeywords,
        relevance_score: Math.min(relevanceScore, 1) // Cap at 1.0
      }
    })
    
    // Filter by question type preferences if specified
    let filteredQuestions = questionsWithScores
    if (input.preferredQuestionTypes && input.preferredQuestionTypes.length > 0) {
      filteredQuestions = questionsWithScores.filter(q => 
        input.preferredQuestionTypes!.includes(q.question_type)
      )
    }
    
    // Sort by relevance score and limit results
    const sortedQuestions = filteredQuestions
      .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
      .slice(0, input.maxQuestions || 10)
    
    // Calculate matching statistics
    const totalQuestionsAnalyzed = filteredQuestions.length
    const averageRelevanceScore = filteredQuestions.reduce(
      (sum, q) => sum + (q.relevance_score || 0), 0
    ) / totalQuestionsAnalyzed
    
    // Find top skill matches
    const skillMatchCounts = new Map<string, number>()
    sortedQuestions.forEach(question => {
      question.keywords?.forEach(keyword => {
        if (userKeywords.has(keyword)) {
          skillMatchCounts.set(keyword, (skillMatchCounts.get(keyword) || 0) + 1)
        }
      })
    })
    
    const topSkillMatches = Array.from(skillMatchCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill)
    
    return {
      questions: sortedQuestions,
      userProfile: {
        normalizedRole,
        suggestedDifficulty,
        extractedSkills: categorizedSkills,
        totalKeywords: userKeywordArray.length
      },
      matchingStats: {
        totalQuestionsAnalyzed,
        averageRelevanceScore,
        topSkillMatches
      }
    }
    
  } catch (error) {
    console.error('Error getting question recommendations:', error)
    throw error
  }
}

/**
 * Calculate role-specific bonus for question relevance
 */
function calculateRoleSpecificBonus(
  normalizedRole: string, 
  questionText: string, 
  skills: string
): number {
  const combinedText = `${questionText} ${skills}`.toLowerCase()
  
  // Product Manager specific bonuses
  if (normalizedRole.includes('product_manager')) {
    if (combinedText.includes('prioritization') || 
        combinedText.includes('roadmap') || 
        combinedText.includes('stakeholder') ||
        combinedText.includes('user research') ||
        combinedText.includes('metrics') ||
        combinedText.includes('feature') ||
        combinedText.includes('strategy')) {
      return 1.4
    }
  }
  
  // Engineering specific bonuses
  if (normalizedRole.includes('engineer') || normalizedRole.includes('developer')) {
    if (combinedText.includes('technical') || 
        combinedText.includes('architecture') || 
        combinedText.includes('code') ||
        combinedText.includes('system design') ||
        combinedText.includes('debugging') ||
        combinedText.includes('performance') ||
        combinedText.includes('scalability')) {
      return 1.4
    }
  }
  
  // Design specific bonuses
  if (normalizedRole.includes('designer')) {
    if (combinedText.includes('user experience') || 
        combinedText.includes('design') || 
        combinedText.includes('prototype') ||
        combinedText.includes('usability') ||
        combinedText.includes('interface') ||
        combinedText.includes('visual') ||
        combinedText.includes('accessibility')) {
      return 1.4
    }
  }
  
  // Data role specific bonuses
  if (normalizedRole.includes('data_scientist') || normalizedRole.includes('data_analyst')) {
    if (combinedText.includes('analysis') || 
        combinedText.includes('statistical') || 
        combinedText.includes('model') ||
        combinedText.includes('insight') ||
        combinedText.includes('hypothesis') ||
        combinedText.includes('experiment') ||
        combinedText.includes('visualization')) {
      return 1.4
    }
  }
  
  return 1.0 // No bonus
}

/**
 * Get questions filtered by specific criteria
 */
export async function getQuestionsByFilters(filters: {
  difficulty?: string[]
  questionType?: string[]
  company?: string[]
  skills?: string[]
  limit?: number
}): Promise<InterviewQuestion[]> {
  try {
    let query = supabase.from('interview_questions').select('*')
    
    if (filters.difficulty && filters.difficulty.length > 0) {
      query = query.in('difficulty', filters.difficulty)
    }
    
    if (filters.questionType && filters.questionType.length > 0) {
      query = query.in('question_type', filters.questionType)
    }
    
    if (filters.company && filters.company.length > 0) {
      query = query.in('company', filters.company)
    }
    
    if (filters.skills && filters.skills.length > 0) {
      // Use text search for skills (assuming skills are stored as comma-separated text)
      const skillsFilter = filters.skills.map(skill => `skills.ilike.%${skill}%`).join(',')
      query = query.or(skillsFilter)
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    
    const { data, error } = await query
    
    if (error) {
      throw new Error(`Failed to fetch filtered questions: ${error.message}`)
    }
    
    return data || []
    
  } catch (error) {
    console.error('Error fetching filtered questions:', error)
    throw error
  }
}

/**
 * Analyze user profile and return insights
 */
export function analyzeUserProfile(input: RecommendationInput): {
  profileStrength: 'weak' | 'moderate' | 'strong'
  recommendations: string[]
  missingSkills: string[]
  roleAlignment: number
} {
  const userKeywords = new Set<string>()
  
  if (input.resumeText) {
    extractKeywords(input.resumeText).forEach(keyword => userKeywords.add(keyword))
  }
  if (input.jobDescription) {
    extractKeywords(input.jobDescription).forEach(keyword => userKeywords.add(keyword))
  }
  
  const userKeywordArray = Array.from(userKeywords)
  const categorizedSkills = categorizeSkills(userKeywordArray)
  const normalizedRole = normalizeRole(input.roleTitle)
  
  // Determine profile strength
  let profileStrength: 'weak' | 'moderate' | 'strong' = 'weak'
  const totalSkills = categorizedSkills.technical.length + categorizedSkills.soft.length
  
  if (totalSkills >= 15) profileStrength = 'strong'
  else if (totalSkills >= 8) profileStrength = 'moderate'
  
  // Generate recommendations
  const recommendations: string[] = []
  
  if (categorizedSkills.technical.length < 5) {
    recommendations.push('Consider highlighting more technical skills in your resume')
  }
  if (categorizedSkills.soft.length < 3) {
    recommendations.push('Include more soft skills and leadership examples')
  }
  if (categorizedSkills.industries.length === 0) {
    recommendations.push('Specify your industry experience and domain knowledge')
  }
  
  // Identify missing skills based on role
  const missingSkills: string[] = []
  
  if (normalizedRole.includes('product_manager')) {
    const expectedSkills = ['analytics', 'user research', 'prioritization', 'stakeholder management']
    expectedSkills.forEach(skill => {
      if (!userKeywordArray.some(keyword => keyword.includes(skill.replace(' ', '')))) {
        missingSkills.push(skill)
      }
    })
  }
  
  // Calculate role alignment (simplified)
  const roleAlignment = Math.min(totalSkills / 10, 1.0)
  
  return {
    profileStrength,
    recommendations,
    missingSkills,
    roleAlignment
  }
}

/**
 * Mock questions for fallback when Supabase is not available
 */
function getMockQuestions(): InterviewQuestion[] {
  return [
    {
      id: '1',
      question_text: 'Tell me about a time when you had to prioritize features for a product with limited resources.',
      company: 'Google',
      question_type: 'Behavioral',
      difficulty: 'Mid',
      sample_answer: 'In my previous role at TechCorp, we were launching a new mobile app with a tight deadline and limited engineering resources. I had to prioritize between user authentication, core functionality, and advanced features. I used the RICE framework to evaluate each feature based on reach, impact, confidence, and effort. I prioritized user authentication and core functionality first, then planned advanced features for the next sprint. This approach helped us launch on time while ensuring the most critical user needs were met.',
      skills: 'prioritization, product strategy, resource management, RICE framework'
    },
    {
      id: '2',
      question_text: 'How would you design a feature to increase user engagement on our platform?',
      company: 'Meta',
      question_type: 'Product Design',
      difficulty: 'Senior',
      sample_answer: 'I would start by analyzing current user behavior data to identify drop-off points and engagement patterns. Then I would conduct user interviews to understand pain points and motivations. Based on insights, I would design features like personalized content recommendations, social sharing capabilities, and gamification elements. I would create prototypes, run A/B tests, and iterate based on user feedback and metrics like time spent, return visits, and feature adoption rates.',
      skills: 'user research, product design, A/B testing, analytics, user engagement'
    },
    {
      id: '3',
      question_text: 'Describe a situation where you had to launch a product feature that didn\'t perform as expected.',
      company: 'Amazon',
      question_type: 'Behavioral',
      difficulty: 'Mid',
      sample_answer: 'We launched a recommendation engine feature that had low user engagement. I analyzed user behavior data and found that users weren\'t discovering the feature. I worked with the design team to improve the UI placement and with engineering to add onboarding tooltips. We also A/B tested different approaches. After these changes, engagement increased by 40% over the next month.',
      skills: 'data analysis, cross-functional collaboration, problem solving, A/B testing'
    },
    {
      id: '4',
      question_text: 'How would you approach gathering and incorporating user feedback for a new product feature?',
      company: 'Apple',
      question_type: 'Product Design',
      difficulty: 'Junior',
      sample_answer: 'I would start with user interviews to understand pain points, then create prototypes for usability testing. I\'d use surveys for quantitative data and set up analytics to track user behavior. For incorporation, I\'d categorize feedback by impact and feasibility, then work with engineering to prioritize implementation. I\'d also establish a feedback loop to measure the success of changes.',
      skills: 'user research, prototyping, surveys, analytics, feedback analysis'
    },
    {
      id: '5',
      question_text: 'Tell me about a time when you had to make a difficult product decision with incomplete information.',
      company: 'Microsoft',
      question_type: 'Behavioral',
      difficulty: 'Senior',
      sample_answer: 'When deciding whether to sunset an underperforming feature, I had limited usage data due to tracking issues. I conducted rapid user interviews, analyzed support tickets, and ran a small survey. Despite incomplete data, I made the decision to redesign rather than remove the feature, based on qualitative feedback showing user intent. The redesigned feature saw 3x higher engagement within two months.',
      skills: 'decision making, user research, data analysis, product strategy, risk management'
    }
  ]
}