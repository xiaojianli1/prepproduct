"use client"

import { useState } from "react"
import ResumeUpload from "./resume-upload"
import QuestionSelection from "./question-selection"
import InterviewCoach from "./interview-coach"
import FeedbackPage from "./feedback-page"
import { Component as AILoader } from "./components/ui/ai-loader"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"resume" | "selection" | "interview" | "feedback">("resume")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("")
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([])
  const [jobDescription, setJobDescription] = useState("")
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({})

  const handleTransition = (targetScreen: "resume" | "selection" | "interview" | "feedback", text: string) => {
    setIsLoading(true)
    setLoadingText(text)

    setTimeout(() => {
      setCurrentScreen(targetScreen)
      setIsLoading(false)
    }, 2500)
  }

  const handleResumeComplete = (jobDesc: string) => {
    setJobDescription(jobDesc)
    handleTransition("selection", "Analyzing your profile...")
  }

  const handleBackToResume = () => {
    setCurrentScreen("resume")
  }

  const handleStartSession = (questions: any[]) => {
    setSelectedQuestions(questions)
    handleTransition("interview", "Preparing your session...")
  }

  const handleBackToSelection = () => {
    setCurrentScreen("selection")
  }

  const handleEndSession = () => {
    handleTransition("feedback", "Processing your responses...")
  }

  const handleEndSessionWithAnswers = (userAnswers: {[key: number]: string}) => {
    console.log('=== App.tsx handleEndSessionWithAnswers CALLED ===')
    console.log('Received userAnswers from interview:', userAnswers)
    console.log('Number of answers received:', Object.keys(userAnswers).length)
    console.log('Keys in userAnswers:', Object.keys(userAnswers))
    setUserAnswers(userAnswers)
    handleTransition("feedback", "Processing your responses...")
  }

  const handlePracticeAgain = () => {
    setCurrentScreen("selection")
  }

  if (isLoading) {
    return <AILoader text={loadingText} />
  }

  if (currentScreen === "resume") {
    return <ResumeUpload onContinue={handleResumeComplete} onBack={() => {}} />
  }

  if (currentScreen === "selection") {
    return <QuestionSelection onStartSession={handleStartSession} onBack={handleBackToResume} jobDescription={jobDescription} />
  }

  if (currentScreen === "interview") {
    return <InterviewCoach questions={selectedQuestions} onBack={handleBackToSelection} onEndSession={handleEndSessionWithAnswers} />
  }

  return <FeedbackPage onBack={handleBackToSelection} onPracticeAgain={handlePracticeAgain} userAnswers={userAnswers} questions={selectedQuestions} />
}
