// Comprehensive keyword dictionaries
const TECHNICAL_SKILLS = new Set([
  // Programming Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin',
  'php', 'ruby', 'scala', 'r', 'matlab', 'sql', 'html', 'css', 'sass', 'less',
  
  // Frameworks & Libraries
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'express', 'fastapi', 'django',
  'flask', 'spring', 'laravel', 'rails', 'node.js', 'jquery', 'bootstrap', 'tailwind',
  
  // Databases
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb',
  'sqlite', 'oracle', 'mariadb', 'neo4j', 'influxdb',
  
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins',
  'gitlab', 'github', 'circleci', 'travis', 'helm', 'prometheus', 'grafana',
  
  // Data & Analytics
  'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'spark',
  'hadoop', 'kafka', 'airflow', 'dbt', 'tableau', 'powerbi', 'looker',
  
  // Mobile Development
  'ios', 'android', 'react native', 'flutter', 'xamarin', 'ionic',
  
  // Testing
  'jest', 'cypress', 'selenium', 'junit', 'pytest', 'mocha', 'chai',
  
  // Product Management Tools
  'jira', 'confluence', 'asana', 'trello', 'notion', 'figma', 'sketch', 'adobe xd',
  'miro', 'lucidchart', 'amplitude', 'mixpanel', 'google analytics', 'hotjar',
  
  // Design Tools
  'photoshop', 'illustrator', 'indesign', 'after effects', 'premiere', 'canva',
  'invision', 'principle', 'framer', 'zeplin'
])

const SOFT_SKILLS = new Set([
  'leadership', 'communication', 'teamwork', 'collaboration', 'problem solving',
  'critical thinking', 'creativity', 'adaptability', 'flexibility', 'resilience',
  'time management', 'organization', 'prioritization', 'decision making',
  'analytical thinking', 'strategic thinking', 'innovation', 'mentoring',
  'coaching', 'negotiation', 'presentation', 'public speaking', 'writing',
  'research', 'planning', 'execution', 'project management', 'stakeholder management',
  'customer focus', 'empathy', 'emotional intelligence', 'conflict resolution',
  'influence', 'persuasion', 'networking', 'relationship building'
])

const INDUSTRIES = new Set([
  'fintech', 'healthcare', 'edtech', 'e-commerce', 'retail', 'banking', 'insurance',
  'real estate', 'automotive', 'aerospace', 'energy', 'utilities', 'telecommunications',
  'media', 'entertainment', 'gaming', 'social media', 'marketplace', 'saas',
  'enterprise software', 'consumer software', 'mobile apps', 'web applications',
  'artificial intelligence', 'machine learning', 'blockchain', 'cryptocurrency',
  'iot', 'robotics', 'biotechnology', 'pharmaceuticals', 'medical devices',
  'logistics', 'supply chain', 'manufacturing', 'construction', 'agriculture',
  'food tech', 'travel', 'hospitality', 'sports', 'fitness', 'wellness'
])

const TOOLS_PLATFORMS = new Set([
  'slack', 'microsoft teams', 'zoom', 'google workspace', 'office 365',
  'salesforce', 'hubspot', 'zendesk', 'intercom', 'stripe', 'paypal',
  'shopify', 'wordpress', 'drupal', 'magento', 'woocommerce',
  'mailchimp', 'sendgrid', 'twilio', 'segment', 'datadog', 'newrelic',
  'sentry', 'rollbar', 'postman', 'insomnia', 'swagger', 'api',
  'rest', 'graphql', 'grpc', 'websocket', 'oauth', 'jwt', 'saml'
])

// Role title mappings
const ROLE_MAPPINGS: Record<string, string> = {
  // Product Management
  'product manager': 'product_manager',
  'pm': 'product_manager',
  'product lead': 'product_manager',
  'senior product manager': 'senior_product_manager',
  'principal product manager': 'principal_product_manager',
  'product owner': 'product_manager',
  'product marketing manager': 'product_marketing_manager',
  'growth product manager': 'growth_product_manager',
  'technical product manager': 'technical_product_manager',
  
  // Engineering
  'software engineer': 'software_engineer',
  'software developer': 'software_engineer',
  'developer': 'software_engineer',
  'programmer': 'software_engineer',
  'senior software engineer': 'senior_software_engineer',
  'staff engineer': 'staff_engineer',
  'principal engineer': 'principal_engineer',
  'engineering manager': 'engineering_manager',
  'tech lead': 'tech_lead',
  'technical lead': 'tech_lead',
  'full stack developer': 'fullstack_engineer',
  'frontend developer': 'frontend_engineer',
  'backend developer': 'backend_engineer',
  'mobile developer': 'mobile_engineer',
  'devops engineer': 'devops_engineer',
  'data engineer': 'data_engineer',
  'machine learning engineer': 'ml_engineer',
  
  // Design
  'product designer': 'product_designer',
  'ux designer': 'ux_designer',
  'ui designer': 'ui_designer',
  'ux/ui designer': 'ux_ui_designer',
  'design lead': 'design_lead',
  'senior designer': 'senior_designer',
  'visual designer': 'visual_designer',
  'interaction designer': 'interaction_designer',
  
  // Data & Analytics
  'data scientist': 'data_scientist',
  'data analyst': 'data_analyst',
  'business analyst': 'business_analyst',
  'product analyst': 'product_analyst',
  'research scientist': 'research_scientist',
  
  // Marketing
  'marketing manager': 'marketing_manager',
  'digital marketing manager': 'digital_marketing_manager',
  'content marketing manager': 'content_marketing_manager',
  'growth marketing manager': 'growth_marketing_manager',
  'brand manager': 'brand_manager',
  
  // Operations & Strategy
  'operations manager': 'operations_manager',
  'strategy manager': 'strategy_manager',
  'business development manager': 'business_development_manager',
  'program manager': 'program_manager',
  'project manager': 'project_manager',
  
  // Sales & Customer Success
  'sales manager': 'sales_manager',
  'account manager': 'account_manager',
  'customer success manager': 'customer_success_manager',
  'sales engineer': 'sales_engineer',
  
  // Executive
  'ceo': 'ceo',
  'cto': 'cto',
  'cpo': 'cpo',
  'vp product': 'vp_product',
  'vp engineering': 'vp_engineering',
  'head of product': 'head_of_product',
  'head of engineering': 'head_of_engineering'
}

