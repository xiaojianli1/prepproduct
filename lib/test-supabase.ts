import { supabase } from './supabase'

export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test 1: Check if client is initialized
    console.log('Supabase URL:', supabase.supabaseUrl)
    console.log('Supabase Key (first 20 chars):', supabase.supabaseKey.substring(0, 20) + '...')
    
    // Test 2: Simple query to check connection
    const { data, error, count } = await supabase
      .from('Questions')
      .select('*', { count: 'exact' })
      .limit(1)
    
    if (error) {
      console.error('Supabase query error:', error)
      return { success: false, error: error.message, details: error }
    }
    
    console.log('Connection successful!')
    console.log('Total questions in table:', count)
    console.log('Sample question:', data?.[0])
    
    return { 
      success: true, 
      count, 
      sampleData: data,
      message: 'Supabase connection working correctly'
    }
    
  } catch (error) {
    console.error('Connection test failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }
  }
}