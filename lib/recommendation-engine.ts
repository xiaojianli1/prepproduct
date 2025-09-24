// Question Recommendation Engine
// Analyzes job descriptions and recommends relevant PM interview questions

export interface Question {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
  estimatedTime: string
  keywords: string
  question_type: string
}

export interface RecommendationResult {
  questions: Question[]
  totalMatches: number
  isRecommended: boolean
}

// Common stop words to filter out
const STOP_WORDS = new Set([
  'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'is', 'am', 'can', 'must', 'shall', 'from', 'up', 'out', 'down', 'off', 'over',
  'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
  'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 's', 't', 'just', 'now', 'our', 'your', 'their'
])

// Technical question types for ensuring balanced recommendations
const TECHNICAL_QUESTION_TYPES = new Set([
  'Product Design',
  'Product Analytics', 
  'Metrics & Goals',
  'Root Cause Analysis',
  'Technical Understanding'
])

const BEHAVIORAL_QUESTION_TYPES = new Set([
  'Leadership & Communication',
  'Product Strategy',
  'Background question',
  'Situational question',
  'Process question'
])

export class RecommendationEngine {
  /**
   * Extract keywords from job description text
   */
  private extractKeywords(jobDescription: string): string[] {
    if (!jobDescription || jobDescription.trim().length === 0) {
      return []
    }

    // Convert to lowercase and clean text
    const cleanText = jobDescription
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Replace special characters with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    // Split into words and filter out stop words
    const words = cleanText
      .split(' ')
      .filter(word => word.length > 2 && !STOP_WORDS.has(word))

    // Remove duplicates
    return [...new Set(words)]
  }

  /**
   * Score a question based on keyword matches
   */
  private scoreQuestion(question: Question, jobKeywords: string[]): number {
    if (!question.keywords || jobKeywords.length === 0) {
      return 0
    }

    const questionKeywords = question.keywords
      .toLowerCase()
      .split(',')
      .map(k => k.trim())

    let score = 0

    for (const jobKeyword of jobKeywords) {
      for (const questionKeyword of questionKeywords) {
        // Exact match: 3 points
        if (questionKeyword === jobKeyword) {
          score += 3
        }
        // Partial match (contains): 1 point
        else if (questionKeyword.includes(jobKeyword) || jobKeyword.includes(questionKeyword)) {
          score += 1
        }
      }
    }

    return score
  }

  /**
   * Ensure balanced question selection
   */
  private selectBalancedQuestions(scoredQuestions: Array<{question: Question, score: number}>): Question[] {
    // Sort by score (highest first)
    const sorted = scoredQuestions.sort((a, b) => b.score - a.score)
    
    const selected: Question[] = []
    const usedTypes = new Set<string>()
    
    let technicalCount = 0
    let behavioralCount = 0
    
    // First pass: select highest scoring questions while maintaining balance
    for (const {question, score} of sorted) {
      if (selected.length >= 5) break
      
      const isTechnical = TECHNICAL_QUESTION_TYPES.has(question.question_type)
      const isBehavioral = BEHAVIORAL_QUESTION_TYPES.has(question.question_type)
      
      // Skip if we already have this question type (avoid duplicates)
      if (usedTypes.has(question.question_type)) continue
      
      // Add question if it helps balance or if we have room
      if (selected.length < 3 || 
          (isTechnical && technicalCount === 0) || 
          (isBehavioral && behavioralCount === 0) ||
          (selected.length < 5 && score > 0)) {
        
        selected.push(question)
        usedTypes.add(question.question_type)
        
        if (isTechnical) technicalCount++
        if (isBehavioral) behavioralCount++
      }
    }
    
    // Ensure we have at least one technical and one behavioral
    if (technicalCount === 0) {
      const technicalQuestion = sorted.find(({question}) => 
        TECHNICAL_QUESTION_TYPES.has(question.question_type) && 
        !selected.includes(question)
      )
      if (technicalQuestion && selected.length < 5) {
        selected.push(technicalQuestion.question)
      }
    }
    
    if (behavioralCount === 0) {
      const behavioralQuestion = sorted.find(({question}) => 
        BEHAVIORAL_QUESTION_TYPES.has(question.question_type) && 
        !selected.includes(question)
      )
      if (behavioralQuestion && selected.length < 5) {
        selected.push(behavioralQuestion.question)
      }
    }
    
    return selected.slice(0, 5) // Max 5 questions
  }

  /**
   * Get fallback questions when no good matches are found
   */
  private getFallbackQuestions(allQuestions: Question[]): Question[] {
    const technical = allQuestions.filter(q => TECHNICAL_QUESTION_TYPES.has(q.question_type))
    const behavioral = allQuestions.filter(q => BEHAVIORAL_QUESTION_TYPES.has(q.question_type))
    
    const selected: Question[] = []
    
    // Add one technical question
    if (technical.length > 0) {
      selected.push(technical[Math.floor(Math.random() * technical.length)])
    }
    
    // Add one behavioral question
    if (behavioral.length > 0) {
      const behavioralChoice = behavioral.find(q => !selected.includes(q))
      if (behavioralChoice) {
        selected.push(behavioralChoice)
      }
    }
    
    // Fill remaining slots with random questions
    const remaining = allQuestions.filter(q => !selected.includes(q))
    while (selected.length < 4 && remaining.length > 0) {
      const randomIndex = Math.floor(Math.random() * remaining.length)
      selected.push(remaining.splice(randomIndex, 1)[0])
    }
    
    return selected
  }

  /**
   * Main recommendation function
   */
  public recommendQuestions(jobDescription: string, allQuestions: Question[]): RecommendationResult {
    // Extract keywords from job description
    const jobKeywords = this.extractKeywords(jobDescription)
    
    // If no keywords or very short description, return fallback
    if (jobKeywords.length < 3) {
      return {
        questions: this.getFallbackQuestions(allQuestions),
        totalMatches: 0,
        isRecommended: false
      }
    }
    
    // Score all questions
    const scoredQuestions = allQuestions.map(question => ({
      question,
      score: this.scoreQuestion(question, jobKeywords)
    }))
    
    // Check if we have any meaningful matches
    const totalMatches = scoredQuestions.reduce((sum, {score}) => sum + score, 0)
    const hasGoodMatches = scoredQuestions.some(({score}) => score >= 3)
    
    if (!hasGoodMatches || totalMatches < 5) {
      return {
        questions: this.getFallbackQuestions(allQuestions),
        totalMatches,
        isRecommended: false
      }
    }
    
    // Select balanced questions
    const recommendedQuestions = this.selectBalancedQuestions(scoredQuestions)
    
    return {
      questions: recommendedQuestions,
      totalMatches,
      isRecommended: true
    }
  }
}

// Export singleton instance
export const recommendationEngine = new RecommendationEngine()