"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ActivityPanelProps {
  title: string
  activities: string[]
  isOpen: boolean
  onClose: () => void
  onAddActivity: (activity: string) => void
  color: string
  position: { top: string; left: string }
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({
  title,
  activities,
  isOpen,
  onClose,
  onAddActivity,
  color,
  position,
}) => {
  const [newActivity, setNewActivity] = useState("")
  const panelRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newActivity.trim()) {
      onAddActivity(newActivity.trim())
      setNewActivity("")
    }
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed z-50 w-64 sm:w-72 md:w-80"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            <motion.div
              className={`bg-gray-900/95 border-2 rounded-lg p-3 sm:p-4 md:p-6 shadow-2xl backdrop-blur-sm relative`}
              style={{ borderColor: color, boxShadow: `0 0 20px ${color}40` }}
            >
              {/* Close X button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-800/50 transition-colors"
                style={{ color }}
              >
                <X size={14} className="sm:w-4 sm:h-4" />
              </button>

              <h3 className="text-sm sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 pr-6" style={{ color }}>
                {title}
              </h3>

              <form onSubmit={handleSubmit} className="mb-3 sm:mb-4">
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="Enter new activity..."
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-current text-xs sm:text-sm"
                  style={{ borderColor: `${color}60` }}
                />
                <button
                  type="submit"
                  className="mt-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded border transition-all duration-200 hover:shadow-lg text-xs sm:text-sm"
                  style={{
                    borderColor: color,
                    color: color,
                    boxShadow: `0 0 10px ${color}40`,
                  }}
                >
                  Add Activity
                </button>
              </form>

              <div className="max-h-24 sm:max-h-32 md:max-h-40 overflow-y-auto">
                <h4 className="text-xs font-semibold mb-2 text-gray-300">Activities:</h4>
                {activities.length === 0 ? (
                  <p className="text-gray-500 text-xs">No activities added yet.</p>
                ) : (
                  <div className="space-y-1">
                    {activities.map((activity, index) => (
                      <div key={index} className="text-gray-300 flex items-center text-xs">
                        <div
                          className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mr-2 flex-shrink-0"
                          style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
                        />
                        {activity}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const CyberCelticPattern: React.FC<{ color: string; id: string; innerRadius?: number }> = ({
  color,
  id,
  innerRadius = 260,
}) => (
  <svg viewBox="0 0 600 600" className="absolute inset-0 w-full h-full">
    <defs>
      <filter id={`glow-${id}`}>
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <pattern id={`pattern-${id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M10,2 L18,10 L10,18 L2,10 Z M5,5 L15,5 M5,15 L15,15 M5,5 L5,15 M15,5 L15,15"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <circle cx="10" cy="10" r="3" fill={color} opacity="0.3" />
      </pattern>
    </defs>

    {/* Main ring structure */}
    <circle
      cx="300"
      cy="300"
      r="280"
      fill="none"
      stroke={color}
      strokeWidth="2"
      filter={`url(#glow-${id})`}
      opacity="0.8"
    />

    {/* Inner pattern ring */}
    <circle cx="300" cy="300" r={innerRadius} fill="none" stroke={color} strokeWidth="1" opacity="0.6" />

    {/* Tech grid overlay - masked to ring area only */}
    <rect
      x="0"
      y="0"
      width="600"
      height="600"
      fill={`url(#pattern-${id})`}
      opacity="0.2"
      mask={`url(#ring-mask-${id})`}
    />

    <defs>
      <mask id={`ring-mask-${id}`}>
        <rect width="600" height="600" fill="black" />
        <circle cx="300" cy="300" r="280" fill="white" />
        <circle cx="300" cy="300" r="220" fill="black" />
      </mask>
    </defs>
  </svg>
)

