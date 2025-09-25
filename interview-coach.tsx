"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Square, Play, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InterviewCoachProps {
  questions: any[]
  onBack?: () => void
  onEndSession?: () => void
}

export default function Component({ questions, onBack, onEndSession }: InterviewCoachProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [waveformData, setWaveformData] = useState(Array(20).fill(0))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionVisible, setQuestionVisible] = useState(true)
  const [liveTranscription, setLiveTranscription] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)

  // Use ref to store frozen waveform to avoid dependency issues
  const frozenWaveformRef = useRef(Array(20).fill(0))

  // Dynamic max time based on question type
  const getMaxTimeForQuestion = (question: any) => {
    if (question.question_type?.toLowerCase() === 'behavioral') {
      return 180 // 3 minutes for behavioral questions
    }
    return 600 // 10 minutes for technical questions (product design, metrics, etc.)
  }

  const totalQuestions = questions?.length || 0
  const currentQuestion = questions[currentQuestionIndex]
  const maxTime = currentQuestion ? getMaxTimeForQuestion(currentQuestion) : 180

  // Handle record button click - now toggles pause/resume when recording
  const handleRecord = () => {
    console.log("Record button clicked!", { isRecording, isPaused })
    if (!isRecording) {
      // Start recording
      console.log("Starting recording...")
      setIsRecording(true)
      setIsPaused(false)
      setTimeElapsed(0)
    } else {
      // Toggle pause/resume
      console.log(isPaused ? "Resuming recording..." : "Pausing recording...")
      setIsPaused(!isPaused)
    }
  }

  // Handle next question with smooth transition
  const handleNextQuestion = () => {
    if (currentQuestionIndex >= totalQuestions - 1) {
      // Last question - could show completion screen
      console.log("All questions completed!")
      onEndSession?.()
      return
    }

    console.log("Moving to next question...")

    // Start fade out animation
    setQuestionVisible(false)

    // Reset recording state immediately
    setIsRecording(false)
    setIsPaused(false)
    setTimeElapsed(0)
    setWaveformData(Array(20).fill(0))
    frozenWaveformRef.current = Array(20).fill(0)

    // Wait for fade out, then change question and fade in
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1)

      // Start fade in animation
      setTimeout(() => {
        setQuestionVisible(true)
      }, 50)
    }, 250)
  }

  // Handle end session
  const handleEndSession = () => {
    console.log("End session clicked")
    setIsRecording(false)
    setIsPaused(false)
    setTimeElapsed(0)
    setWaveformData(Array(20).fill(0))
    frozenWaveformRef.current = Array(20).fill(0)
    onEndSession?.()
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev >= maxTime) {
            setIsRecording(false)
            setIsPaused(false)
            return maxTime
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused, maxTime])

  // Waveform animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording && !isPaused) {
      // Active recording - animate waveform
      interval = setInterval(() => {
        const newWaveform = Array(20)
          .fill(0)
          .map(() => Math.random() * 100)
        setWaveformData(newWaveform)
        frozenWaveformRef.current = newWaveform // Store for when paused
      }, 150)
    } else if (isRecording && isPaused) {
      // Paused - use frozen waveform
      setWaveformData(frozenWaveformRef.current)
    } else {
      // Not recording - no waveform
      setWaveformData(Array(20).fill(0))
      frozenWaveformRef.current = Array(20).fill(0)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRecording, isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (timeElapsed / maxTime) * 100

  // Early return if no questions provided
  if (!questions || questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">No questions selected</h2>
          <Button onClick={onBack} className="px-6 py-3 rounded-xl">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-screen flex flex-col p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0B0B0F 0%, #0F0F14 25%, #12121A 50%, #0F0F14 75%, #0B0B0F 100%)",
      }}
    >
      {/* Subtle animated background overlay */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.06) 0%, transparent 50%)",
        }}
      />

      {/* Navigation Header */}
      <div className="absolute top-6 left-6 z-30">
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-12 h-12 rounded-xl backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <ArrowLeft className="w-5 h-5 text-white/90" strokeWidth={1.5} />
        </Button>
      </div>

      {/* Question Card with Transition Animation */}
      <div className="w-full max-w-4xl mx-auto mt-20 mb-8 relative z-10">
        <div
          className={`rounded-2xl p-6 backdrop-blur-3xl border border-white/15 shadow-xl relative overflow-hidden transition-all duration-300 ${
            questionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            boxShadow:
              "0 16px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Enhanced inner glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/8 via-transparent to-blue-500/5 pointer-events-none" />

          <div className="flex items-start gap-6 relative z-10">
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                }}
              >
                Q{currentQuestionIndex + 1}
              </div>
              <div className="text-xs text-white/60 font-medium tracking-wide">
                {currentQuestionIndex + 1} of {totalQuestions}
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {/* Question Type and Difficulty Tags */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "rgba(0, 122, 255, 0.2)",
                    color: "#007AFF",
                  }}
                >
                  {currentQuestion.question_type}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: currentQuestion.difficulty_level?.toLowerCase() === 'beginner' ? "rgba(34, 197, 94, 0.2)" : 
                                   currentQuestion.difficulty_level?.toLowerCase() === 'intermediate' ? "rgba(251, 191, 36, 0.2)" : 
                                   "rgba(239, 68, 68, 0.2)",
                    color: currentQuestion.difficulty_level?.toLowerCase() === 'beginner' ? "#22C55E" : 
                           currentQuestion.difficulty_level?.toLowerCase() === 'intermediate' ? "#FBBF24" : 
                           "#EF4444",
                  }}
                >
                  {currentQuestion.difficulty_level}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "rgba(156, 163, 175, 0.2)",
                    color: "#9CA3AF",
                  }}
                >
                  {currentQuestion.company}
                </span>
              </div>
              <h1 className="text-lg font-semibold text-white leading-relaxed tracking-tight">
                {currentQuestion.question_text}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Recording Interface */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 relative z-10 max-w-2xl mx-auto">
        {/* Timer Display */}
        <div className="text-center space-y-2">
          <div
            className="text-6xl font-light text-white tracking-wider transition-all duration-300"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            {formatTime(timeElapsed)}
          </div>
          <div className="text-lg text-white/60 tracking-wide font-medium">
            {formatTime(maxTime - timeElapsed)} remaining
          </div>
        </div>

        {/* Record Button with Dynamic States */}
        <div className="relative">
          {/* Outer glow - changes based on state */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 pointer-events-none ${
              !isRecording ? "animate-pulse" : ""
            }`}
            style={{
              background: isRecording
                ? "radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.08) 50%, transparent 70%)"
                : "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)",
              filter: "blur(16px)",
              transform: "scale(1.3)",
            }}
          />

          {/* Progress Ring */}
          <svg className="w-44 h-44 transform -rotate-90 relative z-10 pointer-events-none" viewBox="0 0 176 176">
            {/* Background circle */}
            <circle cx="88" cy="88" r="82" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="2" fill="none" />

            {/* Progress circle */}
            <circle
              cx="88"
              cy="88"
              r="82"
              stroke={isRecording ? "rgba(239, 68, 68, 0.4)" : "rgba(59, 130, 246, 0.4)"}
              strokeWidth="3"
              fill="none"
              strokeDasharray={2 * Math.PI * 82}
              strokeDashoffset={2 * Math.PI * 82 * (1 - progress / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: isRecording
                  ? "drop-shadow(0 0 6px rgba(239, 68, 68, 0.4))"
                  : "drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))",
              }}
            />
          </svg>

          {/* Main Record Button with State-Based Styling */}
          <button
            onClick={handleRecord}
            className={`absolute inset-8 rounded-full transition-all duration-300 cursor-pointer z-20 flex items-center justify-center group ${
              isRecording ? "active:scale-95" : "hover:scale-105 active:scale-95"
            }`}
            style={{
              background: isRecording
                ? "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.2) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
              backdropFilter: "blur(20px)",
              boxShadow: isRecording
                ? "0 16px 40px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(239, 68, 68, 0.2)"
                : "0 16px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Icon based on state */}
            {!isRecording ? (
              <Mic
                className="w-12 h-12 text-white/90 transition-all duration-300 group-hover:text-white"
                strokeWidth={1.5}
              />
            ) : isPaused ? (
              <Play
                className="w-12 h-12 text-red-300 transition-all duration-300 group-hover:text-red-200"
                fill="currentColor"
              />
            ) : (
              <Square
                className="w-12 h-12 text-red-300 transition-all duration-300 group-hover:text-red-200"
                fill="currentColor"
              />
            )}
          </button>
        </div>

        {/* Waveform Visualization with State-Based Animation */}
        <div className="flex items-center justify-center gap-1 h-16 px-16">
          {waveformData.map((height, index) => {
            const isCenter = Math.abs(index - 10) < 4
            const distance = Math.abs(index - 10)
            const opacity = Math.max(0.2, 1 - distance * 0.08)
            const isActive = isRecording && !isPaused

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-1.5 rounded-full transition-all duration-300 ease-out ${isActive ? "" : "opacity-50"}`}
                  style={{
                    height: `${Math.max(4, height * 0.4)}px`,
                    background: isRecording
                      ? `linear-gradient(to top, rgba(239, 68, 68, ${opacity}) 0%, rgba(248, 113, 113, ${opacity * 0.7}) 100%)`
                      : `linear-gradient(to top, rgba(59, 130, 246, ${opacity * 0.3}) 0%, rgba(147, 197, 253, ${opacity * 0.2}) 100%)`,
                    boxShadow: isActive && isCenter ? `0 0 6px rgba(239, 68, 68, ${opacity * 0.5})` : "none",
                    transform: isCenter ? "scaleX(1.3)" : "scaleX(1)",
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Status Text with State-Based Messages */}
        <div className="text-center">
          <p className="text-base text-white/80 tracking-wide font-medium">
            {!isRecording
              ? "Tap the microphone to start recording"
              : isPaused
                ? "Recording paused - Tap to resume"
                : "Recording in progress..."}
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-md mx-auto mb-6 z-20">
        <div
          className="flex items-center gap-6 px-6 py-4 rounded-2xl backdrop-blur-3xl border border-white/15 shadow-xl"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            boxShadow: "0 16px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Primary Next Question Button */}
          <Button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex >= totalQuestions - 1}
            className="flex-1 py-3 px-6 rounded-xl font-medium tracking-wide transition-all duration-300 text-sm"
            style={{
              background:
                currentQuestionIndex >= totalQuestions - 1
                  ? "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(29, 78, 216, 0.3) 100%)"
                  : "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              color: "white",
            }}
          >
            {currentQuestionIndex >= totalQuestions - 1 ? "Complete Session" : `Next Question (${currentQuestionIndex + 2}/${totalQuestions})`}
          </Button>

          <div className="w-px h-8 bg-white/15"></div>

          {/* Secondary End Session Button */}
          <Button
            onClick={handleEndSession}
            variant="ghost"
            className="text-white/70 hover:text-white font-medium tracking-wide transition-all duration-300 px-6 py-3 rounded-xl hover:bg-white/5 text-sm"
          >
            End Session
          </Button>
        </div>
      </div>
    </div>
  )
}
