"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CircleCheck as CheckCircle, Download, RotateCcw, Lightbulb, ChartBar as BarChart3, Clock, User, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample feedback data for each question
const feedbackData = [
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

const sampleAnswers = {
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

const tabIcons = {
  "Product Sense": Lightbulb,
  Structure: BarChart3,
  Conciseness: Clock,
  Personalization: User,
}

interface FeedbackPageProps {
  onBack?: () => void
  onPracticeAgain?: () => void
  userAnswers?: {[key: number]: string}
  questions?: any[]
}

export default function FeedbackPage({ onBack, onPracticeAgain, userAnswers = {}, questions = [] }: FeedbackPageProps) {
  const [activeTab, setActiveTab] = useState("Product Sense")
  const [isLoaded, setIsLoaded] = useState(false)
  const [reviewProgress, setReviewProgress] = useState(0)
  const [viewedTabs, setViewedTabs] = useState<Set<string>>(new Set(["Product Sense"]))
  const [expandedSamples, setExpandedSamples] = useState<Set<number>>(new Set())
  const [expandedAnswers, setExpandedAnswers] = useState<Set<number>>(new Set())

  const questionsToDisplay = questions.length > 0 ? questions : feedbackData

  const toggleUserAnswer = (index: number) => {
    setExpandedAnswers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  useEffect(() => {
    setIsLoaded(true)
    const totalTabs = Object.keys(feedbackData[0].insights).length // 4 unique tabs
    setReviewProgress((viewedTabs.size / totalTabs) * 100)
  }, [viewedTabs])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setViewedTabs((prev) => new Set([...prev, tab]))
  }

  const toggleSampleAnswer = (questionId: number) => {
    setExpandedSamples((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0B0B0F 0%, #0F0F14 25%, #12121A 50%, #0F0F14 75%, #0B0B0F 100%)",
      }}
    >
      {/* Enhanced animated background overlay */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.06) 0%, transparent 50%)",
          animation: "pulse 8s ease-in-out infinite",
        }}
      />

      {/* Navigation Header with progress */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-12 h-12 rounded-xl backdrop-blur-xl border border-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 group"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <ArrowLeft
            className="w-5 h-5 text-white/90 group-hover:text-white transition-colors duration-200"
            strokeWidth={1.5}
          />
        </Button>

        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-xl border border-white/10"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="text-xs text-white/60">Review Progress</div>
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${reviewProgress}%` }}
            />
          </div>
          <div className="text-xs text-white/80 font-medium">{Math.round(reviewProgress)}%</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-20 pb-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section with entrance animation */}
          <div
            className={`text-center space-y-6 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Enhanced Success Icon */}
            <div className="flex justify-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center relative hover:scale-105 transition-transform duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.3) 100%)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 16px 40px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
              >
                <CheckCircle className="w-10 h-10 text-green-400 animate-pulse" strokeWidth={1.5} />
              </div>
            </div>

            {/* Congratulations Text */}
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-white tracking-tight">Congrats, you did it! Let's review.</h1>
              <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                Use the insight buttons to learn more about your answers. Try to reflect on what you said from the
                perspective of an interviewer. Identify what you'd like to improve, then practice again.
              </p>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                className="px-6 py-3 rounded-xl font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Save your answers
              </Button>
              <Button
                onClick={onPracticeAgain}
                className="px-6 py-3 rounded-xl font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                style={{
                  background: "linear-gradient(135deg, #007AFF 0%, #0056CC 100%)",
                  boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                  color: "white",
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Practice again
              </Button>
            </div>
          </div>

          {/* Question Cards with staggered entrance animations */}
          <div className="space-y-6">
            {questionsToDisplay.map((item, index) => (
              <div
                key={item.id || index}
                className={`rounded-2xl backdrop-blur-3xl border border-white/15 shadow-xl relative overflow-hidden hover:border-white/25 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  boxShadow:
                    "0 16px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                {/* Enhanced inner glow with hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/8 via-transparent to-blue-500/5 pointer-events-none group-hover:from-white/12 group-hover:to-blue-500/8 transition-all duration-500" />

                <div className="p-6 space-y-6 relative z-10">
                  {/* Question Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                        <div className="text-sm text-blue-300 font-medium">{item.type}</div>
                      </div>
                    </div>
                    <div className="text-sm text-white/50 font-medium flex items-center gap-1">
                      {index + 1}/{questionsToDisplay.length}
                      <ChevronRight className="w-3 h-3 opacity-50" />
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-white leading-relaxed">{item.question_text || item.question}</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Enhanced Feedback Tabs */}
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(item.insights || {}).map((tab) => {
                        const Icon = tabIcons[tab as keyof typeof tabIcons]
                        const isActive = activeTab === tab
                        const isViewed = viewedTabs.has(tab)
                        return (
                          <div key={tab} className="relative group">
                            <button
                              onClick={() => handleTabChange(tab)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden group ${
                                isActive ? "bg-blue-500 text-white shadow-lg" : "text-white/60 hover:text-white/80"
                              }`}
                              style={
                                isActive
                                  ? {
                                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                                    }
                                  : {}
                              }
                              title={item.insights?.[tab as keyof typeof item.insights]?.explanation}
                            >
                              <Icon
                                className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                              />
                              {tab}
                            </button>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap max-w-xs">
                              {item.insights?.[tab as keyof typeof item.insights]?.explanation}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Enhanced feedback section - only show if insights exist */}
                    {item.insights && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-0.5 bg-blue-500 rounded-full" />
                          <span className="text-sm font-medium text-white/80 tracking-wide">Feedback</span>
                        </div>

                        <div className="space-y-4">
                          <div
                            className="text-white/80 leading-relaxed text-sm rounded-xl p-4 border border-white/10 hover:border-white/15 transition-all duration-300"
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                          >
                            {item.insights[activeTab as keyof typeof item.insights]?.feedback}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Your Answer Section */}
                    <div className="border-t border-white/10 pt-6">
                      <button
                        onClick={() => toggleUserAnswer(index)}
                        className="flex items-center justify-between w-full text-left group rounded-lg p-3 transition-all duration-200 mb-4"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                          <span className="text-sm font-medium text-white/60 group-hover:text-white/80 transition-colors">
                            Your answer
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-white/40 group-hover:text-white/60 transition-all duration-200 ${
                            expandedAnswers.has(index) ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {/* Expandable User Answer Content */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-out mb-4 ${
                          expandedAnswers.has(index) ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pt-4 space-y-4">
                          {/* User Answer Content */}
                          <div
                            className="text-sm leading-relaxed p-4 rounded-lg border border-white/10 hover:border-white/15 transition-colors duration-200"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                            }}
                          >
                            {userAnswers[index] ? (
                              <span className="text-white/70">{userAnswers[index]}</span>
                            ) : (
                              <span className="text-white/50 italic">No answer recorded</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sample Answer Section */}
                      <button
                        onClick={() => toggleSampleAnswer(item.id || index)}
                        className="flex items-center justify-between w-full text-left group rounded-lg p-3 transition-all duration-200"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                          <span className="text-sm font-medium text-white/60 group-hover:text-white/80 transition-colors">
                            See sample answer
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-white/40 group-hover:text-white/60 transition-all duration-200 ${
                            expandedSamples.has(item.id || index) ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {/* Expandable Sample Answer Content */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-out ${
                          expandedSamples.has(item.id || index) ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pt-4 space-y-4">
                          {/* Sample Answer Header */}
                          <div className="flex items-center gap-2 px-3">
                            <div className="w-4 h-0.5 bg-white/30 rounded-full" />
                            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                              {sampleAnswers[item.id as keyof typeof sampleAnswers]?.title || "Sample Answer"}
                            </span>
                          </div>

                          {/* Sample Answer Content */}
                          <div
                            className="text-sm text-white/60 leading-relaxed p-4 rounded-lg border border-white/10 hover:border-white/15 transition-colors duration-200"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                            }}
                          >
                            {sampleAnswers[item.id as keyof typeof sampleAnswers]?.content || "Sample answer not available"}
                          </div>

                          {/* Key Strengths */}
                          <div className="space-y-2 px-3">
                            <div className="text-xs font-medium text-white/50 uppercase tracking-wider">
                              Key Strengths
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(sampleAnswers[item.id as keyof typeof sampleAnswers]?.keyStrengths || []).map(
                                (strength, strengthIndex) => (
                                  <span
                                    key={strengthIndex}
                                    className="px-2 py-1 rounded-md text-xs font-medium border border-white/20 hover:border-white/30 transition-colors duration-200"
                                    style={{
                                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                                      color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                  >
                                    {strength}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