export default function ThreeCircles() {
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [outerActivities, setOuterActivities] = useState<string[]>([])
  const [middleActivities, setMiddleActivities] = useState<string[]>([])
  const [innerActivities, setInnerActivities] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const addOuterActivity = (activity: string) => {
    setOuterActivities((prev) => [...prev, activity])
  }

  const addMiddleActivity = (activity: string) => {
    setMiddleActivities((prev) => [...prev, activity])
  }

  const addInnerActivity = (activity: string) => {
    setInnerActivities((prev) => [...prev, activity])
  }

  const handleCircleClick = (event: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const clickX = event.clientX
    const clickY = event.clientY

    // Calculate distance from center
    const distance = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2))

    // Use the exact boundaries provided by the user
    const INNER_MAX = 141.0
    const MIDDLE_MIN = 148.83
    const MIDDLE_MAX = 390.75
    const OUTER_MIN = 401.2
    const OUTER_MAX = 556.84

    console.log(`Click distance: ${distance.toFixed(2)}`)

    // Check which area was clicked using exact boundaries
    if (distance <= INNER_MAX) {
      console.log("INNER CIRCLE ACTIVATED")
      setActivePanel("inner")
    } else if (distance >= MIDDLE_MIN && distance <= MIDDLE_MAX) {
      console.log("MIDDLE CIRCLE ACTIVATED")
      setActivePanel("middle")
    } else if (distance >= OUTER_MIN && distance <= OUTER_MAX) {
      console.log("OUTER CIRCLE ACTIVATED")
      setActivePanel("outer")
    } else {
      console.log("NO CIRCLE ACTIVATED - outside clickable areas")
      // Don't change activePanel if clicking outside all areas
    }
  }

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-2 sm:p-4">
      {/* Background matrix effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-orange-900/20" />
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-green-400/40 to-transparent animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${20 + Math.random() * 60}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main circles container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[600px] sm:max-w-[750px] md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px] aspect-square cursor-pointer"
        onClick={handleCircleClick}
      >
        {/* Outer Circle */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <CyberCelticPattern color="#00ff88" id="outer" />
        </motion.div>

        {/* Middle Circle */}
        <motion.div
          className="absolute inset-[15%] pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <CyberCelticPattern color="#ffaa00" id="middle" innerRadius={240} />
        </motion.div>

        {/* Inner Circle */}
        <motion.div
          className="absolute inset-[37%] pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <CyberCelticPattern color="#ff4400" id="inner" />
        </motion.div>

        {/* Static Labels */}
        <div
          className="absolute top-[3%] sm:top-[4%] left-1/2 transform -translate-x-1/2 text-green-400 font-mono text-[10px] sm:text-xs md:text-sm tracking-wider text-center cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation()
            setActivePanel("outer")
          }}
        >
          OUTER CIRCLE
          <div className="w-px h-0.5 sm:h-1 bg-green-400/60 mx-auto mt-0.5 sm:mt-1" />
        </div>

        <div
          className="absolute top-[16%] sm:top-[18%] left-1/2 transform -translate-x-1/2 text-amber-400 font-mono text-[10px] sm:text-xs md:text-sm tracking-wider text-center cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation()
            setActivePanel("middle")
          }}
        >
          MIDDLE CIRCLE
          <div className="w-px h-0.5 sm:h-1 bg-amber-400/60 mx-auto mt-0.5 sm:mt-1" />
        </div>

        <div
          className="absolute top-[38%] sm:top-[40%] left-1/2 transform -translate-x-1/2 text-red-400 font-mono text-[10px] sm:text-xs md:text-sm tracking-wider text-center cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation()
            setActivePanel("inner")
          }}
        >
          INNER CIRCLE
          <div className="w-px h-0.5 sm:h-1 bg-red-400/60 mx-auto mt-0.5 sm:mt-1" />
        </div>
      </div>

      {/* Activity Panels */}
      <ActivityPanel
        title="Outer Circle Activities"
        activities={outerActivities}
        isOpen={activePanel === "outer"}
        onClose={() => setActivePanel(null)}
        onAddActivity={addOuterActivity}
        color="#00ff88"
        position={{
          top: "calc(5% + 20px)",
          left: "calc(50% + 80px)",
        }}
      />

      <ActivityPanel
        title="Middle Circle Activities"
        activities={middleActivities}
        isOpen={activePanel === "middle"}
        onClose={() => setActivePanel(null)}
        onAddActivity={addMiddleActivity}
        color="#ffaa00"
        position={{
          top: "calc(18% + 20px)",
          left: "calc(50% + 90px)",
        }}
      />

      <ActivityPanel
        title="Inner Circle Activities"
        activities={innerActivities}
        isOpen={activePanel === "inner"}
        onClose={() => setActivePanel(null)}
        onAddActivity={addInnerActivity}
        color="#ff4400"
        position={{
          top: "calc(40% + 20px)",
          left: "calc(50% + 80px)",
        }}
      />
    </div>
  )
}
