// Simple keyword-based recommendation engine
export interface Question {
  id: string;
  question_text: string;
  company: string;
  difficulty_level: string;
  keywords: string;
  sample_answer: string;
}

export interface RecommendedQuestion extends Question {
  score: number;
  matchedKeywords: string[];
}

/**
 * Extract meaningful keywords from job description
 */
export function extractKeywords(jobDescription: string): string[] {
  if (!jobDescription) return [];
  
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ]);

  return jobDescription
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
}

/**
 * Calculate similarity score between job keywords and question keywords
 */
export function calculateScore(jobKeywords: string[], questionKeywords: string): number {
  if (!questionKeywords) return 0;
  
  const qKeywords = questionKeywords.toLowerCase().split(/[,\s]+/).filter(k => k.length > 0);
  let score = 0;
  const matchedKeywords: string[] = [];

  for (const jobKeyword of jobKeywords) {
    for (const qKeyword of qKeywords) {
      // Exact match
      if (jobKeyword === qKeyword) {
        score += 3;
        matchedKeywords.push(qKeyword);
      }
      // Partial match (contains)
      else if (jobKeyword.includes(qKeyword) || qKeyword.includes(jobKeyword)) {
        score += 1;
        matchedKeywords.push(qKeyword);
      }
    }
  }

  return score;
}

/**
 * Get recommended questions based on job description
 */
export function getRecommendedQuestions(
  jobDescription: string,
  allQuestions: Question[]
): RecommendedQuestion[] {
  const jobKeywords = extractKeywords(jobDescription);
  
  if (jobKeywords.length === 0) {
    // Return random 3-5 questions if no keywords
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(5, shuffled.length)).map(q => ({
      ...q,
      score: 0,
      matchedKeywords: []
    }));
  }

  // Score all questions
  const scoredQuestions: RecommendedQuestion[] = allQuestions.map(question => {
    const score = calculateScore(jobKeywords, question.keywords);
    const matchedKeywords = getMatchedKeywords(jobKeywords, question.keywords);
    
    return {
      ...question,
      score,
      matchedKeywords
    };
  });

  // Sort by score (highest first) and take top 3-5
  const recommended = scoredQuestions
    .filter(q => q.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // If we have fewer than 3 recommendations, fill with random questions
  if (recommended.length < 3) {
    const remaining = allQuestions
      .filter(q => !recommended.find(r => r.id === q.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 - recommended.length)
      .map(q => ({
        ...q,
        score: 0,
        matchedKeywords: []
      }));
    
    recommended.push(...remaining);
  }

  return recommended.slice(0, 5);
}

/**
 * Get matched keywords between job and question
 */
function getMatchedKeywords(jobKeywords: string[], questionKeywords: string): string[] {
  if (!questionKeywords) return [];
  
  const qKeywords = questionKeywords.toLowerCase().split(/[,\s]+/).filter(k => k.length > 0);
  const matched: string[] = [];

  for (const jobKeyword of jobKeywords) {
    for (const qKeyword of qKeywords) {
      if (jobKeyword === qKeyword || jobKeyword.includes(qKeyword) || qKeyword.includes(jobKeyword)) {
        if (!matched.includes(qKeyword)) {
          matched.push(qKeyword);
        }
      }
    }
  }

  return matched;
}