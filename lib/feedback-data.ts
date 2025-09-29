// Sample feedback data for each question
export const feedbackData = [
  {
    id: 1,
    type: "Background question",
    question_text: "Tell me about a time when you had to prioritize features for a product with limited resources.",
    answer:
      "In my previous role at TechCorp, we were launching a new mobile app with a tight deadline and limited engineering resources. I had to prioritize between user authentication, core functionality, and advanced features. I used the RICE framework to evaluate each feature based on reach, impact, confidence, and effort. I prioritized user authentication and core functionality first, then planned advanced features for the next sprint. This approach helped us launch on time while ensuring the most critical user needs were met.",
    insights: {
      "Product Sense": {
        explanation:
          "This evaluates your understanding of user needs, market dynamics, and business impact when making product decisions.",
        feedback:
          "Strong demonstration of prioritization frameworks and user-centric thinking. You effectively used the RICE framework and showed clear understanding of user needs hierarchy. Consider mentioning specific metrics or user research that informed your decisions.",
        highlights: ["RICE framework usage", "User-centric prioritization", "Resource constraint management"],
      },
      Structure: {
        explanation: "This measures how well you organized your response using clear frameworks and logical flow.",
        feedback:
          "Clear STAR format with specific examples and measurable outcomes. Your response followed a logical progression from problem identification to solution implementation. The timeline and decision-making process were well articulated.",
        highlights: ["STAR methodology", "Logical flow", "Clear timeline"],
      },
      Conciseness: {
        explanation:
          "This assesses your ability to communicate effectively within time constraints while covering key points.",
        feedback:
          "Well-balanced detail level - comprehensive yet focused. You covered all essential points without unnecessary elaboration. Consider adding one specific metric to strengthen the impact statement.",
        highlights: ["Balanced detail", "Key points covered", "Focused delivery"],
      },
      Personalization: {
        explanation:
          "This looks at how well you connected your experiences to the role and demonstrated relevant skills.",
        feedback:
          "Good use of specific company context and personal experience. You clearly connected your past experience to product management skills. Adding more details about stakeholder management would strengthen this further.",
        highlights: ["Specific company context", "Relevant experience", "PM skills demonstration"],
      },
    },
  },
  {
    id: 2,
    type: "Situational question",
    question_text: "Describe a situation where you had to launch a product feature that didn't perform as expected.",
    answer:
      "We launched a recommendation engine feature that had low user engagement. I analyzed user behavior data and found that users weren't discovering the feature. I worked with the design team to improve the UI placement and with engineering to add onboarding tooltips. We also A/B tested different approaches. After these changes, engagement increased by 40% over the next month.",
    insights: {
      "Product Sense": {
        explanation:
          "This evaluates your understanding of user needs, market dynamics, and business impact when making product decisions.",
        feedback:
          "Excellent data-driven approach and iterative improvement mindset. You demonstrated strong analytical skills and user behavior understanding. The systematic approach to feature optimization shows mature product thinking.",
        highlights: ["Data-driven analysis", "User behavior insights", "Iterative improvement"],
      },
      Structure: {
        explanation: "This measures how well you organized your response using clear frameworks and logical flow.",
        feedback:
          "Good problem-solution narrative with clear metrics. Your response effectively moved from problem identification through analysis to solution and results. The 40% improvement metric provides strong closure.",
        highlights: ["Problem-solution flow", "Clear metrics", "Results-focused"],
      },
      Conciseness: {
        explanation:
          "This assesses your ability to communicate effectively within time constraints while covering key points.",
        feedback:
          "Could benefit from more specific details about the analysis process. While concise, adding brief details about the specific data points analyzed would strengthen the response without making it verbose.",
        highlights: ["Efficient communication", "Room for analysis details", "Good time management"],
      },
      Personalization: {
        explanation:
          "This looks at how well you connected your experiences to the role and demonstrated relevant skills.",
        feedback:
          "Strong cross-functional collaboration examples. You effectively highlighted collaboration with design and engineering teams. This demonstrates key PM skills in stakeholder management and cross-team coordination.",
        highlights: ["Cross-functional collaboration", "Team coordination", "PM skill demonstration"],
      },
    },
  },
  {
    id: 3,
    type: "Process question",
    question_text: "How would you approach gathering and incorporating user feedback for a new product feature?",
    answer:
      "I would start with user interviews to understand pain points, then create prototypes for usability testing. I'd use surveys for quantitative data and set up analytics to track user behavior. For incorporation, I'd categorize feedback by impact and feasibility, then work with engineering to prioritize implementation. I'd also establish a feedback loop to measure the success of changes.",
    insights: {
      "Product Sense": {
        explanation:
          "This evaluates your understanding of user needs, market dynamics, and business impact when making product decisions.",
        feedback:
          "Comprehensive understanding of user research methodologies. You demonstrated knowledge of both qualitative and quantitative research methods. The systematic approach shows strong product intuition and user-centric thinking.",
        highlights: ["Research methodology", "Qual/quant balance", "User-centric approach"],
      },
      Structure: {
        explanation: "This measures how well you organized your response using clear frameworks and logical flow.",
        feedback:
          "Logical flow from research to implementation to measurement. Your response followed a clear process: gather → analyze → implement → measure. This systematic approach demonstrates strong organizational thinking.",
        highlights: ["Process-driven approach", "Logical sequence", "End-to-end thinking"],
      },
      Conciseness: {
        explanation:
          "This assesses your ability to communicate effectively within time constraints while covering key points.",
        feedback:
          "Good balance of breadth and depth in the response. You covered the full spectrum of user feedback processes efficiently. The response was comprehensive without being overwhelming.",
        highlights: ["Comprehensive coverage", "Efficient delivery", "Balanced depth"],
      },
      Personalization: {
        explanation:
          "This looks at how well you connected your experiences to the role and demonstrated relevant skills.",
        feedback:
          "Could include more specific examples from past experience. While the process knowledge is strong, adding a brief example of when you've applied these methods would make the response more compelling and personal.",
        highlights: ["Process knowledge", "Room for examples", "Methodological strength"],
      },
    },
  },
]

