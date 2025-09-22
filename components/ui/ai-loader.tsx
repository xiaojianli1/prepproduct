"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface LoaderProps {
  size?: number
  text?: string
}

export const Component: React.FC<LoaderProps> = ({ size = 180, text = "Processing your responses..." }) => {
  const [currentText, setCurrentText] = useState(text)

  useEffect(() => {
    const textSequence = [text, "Analyzing your background...", "Crafting personalized questions..."]

    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % textSequence.length
      setCurrentText(textSequence[index])
    }, 3000)

    return () => clearInterval(interval)
  }, [text])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0B0B0F 0%, #0F0F14 25%, #12121A 50%, #0F0F14 75%, #0B0B0F 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.06) 0%, transparent 50%)",
        }}
      />

      <div className="relative flex items-center justify-center mb-8" style={{ width: 260, height: 260 }}>
        {/* Outer Ring */}
        <div className="absolute animate-outerRing">
          <div
            className="w-[260px] h-[260px] rounded-full border-2 opacity-20"
            style={{ borderColor: "#3B82F6", filter: "blur(0px) drop-shadow(0 0 8px #3B82F6)" }}
          />
        </div>

        {/* Middle Ring */}
        <div className="absolute animate-middleRing">
          <div
            className="w-[200px] h-[200px] rounded-full border-2 opacity-40"
            style={{ borderColor: "#3B82F6", filter: "blur(0px) drop-shadow(0 0 8px #3B82F6)" }}
          />
        </div>

        {/* Inner Ring */}
        <div className="absolute animate-innerRing">
          <div
            className="w-[160px] h-[160px] rounded-full border-2 opacity-60"
            style={{ borderColor: "#3B82F6", filter: "blur(0px) drop-shadow(0 0 8px #3B82F6)" }}
          />
        </div>

        {/* Central Orb */}
        <div className="relative animate-orbBreathing">
          <div
            className="w-[120px] h-[120px] rounded-full animate-orbGlow"
            style={{
              background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
              filter: "drop-shadow(0 0 4px #3B82F6)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full animate-orbRotate"
            style={{
              background: "linear-gradient(45deg, transparent 30%, rgba(96, 165, 250, 0.3) 50%, transparent 70%)",
            }}
          />
        </div>

        {/* Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-blue-400 animate-particle opacity-0"
            style={{
              animationDelay: `${i * 0.7}s`,
              left: "50%",
              top: "50%",
            }}
          />
        ))}
      </div>

      <div className="text-center">
        <p
          className="text-gray-400 text-base font-medium transition-all duration-300 ease-in-out"
          style={{ letterSpacing: "0.025em" }}
          key={currentText}
        >
          {currentText}
        </p>
      </div>

      <style jsx>{`
        @keyframes outerRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes middleRing {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes innerRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes orbBreathing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        
        @keyframes orbGlow {
          0%, 100% { filter: drop-shadow(0 0 4px #3B82F6); }
          50% { filter: drop-shadow(0 0 12px #3B82F6); }
        }
        
        @keyframes orbRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes particle {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) rotate(0deg) translateX(80px) rotate(0deg);
          }
          25% { 
            opacity: 0.8; 
          }
          75% { 
            opacity: 0.8; 
          }
          100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) rotate(360deg) translateX(130px) rotate(-360deg);
          }
        }

        .animate-outerRing {
          animation: outerRing 8s linear infinite;
        }
        
        .animate-middleRing {
          animation: middleRing 6s linear infinite;
        }
        
        .animate-innerRing {
          animation: innerRing 4s linear infinite;
        }
        
        .animate-orbBreathing {
          animation: orbBreathing 2s ease-in-out infinite;
        }
        
        .animate-orbGlow {
          animation: orbGlow 2s ease-in-out infinite;
        }
        
        .animate-orbRotate {
          animation: orbRotate 8s linear infinite;
        }
        
        .animate-particle {
          animation: particle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
