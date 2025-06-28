"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: "primary" | "success" | "warning" | "danger"
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  showLabel = false,
  color = "primary",
}) => {
  const percentage = Math.min((value / max) * 100, 100)

  const colors = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600",
    success: "bg-gradient-to-r from-green-500 to-green-600",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    danger: "bg-gradient-to-r from-red-500 to-red-600",
  }

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{percentage.toFixed(1)}%</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", colors[color])}
        />
      </div>
    </div>
  )
}
