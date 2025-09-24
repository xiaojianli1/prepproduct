// Supabase database queries for the interview app

import { supabase } from './supabase'

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

/**
 * Fetch all questions from the database
 */
export async function fetchAllQuestions(): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('id')

    if (error) {
      console.error('Error fetching questions:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch questions:', error)
    throw error
  }
}

/**
 * Fetch questions by category
 */
export async function fetchQuestionsByCategory(category: string): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category', category)
      .order('id')

    if (error) {
      console.error('Error fetching questions by category:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch questions by category:', error)
    throw error
  }
}

/**
 * Fetch questions by difficulty level
 */
export async function fetchQuestionsByDifficulty(difficulty: string): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('difficulty', difficulty)
      .order('id')

    if (error) {
      console.error('Error fetching questions by difficulty:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch questions by difficulty:', error)
    throw error
  }
}