export const sampleAnswers = {
  1: {
    title: "Strong Sample Answer",
    content:
      "At my previous company, we faced a similar resource constraint when launching our mobile platform. I implemented a systematic approach using the MoSCoW prioritization method. First, I conducted stakeholder interviews to understand business objectives, then analyzed user research data to identify the most critical user journeys. I categorized features into Must-have (core authentication and basic functionality), Should-have (user onboarding flow), Could-have (social sharing), and Won't-have for this release (advanced analytics). This framework helped me communicate trade-offs clearly to leadership and engineering teams. We delivered the MVP 2 weeks ahead of schedule, achieving 85% user satisfaction in our first month, and the delayed features were successfully implemented in the following quarter with 40% higher engagement due to better user feedback integration.",
    keyStrengths: [
      "Specific framework usage (MoSCoW)",
      "Quantifiable results (85% satisfaction, 40% engagement)",
      "Clear stakeholder communication",
      "Data-driven decision making",
    ],
  },
  2: {
    title: "Strong Sample Answer",
    content:
      "We launched a personalized content recommendation feature that initially showed only 12% user engagement. I immediately initiated a comprehensive analysis using both quantitative and qualitative methods. Through user session recordings, I discovered users weren't noticing the feature due to poor placement. Heat map analysis revealed users' attention was focused on the main content area, not the sidebar where we placed recommendations. I conducted 15 user interviews and found that users wanted more control over recommendation categories. Working with our design team, we moved recommendations to the main feed with clear labeling, added category filters, and implemented a feedback mechanism. We A/B tested three different layouts with 10,000 users each. The winning design increased engagement to 47% within 6 weeks, and user feedback scores improved from 2.1 to 4.3 out of 5.",
    keyStrengths: [
      "Multi-method analysis approach",
      "Specific metrics and sample sizes",
      "User-centered problem solving",
      "Iterative testing methodology",
    ],
  },
  3: {
    title: "Strong Sample Answer",
    content:
      "My approach follows a structured 5-phase methodology I've refined over multiple product launches. Phase 1: Discovery - I start with user interviews (typically 8-12 users per segment) and contextual inquiries to understand pain points. Phase 2: Hypothesis Formation - I create user journey maps and identify specific friction points to test. Phase 3: Prototype Testing - I build low-fi prototypes and conduct moderated usability sessions with 15-20 users, using both task-based scenarios and open exploration. Phase 4: Quantitative Validation - I deploy surveys to our broader user base (minimum 500 responses) and implement feature flags for behavioral tracking. Phase 5: Implementation & Iteration - I work with engineering to prioritize feedback using impact/effort matrices, then establish success metrics and feedback loops. For example, when developing our checkout flow, this process helped us identify that users wanted guest checkout options, leading to a 23% increase in conversion rates. I maintain ongoing feedback channels through in-app surveys, support ticket analysis, and quarterly user advisory board meetings.",
    keyStrengths: [
      "Systematic 5-phase methodology",
      "Specific sample sizes and metrics",
      "Concrete example with results",
      "Ongoing feedback mechanisms",
    ],
  },
}