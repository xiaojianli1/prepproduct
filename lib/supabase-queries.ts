import { supabase } from './supabase';
import type { Question } from './recommendation-engine';

/**
 * Fetch all questions from Supabase
 */
export async function fetchAllQuestions(): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('Questions')
      .select('id, question_text, question_type, difficulty_level, keywords, company, sample_answer');

    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

/**
 * Fetch questions by IDs
 */
export async function fetchQuestionsByIds(ids: string[]): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('Questions')
      .select('id, question_text, question_type, difficulty_level, keywords, company, sample_answer')
      .in('id', ids);

    if (error) {
      console.error('Error fetching questions by IDs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching questions by IDs:', error);
    return [];
  }
}