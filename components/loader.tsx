"use client"

import { useState, useEffect } from "react"

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 40)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay with blur effect */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

      <div className="relative text-center space-y-8">
        {/* Magical Loading Animation */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer circle */}
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>

            {/* Rotating conic gradient ring */}
            <div
              className="absolute inset-0 rounded-full border-4 border-white border-t-transparent spin"
              style={{
                background: `conic-gradient(from 0deg, transparent, white)`,
                borderRadius: "50%",
              }}
            ></div>

            {/* Inner glowing circles */}
            <div className="absolute inset-4 rounded-full bg-white/10 pulse"></div>
            <div className="absolute inset-8 rounded-full bg-white/20 ping"></div>
          </div>

          {/* Floating Sparkles */}
          <div className="absolute -top-4 -left-4 w-2 h-2 bg-white rounded-full sparkle"></div>
          <div className="absolute -top-2 -right-6 w-1 h-1 bg-white rounded-full sparkle" style={{ animationDelay: "0.5s" }}></div>
          <div className="absolute -bottom-4 -right-2 w-3 h-3 bg-white/60 rounded-full sparkle" style={{ animationDelay: "1s" }}></div>
          <div className="absolute -bottom-2 -left-6 w-1 h-1 bg-white rounded-full sparkle" style={{ animationDelay: "1.5s" }}></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Summoning the Blockchain Wizard</h2>
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-to-r from-white to-white/60 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/70 text-sm">{progress}% Complete</p>
        </div>
      </div>

      {/* Inline animations */}
      <style jsx>{`
        .spin {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        .ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .sparkle {
          animation: sparkle 1.5s infinite ease-in-out;
        }
        @keyframes sparkle {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
