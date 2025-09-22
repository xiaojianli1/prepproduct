"use client"

import { useState } from "react"
import ResumeUpload from "./resume-upload"
import QuestionSelection from "./question-selection"
import InterviewCoach from "./interview-coach"
import FeedbackPage from "./feedback-page"
import { Component as AILoader } from "./components/ui/ai-loader"
import type { InterviewQuestion } from "./lib/question-recommendations"

export interface UserData {
  resumeFile: File | null
  resumeText: string
  company: string
  role: string
  jobDescription: string
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"resume" | "selection" | "interview" | "feedback">("resume")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("")
  const [userData, setUserData] = useState<UserData>({
    resumeFile: null,
    resumeText: "",
    company: "",
    role: "",
    jobDescription: ""
  })
  const [selectedQuestions, setSelectedQuestions] = useState<InterviewQuestion[]>([])

  const handleTransition = (targetScreen: "resume" | "selection" | "interview" | "feedback", text: string) => {
    setIsLoading(true)
    setLoadingText(text)

    setTimeout(() => {
      setCurrentScreen(targetScreen)
      setIsLoading(false)
    }, 2500)
  }

  const handleResumeComplete = (data: UserData) => {
    setUserData(data)
    handleTransition("selection", "Analyzing your profile...")
  }

  const handleBackToResume = () => {
    setCurrentScreen("resume")
  }

  const handleStartSession = (questions: InterviewQuestion[]) => {
    setSelectedQuestions(questions)
    handleTransition("interview", "Preparing your session...")
  }

  const handleBackToSelection = () => {
    setCurrentScreen("selection")
  }

  const handleEndSession = () => {
    handleTransition("feedback", "Processing your responses...")
  }

  const handlePracticeAgain = () => {
    setCurrentScreen("selection")
  }

  if (isLoading) {
    return <AILoader text={loadingText} />
  }

  if (currentScreen === "resume") {
    return <ResumeUpload onContinue={handleResumeComplete} onBack={() => {}} userData={userData} />
  }

  if (currentScreen === "selection") {
    return <QuestionSelection 
      onStartSession={handleStartSession} 
      onBack={handleBackToResume} 
      userData={userData}
    />
  }

  if (currentScreen === "interview") {
    return <InterviewCoach 
      onBack={handleBackToSelection} 
      onEndSession={handleEndSession} 
      questions={selectedQuestions}
    />
  }

  return <FeedbackPage onBack={handleBackToSelection} onPracticeAgain={handlePracticeAgain} />
}
