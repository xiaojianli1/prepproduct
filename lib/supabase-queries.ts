import { supabase } from './supabase';
import type { Question } from './recommendation-engine';

/**
 * Fetch all questions from Supabase
 */
export async function fetchAllQuestions(): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('Questions')
      .select('id, title, description, category, difficulty_level, keywords');

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
      .select('id, title, description, category, difficulty_level, keywords')
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