// Seniority level mappings
const SENIORITY_KEYWORDS = {
  intern: ['intern', 'internship', 'student', 'entry level', 'graduate', 'new grad'],
  junior: ['junior', 'associate', 'entry', 'level 1', 'l1', 'i', '0-2 years'],
  mid: ['mid', 'intermediate', 'level 2', 'l2', 'ii', '2-5 years', '3-6 years'],
  senior: ['senior', 'sr', 'lead', 'principal', 'staff', 'level 3', 'l3', 'iii', 
           '5+ years', '6+ years', '7+ years', 'experienced', 'expert']
}

/**
 * Extract relevant keywords from text (job descriptions, resumes, role titles)
 * @param text - Input text to extract keywords from
 * @returns Array of normalized keywords
 */
export function extractKeywords(text: string): string[] {
  if (!text || typeof text !== 'string') return []
  
  // Normalize text: lowercase, remove special characters, split into words
  const normalizedText = text.toLowerCase()
    .replace(/[^\w\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  const keywords = new Set<string>()
  
  // Extract multi-word technical terms first (e.g., "machine learning", "react native")
  const multiWordTerms = [
    'machine learning', 'artificial intelligence', 'data science', 'computer vision',
    'natural language processing', 'deep learning', 'react native', 'next.js',
    'node.js', 'google analytics', 'adobe xd', 'after effects', 'google workspace',
    'office 365', 'microsoft teams', 'supply chain', 'customer success',
    'business development', 'product management', 'project management',
    'software engineering', 'data engineering', 'devops engineering'
  ]
  
  multiWordTerms.forEach(term => {
    if (normalizedText.includes(term)) {
      keywords.add(term.replace(/\s+/g, ' '))
    }
  })
  
  // Extract single words and check against dictionaries
  const words = normalizedText.split(/\s+/)
  
  words.forEach(word => {
    // Skip very short words and common stop words
    if (word.length < 2) return
    
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
    if (stopWords.has(word)) return
    
    // Convert plural to singular (basic rules)
    const singular = word.endsWith('s') && word.length > 3 ? word.slice(0, -1) : word
    
    // Check against skill dictionaries
    if (TECHNICAL_SKILLS.has(word) || TECHNICAL_SKILLS.has(singular)) {
      keywords.add(TECHNICAL_SKILLS.has(word) ? word : singular)
    }
    if (SOFT_SKILLS.has(word) || SOFT_SKILLS.has(singular)) {
      keywords.add(SOFT_SKILLS.has(word) ? word : singular)
    }
    if (INDUSTRIES.has(word) || INDUSTRIES.has(singular)) {
      keywords.add(INDUSTRIES.has(word) ? word : singular)
    }
    if (TOOLS_PLATFORMS.has(word) || TOOLS_PLATFORMS.has(singular)) {
      keywords.add(TOOLS_PLATFORMS.has(word) ? word : singular)
    }
  })
  
  // Extract years of experience
  const experienceMatch = normalizedText.match(/(\d+)[\s-]*(?:years?|yrs?)/i)
  if (experienceMatch) {
    keywords.add(`${experienceMatch[1]}_years_experience`)
  }
  
  return Array.from(keywords)
}

/**
 * Standardize role titles to consistent categories
 * @param roleTitle - Raw role title
 * @returns Standardized role category
 */
export function normalizeRole(roleTitle: string): string {
  if (!roleTitle || typeof roleTitle !== 'string') return 'unknown'
  
  const normalized = roleTitle.toLowerCase().trim()
  
  // Direct mapping lookup
  if (ROLE_MAPPINGS[normalized]) {
    return ROLE_MAPPINGS[normalized]
  }
  
  // Fuzzy matching for variations
  for (const [key, value] of Object.entries(ROLE_MAPPINGS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value
    }
  }
  
  // Extract base role from complex titles
  if (normalized.includes('product') && normalized.includes('manager')) {
    return 'product_manager'
  }
  if (normalized.includes('software') && (normalized.includes('engineer') || normalized.includes('developer'))) {
    return 'software_engineer'
  }
  if (normalized.includes('data') && normalized.includes('scientist')) {
    return 'data_scientist'
  }
  if (normalized.includes('designer')) {
    return 'product_designer'
  }
  
  return 'unknown'
}

/**
 * Categorize keywords into skill types
 * @param keywords - Array of keywords to categorize
 * @returns Object with categorized skills
 */
export function categorizeSkills(keywords: string[]): {
  technical: string[]
  soft: string[]
  industries: string[]
  tools: string[]
  experience: string[]
} {
  const categorized = {
    technical: [] as string[],
    soft: [] as string[],
    industries: [] as string[],
    tools: [] as string[],
    experience: [] as string[]
  }
  
  keywords.forEach(keyword => {
    if (keyword.includes('_years_experience')) {
      categorized.experience.push(keyword)
    } else if (TECHNICAL_SKILLS.has(keyword)) {
      categorized.technical.push(keyword)
    } else if (SOFT_SKILLS.has(keyword)) {
      categorized.soft.push(keyword)
    } else if (INDUSTRIES.has(keyword)) {
      categorized.industries.push(keyword)
    } else if (TOOLS_PLATFORMS.has(keyword)) {
      categorized.tools.push(keyword)
    }
  })
  
  return categorized
}

/**
 * Determine appropriate question difficulty based on role and experience
 * @param roleTitle - Job role title
 * @param experience - Years of experience or experience keywords
 * @returns Difficulty level
 */
export function determineDifficulty(roleTitle: string, experience?: string | number): 'Intern' | 'Associate' | 'Mid' | 'Senior' {
  const normalizedRole = normalizeRole(roleTitle)
  const roleText = roleTitle.toLowerCase()
  
  // Check for explicit seniority in role title
  if (SENIORITY_KEYWORDS.intern.some(keyword => roleText.includes(keyword))) {
    return 'Intern'
  }
  if (SENIORITY_KEYWORDS.associate.some(keyword => roleText.includes(keyword))) {
    return 'Associate'
  }
  if (SENIORITY_KEYWORDS.senior.some(keyword => roleText.includes(keyword))) {
    return 'Senior'
  }
  
  // Check experience parameter
  if (experience !== undefined) {
    let years = 0
    
    if (typeof experience === 'number') {
      years = experience
    } else if (typeof experience === 'string') {
      const experienceText = experience.toLowerCase()
      
      // Check for seniority keywords in experience text
      if (SENIORITY_KEYWORDS.intern.some(keyword => experienceText.includes(keyword))) {
        return 'Intern'
      }
      if (SENIORITY_KEYWORDS.associate.some(keyword => experienceText.includes(keyword))) {
        return 'Associate'
      }
      if (SENIORITY_KEYWORDS.senior.some(keyword => experienceText.includes(keyword))) {
        return 'Senior'
      }
      
      // Extract years from text
      const yearMatch = experienceText.match(/(\d+)/)
      if (yearMatch) {
        years = parseInt(yearMatch[1])
      }
    }
    
    // Map years to difficulty
    if (years === 0) return 'Intern'
    if (years <= 2) return 'Associate'
    if (years <= 5) return 'Mid'
    return 'Senior'
  }
  
  // Default mapping based on role level
  if (normalizedRole.includes('intern') || normalizedRole.includes('entry')) {
    return 'Intern'
  }
  if (normalizedRole.includes('junior') || normalizedRole.includes('associate')) {
    return 'Associate'
  }
  if (normalizedRole.includes('senior') || normalizedRole.includes('lead') || 
      normalizedRole.includes('principal') || normalizedRole.includes('staff')) {
    return 'Senior'
  }
  
  // Default to Mid for standard roles
  return 'Mid'
}

/**
 * Calculate keyword similarity between two sets of keywords
 * @param keywords1 - First set of keywords
 * @param keywords2 - Second set of keywords
 * @returns Similarity score between 0 and 1
 */
export function calculateKeywordSimilarity(keywords1: string[], keywords2: string[]): number {
  if (!keywords1.length || !keywords2.length) return 0
  
  const set1 = new Set(keywords1)
  const set2 = new Set(keywords2)
  
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return intersection.size / union.size
}

/**
 * Get skill weight for recommendation scoring
 * @param skill - Skill keyword
 * @returns Weight multiplier for the skill
 */
export function getSkillWeight(skill: string): number {
  // Higher weights for more specific/valuable skills
  const highValueSkills = new Set([
    'machine learning', 'artificial intelligence', 'data science', 'blockchain',
    'kubernetes', 'aws', 'azure', 'gcp', 'tensorflow', 'pytorch',
    'product management', 'leadership', 'strategic thinking'
  ])
  
  const mediumValueSkills = new Set([
    'python', 'javascript', 'react', 'node.js', 'sql', 'docker',
    'communication', 'problem solving', 'teamwork'
  ])
  
  if (highValueSkills.has(skill)) return 2.0
  if (mediumValueSkills.has(skill)) return 1.5
  return 1.0
}