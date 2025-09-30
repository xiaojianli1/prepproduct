// Simple test to check if OpenAI API key is configured
const OpenAI = require('openai');

async function testOpenAIKey() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('Testing OpenAI API key...');
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY environment variable is not set');
      return;
    }

    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
      console.error('❌ OPENAI_API_KEY does not appear to be valid (should start with "sk-")');
      return;
    }

    // Test with a simple completion request
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5
    });

    console.log('✅ OpenAI API key is working correctly');
    console.log('Response:', response.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ OpenAI API key test failed:');
    console.error(error.message);
    
    if (error.status === 401) {
      console.error('This usually means the API key is invalid or expired');
    }
  }
}

testOpenAIKey();