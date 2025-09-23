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
        }))
      } else {
        console.warn('No questions found in database')
        questions = getMockQuestions()
      }
    } catch (fetchError) {
      console.error('Supabase connection failed:', fetchError)
      console.error('Full error:', JSON.stringify(fetchError, null, 2))
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
        `${question.question_text} ${question.skills || ''} ${question.company || ''}`
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
      if (input.company && question.company && question.company.toLowerCase().includes(input.company.toLowerCase())) {
        relevanceScore *= 1.2
      }
      
      // Apply role-specific bonuses
      const roleBonus = calculateRoleSpecificBonus(normalizedRole, question.question_text, question.skills || '')
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
    let query = supabase.from('questions').select('*')
    
    if (filters.difficulty && filters.difficulty.length > 0) {
      query = query.in('difficulty_level', filters.difficulty)
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
    
    // Map database columns to interface properties
    return (data || []).map(item => ({
      ...item,
      difficulty: item.difficulty_level as 'Intern' | 'Junior' | 'Mid' | 'Senior',
      difficulty_level: undefined
    }))
    
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

function getMockQuestions(): InterviewQuestion[] {
  return [
    {
      id: '1',
      question_text: 'How do you prioritize features when you have limited resources?',
      company: 'Meta',
      question_type: 'Product Design',
      difficulty: 'Mid',
      sample_answer: 'I use a framework like RICE (Reach, Impact, Confidence, Effort) to evaluate features...',
      skills: 'prioritization, stakeholder management, strategic thinking',
    },
    {
      id: '2',
      question_text: 'Tell me about a time you had to influence without authority.',
      company: 'Google',
      question_type: 'Behavioral',
      difficulty: 'Senior',
      sample_answer: 'In my previous role, I needed to get buy-in from engineering teams...',
      skills: 'leadership, communication, influence',
    },
    {
      id: '3',
      question_text: 'How would you improve our product discovery process?',
      company: 'Apple',
      question_type: 'Product Design',
      difficulty: 'Mid',
      sample_answer: 'I would start by understanding the current user journey and identifying pain points...',
      skills: 'user research, product strategy, analytics',
    },
    {
      id: '4',
      question_text: 'Describe a time when you had to make a decision with incomplete data.',
      company: 'Amazon',
      question_type: 'Behavioral',
      difficulty: 'Junior',
      sample_answer: 'During a product launch, we had limited user feedback but needed to decide on feature scope...',
      skills: 'decision making, risk assessment, analytical thinking',
    },
    {
      id: '5',
      question_text: 'How do you measure the success of a new feature?',
      company: 'Netflix',
      question_type: 'Product Design',
      difficulty: 'Mid',
      sample_answer: 'I establish both leading and lagging indicators before launch...',
      skills: 'analytics, metrics, experimentation',
    }
  ]
}