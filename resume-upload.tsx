"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Upload, Building2, Briefcase } from "lucide-react"
import type { UserData } from "./app"

interface ResumeUploadProps {
  onContinue: (data: UserData) => void
  onBack: () => void
  userData: UserData
}

export default function ResumeUpload({ onContinue, onBack, userData }: ResumeUploadProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(userData.resumeFile)
  const [company, setCompany] = useState(userData.company)
  const [role, setRole] = useState(userData.role)
  const [jobDescription, setJobDescription] = useState(userData.jobDescription)
  const [dragActive, setDragActive] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(!!userData.resumeFile)
  const [showInterviewDetails, setShowInterviewDetails] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [resumeText, setResumeText] = useState(userData.resumeText)
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
  const extractTextFromFile = async (file: File): Promise<string> => {
    // For now, return a placeholder. In a real implementation, you'd use a library
    // like pdf-parse for PDFs or mammoth for Word documents
    return `Extracted text from ${file.name} - placeholder for actual text extraction`
  }
      if (
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf") ||
        file.type === "application/msword" ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx")
      ) {
        setResumeFile(file)
        setUploadComplete(true)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const extractedText = await extractTextFromFile(file)
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
      setResumeText(extractedText)
      setUploadComplete(true)
    }
  }

  const handleContinue = () => {
    // In a real app, you'd save this data to context or send to backend
    onContinue()
  }

  const handleProceedToDetails = () => {
    setResumeText("")
    setUploadComplete(false)
    setShowInterviewDetails(true)
  }

  const isFormValid = resumeFile && company.trim() && role.trim()
    const data: UserData = {
      resumeFile,
      resumeText,
      company,
      role,
      jobDescription
    }
    onContinue(data)
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #101010 0%, #0C0C0C 100%)",
      }}
    >
      <header className="border-b border-gray-700 sticky top-0 z-50" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-xl backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <ArrowLeft className="w-5 h-5 text-white/90" strokeWidth={1.5} />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-white tracking-tight">Setup Your Session</h1>
              <p className="text-sm text-white/60 font-medium">Personalize your interview practice</p>
            </div>
            <div className="w-12" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid gap-10 grid-cols-1 max-w-2xl mx-auto">
          {/* Upload Resume Card */}
          {!uploadComplete && !showInterviewDetails && (
            <div
              className="rounded-2xl p-6 backdrop-blur-3xl border border-white/15 shadow-xl h-fit"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
              }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#4285f4" }}
                  >
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">Upload Your Resume</h2>
                </div>
                <p className="text-white/80 text-sm">Help us tailor questions to your background</p>
              </div>

              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 backdrop-blur-sm ${
                  dragActive
                    ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                    : resumeFile
                      ? "border-green-400 bg-green-500/10 shadow-lg shadow-green-500/20"
                      : "border-gray-500 bg-white/5 hover:border-blue-500/50 hover:bg-white/8 hover:shadow-lg hover:shadow-white/5"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Upload className="w-8 h-8 text-gray-300" />
                  </div>
                  <div>
                    <p className="font-medium text-lg text-white">You can drag and drop files to upload</p>
                    <p className="text-sm text-gray-300 mt-2">Supports PDF, DOC, DOCX (max 10MB)</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: "linear-gradient(135deg, #007AFF 0%, #0056CC 100%)",
                      boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      color: "white",
                    }}
                  >
                    Browse Computer
                  </button>
                </div>
              </div>
            </div>
          )}

          {uploadComplete && (
            <div
              className="rounded-2xl p-6 backdrop-blur-3xl border border-white/15 shadow-xl h-fit animate-in slide-in-from-bottom-5 fade-in duration-500"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
              }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#34d399" }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">Resume Uploaded Successfully</h2>
                </div>
                <p className="text-white/70 text-sm">Your resume has been processed and is ready for analysis</p>
              </div>

              <div className="border-2 border-dashed border-green-400 bg-green-500/10 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-lg text-green-400">{resumeFile?.name}</p>
                  <p className="text-sm text-white/60 mt-1">
                    {resumeFile &&
                      `${(resumeFile.size / (1024 * 1024)).toFixed(1)} MB • ${resumeFile.name.split(".").pop()?.toUpperCase()}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Interview Details Card */}
          {showInterviewDetails && (
            <div
              className="rounded-2xl p-6 backdrop-blur-3xl border border-white/15 shadow-xl h-fit animate-in slide-in-from-right-5 fade-in duration-500"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
              }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#4285f4" }}
                  >
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">Interview Details</h2>
                </div>
                <p className="text-white/70 text-sm">Tell us about the role you're preparing for</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g., Google, Meta, Apple"
                      className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm text-base"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g., Senior Product Manager"
                      className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm text-base"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Job Description</label>
                  <p className="text-xs text-white/60">
                    Paste the job posting to get more relevant questions (optional)
                  </p>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here to help us customize your practice session..."
                    rows={5}
                    className="w-full p-4 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none backdrop-blur-sm text-base"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {uploadComplete && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleProceedToDetails}
              className="px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #007AFF 0%, #0056CC 100%)",
                boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                color: "white",
              }}
            >
              Continue to Interview Details
            </button>
          </div>
        )}

        {showInterviewDetails && (
          <div className="mt-8 flex justify-center max-w-md mx-auto">
            <button
              onClick={handleContinue}
              disabled={!isFormValid}
              className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                isFormValid ? "hover:scale-[1.02]" : "cursor-not-allowed opacity-50"
              }`}
              style={
                isFormValid
                  ? {
                      background: "linear-gradient(135deg, #007AFF 0%, #0056CC 100%)",
                      boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      color: "white",
                    }
                  : {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      color: "rgba(255, 255, 255, 0.4)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }
              }
            >
              Continue to Questions
            </button>
          </div>
        )}

        {showInterviewDetails && !isFormValid && (
          <p className="text-center text-sm text-white/50 mt-4">
            Please upload your resume and fill in company & role details
          </p>
        )}
      </div>
    </div>
  )
}
