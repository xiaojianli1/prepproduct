"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getQuestionRecommendations, type InterviewQuestion } from "@/lib/question-recommendations"
import type { UserData } from "./app"

interface QuestionSelectionProps {
  onStartSession?: (questions: InterviewQuestion[]) => void
  onBack?: () => void // Added onBack prop for navigation
  userData: UserData
}

export default function QuestionSelection({ onStartSession, onBack, userData }: QuestionSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels")
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [allQuestions, setAllQuestions] = useState<InterviewQuestion[]>([])
  const [recommendedQuestions, setRecommendedQuestions] = useState<InterviewQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    "All Categories",
    "Product Design",
    "Behavioral",
    "Metrics & Goals",
    "Root Cause Analysis",
  ]

  const difficulties = ["All Levels", "Intern", "Associate", "Mid", "Senior", "Any"]

  // Fetch questions when component mounts or user data changes
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!userData.role) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        console.log('Fetching question recommendations...')
        const recommendations = await getQuestionRecommendations({
          resumeText: userData.resumeText,
          jobDescription: userData.jobDescription,
          roleTitle: userData.role,
          company: userData.company,
          maxQuestions: 20
        })
        
        setAllQuestions(recommendations.questions)
        // Set top 3 as recommended
        setRecommendedQuestions(recommendations.questions.slice(0, 3))
      } catch (err) {
        console.error('Error fetching questions:', err)
        setError('Using mock data - database connection unavailable.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchQuestions()
  }, [userData.role, userData.company, userData.jobDescription, userData.resumeText])

  // Map question types to categories
  const mapQuestionTypeToCategory = (questionType: string): string => {
    // Direct mapping since categories now match database values
    return questionType
  }

  // Map difficulty levels
  const mapDifficulty = (difficulty: string): string => {
    // Direct mapping since difficulties now match database values
    return difficulty
  }
  const getFilteredRecommendedQuestions = () => {
    return recommendedQuestions.filter((question) => {
      const questionCategory = mapQuestionTypeToCategory(question.question_type)
      const questionDifficulty = mapDifficulty(question.difficulty)
      
      const categoryMatch = selectedCategory === "All Categories" || questionCategory === selectedCategory
      const difficultyMatch = selectedDifficulty === "All Levels" || questionDifficulty === selectedDifficulty
      const searchMatch =
        searchQuery === "" ||
        question.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
        questionCategory.toLowerCase().includes(searchQuery.toLowerCase())
      return categoryMatch && difficultyMatch && searchMatch
    })
  }

  const getFilteredQuestions = () => {
    return allQuestions
      .filter((q) => !recommendedQuestions.some((rq) => rq.id === q.id))
      .filter((question) => {
        const questionCategory = mapQuestionTypeToCategory(question.question_type)
        const questionDifficulty = mapDifficulty(question.difficulty)
        
        const categoryMatch = selectedCategory === "All Categories" || questionCategory === selectedCategory
        const difficultyMatch = selectedDifficulty === "All Levels" || questionDifficulty === selectedDifficulty
        const searchMatch =
          searchQuery === "" ||
          question.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          question.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
          questionCategory.toLowerCase().includes(searchQuery.toLowerCase())
        return categoryMatch && difficultyMatch && searchMatch
      })
  }

  const filteredRecommendedQuestions = getFilteredRecommendedQuestions()
  const showRecommendedSection = selectedCategory === "All Categories" || filteredRecommendedQuestions.length > 0
  const filteredQuestions = getFilteredQuestions()

  const handleStartSession = () => {
    const selectedQuestionObjects = allQuestions.filter(q => 
      selectedQuestions.includes(parseInt(q.id))
    )
    onStartSession?.(selectedQuestionObjects)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: "linear-gradient(180deg, #101010 0%, #0C0C0C 100%)",
      }}>
        <div className="text-white text-lg">Loading questions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: "linear-gradient(180deg, #101010 0%, #0C0C0C 100%)",
      }}>
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #101010 0%, #0C0C0C 100%)",
      }}
    >
      {/* Header */}
      <header className="border-b border-gray-700 sticky top-0 z-50" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack} // Added onClick handler for back navigation
                className="w-12 h-12 rounded-xl backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
              >
                <ArrowLeft className="w-5 h-5 text-white/90" strokeWidth={1.5} />
              </Button>

              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-white tracking-tight">Practice Questions</h1>
                <p className="text-sm text-white/60 font-medium">{userData.company} • {userData.role}</p>
              </div>
            </div>

            {/* Right side - Hide on desktop, show on mobile */}
            <Button
              variant="ghost"
              className="flex md:hidden items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <Filter className="w-4 h-4 text-white/70" strokeWidth={1.5} />
              <span className="text-sm font-medium text-white/90">Filter</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-12 gap-10">
          {/* Sidebar - 3 columns on desktop, hidden on mobile */}
          <div className="hidden md:block md:col-span-3">
            <div
              className="rounded-2xl p-6 backdrop-blur-3xl border border-white/15 shadow-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
              }}
            >
              {/* Clear All Button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white tracking-tight">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedCategory("All Categories")
                    setSelectedDifficulty("All Levels")
                    setSearchQuery("")
                  }}
                  className="text-xs text-white/60 hover:text-white/80 transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-3">Category</label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category} style={{ backgroundColor: "#2a2a2a", color: "white" }}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-3">Difficulty</label>
                  <div className="relative">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {difficulties.map((difficulty) => (
                        <option
                          key={difficulty}
                          value={difficulty}
                          style={{ backgroundColor: "#2a2a2a", color: "white" }}
                        >
                          {difficulty}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Start Practice Buttons */}
              <div className="mt-8 pt-6 border-t border-white/15 space-y-3">
                <Button
                  onClick={() => {
                    // Quick start with random selection
                    const randomQuestions = allQuestions
                      .sort(() => 0.5 - Math.random())
                      .slice(0, 3) // Changed from selectedCount to fixed value of 3
                      .map((q) => parseInt(q.id))
                    setSelectedQuestions(randomQuestions)
                    handleStartSession()
                  }}
                  className="w-full py-3 px-3 rounded-xl font-medium tracking-wide transition-all duration-300 text-xs leading-tight"
                  style={{
                    background: "linear-gradient(135deg, #007AFF 0%, #0056CC 100%)",
                    boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    color: "white",
                  }}
                >
                  Quick Start
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content - full width on mobile, 9 columns on desktop */}
          <div className="col-span-12 md:col-span-9">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-white mb-4 tracking-tight">
                Product Manager Interview Questions
              </h2>
              <p className="text-white/70 leading-relaxed">
                Practice with curated questions from top tech companies. Select your preferences and start your mock
                interview session.
              </p>
            </div>

            <div className="mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </div>
            </div>

            {/* Active Filter Chips */}
            {(selectedCategory !== "All Categories" || selectedDifficulty !== "All Levels" || searchQuery !== "") && (
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedCategory !== "All Categories" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-white/20 bg-white/5">
                    <span className="text-white/80">{selectedCategory}</span>
                    <button
                      onClick={() => setSelectedCategory("All Categories")}
                      className="text-white/60 hover:text-white/80"
                    >
                      ×
                    </button>
                  </div>
                )}
                {selectedDifficulty !== "All Levels" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-white/20 bg-white/5">
                    <span className="text-white/80">{selectedDifficulty}</span>
                    <button
                      onClick={() => setSelectedDifficulty("All Levels")}
                      className="text-white/60 hover:text-white/80"
                    >
                      ×
                    </button>
                  </div>
                )}
                {searchQuery !== "" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-white/20 bg-white/5">
                    <span className="text-white/80">"{searchQuery}"</span>
                    <button onClick={() => setSearchQuery("")} className="text-white/60 hover:text-white/80">
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Questions Section */}
            {showRecommendedSection && filteredRecommendedQuestions.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-lg font-semibold text-white tracking-tight">Recommended for You</h3>
                  <div className="group relative">
                    <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center cursor-help">
                      <span className="text-xs text-white/60">i</span>
                    </div>
                    <div className="absolute left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap border border-white/20 shadow-xl">
                        Questions selected based on your profile and experience
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredRecommendedQuestions.map((question, index) => {
                    const isSelected = selectedQuestions.includes(parseInt(question.id))
                    const questionCategory = mapQuestionTypeToCategory(question.question_type)
                    const questionDifficulty = mapDifficulty(question.difficulty)
                    return (
                      <div
                        key={`recommended-${index}`}
                        className={`rounded-2xl p-6 backdrop-blur-3xl border transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl relative ${
                          isSelected ? "border-blue-500/50" : "border-white/15 hover:border-white/25"
                        }`}
                        style={{
                          backgroundColor: isSelected ? "rgba(0, 122, 255, 0.12)" : "rgba(255, 255, 255, 0.06)",
                          boxShadow: isSelected
                            ? "0 8px 24px rgba(0, 122, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                            : "0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                          background: isSelected
                            ? "linear-gradient(135deg, rgba(0, 122, 255, 0.12) 0%, rgba(0, 122, 255, 0.06) 100%)"
                            : "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
                        }}
                        onClick={() => {
                          setSelectedQuestions((prev) =>
                            prev.includes(parseInt(question.id))
                              ? prev.filter((id) => id !== parseInt(question.id))
                              : [...prev, parseInt(question.id)],
                          )
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {/* Checkbox */}
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected ? "bg-blue-500 border-blue-500" : "border-white/30 hover:border-white/50"
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>

                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: "rgba(0, 122, 255, 0.2)",
                                color: "#007AFF",
                              }}
                            >
                              {questionCategory}
                            </span>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                color: "rgba(255, 255, 255, 0.8)",
                              }}
                            >
                              {questionDifficulty}
                            </span>
                          </div>
                          <span className="text-sm text-white/60 font-medium">3-5 min</span>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-3 leading-relaxed tracking-tight">
                          {question.question_text}
                        </h3>

                        <p className="text-white/70 leading-relaxed text-sm mb-2">
                          Skills: {question.skills}
                        </p>

                        <div className="flex items-center gap-2 text-sm" style={{ fontSize: "0.85rem" }}>
                          <div className="flex items-center gap-1.5 font-medium" style={{ color: "#4A6FA5" }}>
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                              />
                            </svg>
                            <span>Recommended</span>
                          </div>
                          <span className="text-white/40">|</span>
                          <span className="text-white/70 italic">
                            Relevance: {((question.relevance_score || 0) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Regular Question Preview Cards */}
            <div className="space-y-6">
              {filteredQuestions.map((question, index) => {
                const isSelected = selectedQuestions.includes(parseInt(question.id))
                const questionCategory = mapQuestionTypeToCategory(question.question_type)
                const questionDifficulty = mapDifficulty(question.difficulty)
                return (
                  <div
                    key={index}
                    className={`rounded-2xl p-6 backdrop-blur-3xl border transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl ${
                      isSelected ? "border-blue-500/50" : "border-white/15 hover:border-white/25"
                    }`}
                    style={{
                      backgroundColor: isSelected ? "rgba(0, 122, 255, 0.08)" : "rgba(255, 255, 255, 0.03)",
                      boxShadow: isSelected
                        ? "0 8px 24px rgba(0, 122, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                        : "0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                      background: isSelected
                        ? "linear-gradient(135deg, rgba(0, 122, 255, 0.08) 0%, rgba(0, 122, 255, 0.04) 100%)"
                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
                    }}
                    onClick={() => {
                      setSelectedQuestions((prev) =>
                        prev.includes(parseInt(question.id)) ? prev.filter((id) => id !== parseInt(question.id)) : [...prev, parseInt(question.id)],
                      )
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            isSelected ? "bg-blue-500 border-blue-500" : "border-white/30 hover:border-white/50"
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>

                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: "rgba(0, 122, 255, 0.2)",
                            color: "#007AFF",
                          }}
                        >
                          {questionCategory}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            color: "rgba(255, 255, 255, 0.8)",
                          }}
                        >
                          {questionDifficulty}
                        </span>
                      </div>
                      <span className="text-sm text-white/60 font-medium">3-5 min</span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-3 leading-relaxed tracking-tight">
                      {question.question_text}
                    </h3>

                    <p className="text-white/70 leading-relaxed text-sm">
                      Skills: {question.skills}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-12 mb-32 text-center">
              <Button
                variant="ghost"
                className="px-6 py-3 rounded-xl font-medium tracking-wide transition-all duration-300 text-sm border border-white/20 hover:border-white/30"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                Load More Questions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Summary Bar */}
      {selectedQuestions.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className="flex items-center gap-4 px-6 py-3 rounded-2xl backdrop-blur-3xl border border-white/15 shadow-xl"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              boxShadow:
                "0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
            }}
          >
            <div className="text-sm text-white/90">
              <span className="font-medium">{selectedQuestions.length} selected</span>
              <span className="text-white/60 ml-2">
                • Est. {selectedQuestions.length * 4}-{selectedQuestions.length * 6} min
              </span>
            </div>
            <Button
              onClick={handleStartSession}
              className="py-2 px-3 rounded-xl font-medium tracking-wide transition-all duration-300 text-xs leading-tight"
              style={{
                background: "linear-gradient(135deg, #007AFF 0%, #0056CC 100%)",
                boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                color: "white",
              }}
            >
              Start Session
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
