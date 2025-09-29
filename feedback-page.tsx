"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CircleCheck as CheckCircle, Download, RotateCcw, Lightbulb, ChartBar as BarChart3, Clock, User, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { feedbackData, sampleAnswers } from "@/lib/feedback-data"

const tabIcons = {
  "Product Sense": Lightbulb,
  Structure: BarChart3,
  Conciseness: Clock,
  Personalization: User,
}

interface FeedbackPageProps {
  onBack?: () => void
  onPracticeAgain?: () => void
  questions?: any[]
  userAnswers?: {[key: number]: string}
}

export default function FeedbackPage({ onBack, onPracticeAgain, questions = [], userAnswers = {} }: FeedbackPageProps) {
  const [activeTab, setActiveTab] = useState("Product Sense")
  const [isLoaded, setIsLoaded] = useState(false)
  const [reviewProgress, setReviewProgress] = useState(0)
  const [viewedTabs, setViewedTabs] = useState<Set<string>>(new Set(["Product Sense"]))
  const [expandedSamples, setExpandedSamples] = useState<Set<number>>(new Set())
  const [expandedUserAnswers, setExpandedUserAnswers] = useState<Set<number>>(new Set())

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

  const toggleUserAnswer = (questionId: number) => {
    setExpandedUserAnswers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  // Use the actual questions passed from the interview or fallback to feedbackData
  const questionsToDisplay = questions.length > 0 ? questions : feedbackData

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
            {questionsToDisplay.map((item, index) => {
              const questionId = item.id || index + 1
              const userAnswer = userAnswers[index] || ""
              
              return (
              <div
                key={questionId}
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
                        <div className="text-sm text-blue-300 font-medium">{item.question_type || item.type}</div>
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
                      {Object.keys(item.insights || feedbackData[0]?.insights || {}).map((tab) => {
                        const Icon = tabIcons[tab as keyof typeof tabIcons]
                        const isActive = activeTab === tab
                        const isViewed = viewedTabs.has(tab)
                        return (
                          <button
                            key={tab}
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
                            title={(item.insights || feedbackData[0]?.insights)?.[tab as keyof typeof (item.insights || feedbackData[0]?.insights)]?.explanation}
                          >
                            <Icon
                              className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                            />
                            {tab}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-64 text-center">
                              {(item.insights || feedbackData[0]?.insights)?.[tab as keyof typeof (item.insights || feedbackData[0]?.insights)]?.explanation}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Enhanced feedback section */}
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
                          {(item.insights || feedbackData[0]?.insights)?.[activeTab as keyof typeof (item.insights || feedbackData[0]?.insights)]?.feedback}
                        </div>
                      </div>
                    </div>

                    {/* Your Answer Section */}
                    {userAnswer && (
                      <div className="border-t border-white/10 pt-6">
                        <button
                          onClick={() => toggleUserAnswer(questionId)}
                          className="flex items-center justify-between w-full text-left group rounded-lg p-3 transition-all duration-200"
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
                              expandedUserAnswers.has(questionId) ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {/* Expandable User Answer Content */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-out ${
                            expandedUserAnswers.has(questionId) ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="pt-4 space-y-4">
                            {/* User Answer Content */}
                            <div
                              className="text-sm text-white/60 leading-relaxed p-4 rounded-lg border border-white/10 hover:border-white/15 transition-colors duration-200"
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                              }}
                            >
                              {userAnswer}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sample Answer Section */}
                    <div className="border-t border-white/10 pt-6">
                      <button
                        onClick={() => toggleSampleAnswer(questionId)}
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
                            expandedSamples.has(questionId) ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {/* Expandable Sample Answer Content */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-out ${
                          expandedSamples.has(questionId) ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pt-4 space-y-4">
                          {/* Sample Answer Header */}
                          <div className="flex items-center gap-2 px-3">
                            <div className="w-4 h-0.5 bg-white/30 rounded-full" />
                            <span className="text-xs font-medium text-white/70 tracking-wide uppercase">
                              {sampleAnswers[questionId as keyof typeof sampleAnswers]?.title || "Strong Sample Answer"}
                            </span>
                          </div>

                          {/* Sample Answer Content */}
                          <div
                            className="text-sm text-white/60 leading-relaxed p-4 rounded-lg border border-white/10 hover:border-white/15 transition-colors duration-200"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                            }}
                          >
                            {sampleAnswers[questionId as keyof typeof sampleAnswers]?.content || "Sample answer not available for this question."}
                          </div>

                          {/* Key Strengths */}
                          <div className="space-y-2 px-3">
                            <div className="text-xs font-medium text-white/50 uppercase tracking-wider">
                              Key Strengths
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {(sampleAnswers[questionId as keyof typeof sampleAnswers]?.keyStrengths || []).map(
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
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )
            })}
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