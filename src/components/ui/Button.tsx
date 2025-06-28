"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  fullWidth?: boolean
  children?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    touch-target relative overflow-hidden
  `

  const variants = {
    primary: `
      bg-primary-600 hover:bg-primary-700 active:bg-primary-800
      text-white shadow-sm hover:shadow-md
      focus:ring-primary-500 dark:focus:ring-primary-400
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 active:bg-gray-300
      dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600
      text-gray-900 dark:text-gray-100
      focus:ring-gray-500 dark:focus:ring-gray-400
    `,
    outline: `
      border border-gray-300 dark:border-gray-600
      bg-transparent hover:bg-gray-50 active:bg-gray-100
      dark:hover:bg-gray-800 dark:active:bg-gray-700
      text-gray-700 dark:text-gray-300
      focus:ring-gray-500 dark:focus:ring-gray-400
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 active:bg-gray-200
      dark:hover:bg-gray-800 dark:active:bg-gray-700
      text-gray-700 dark:text-gray-300
      focus:ring-gray-500 dark:focus:ring-gray-400
    `,
    destructive: `
      bg-red-600 hover:bg-red-700 active:bg-red-800
      text-white shadow-sm hover:shadow-md
      focus:ring-red-500 dark:focus:ring-red-400
    `,
  }

  const sizes = {
    xs: "px-2 py-1 text-xs gap-1 min-h-[32px]",
    sm: "px-3 py-1.5 text-sm gap-1.5 min-h-[36px]",
    md: "px-4 py-2 text-sm gap-2 min-h-[40px] sm:min-h-[44px]",
    lg: "px-6 py-2.5 text-base gap-2 min-h-[44px] sm:min-h-[48px]",
    xl: "px-8 py-3 text-lg gap-3 min-h-[48px] sm:min-h-[52px]",
  }

  const LoadingSpinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
    />
  )

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      className={cn(baseClasses, variants[variant], sizes[size], fullWidth && "w-full", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}

      {!loading && icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}

      {children && (
        <span className={cn("truncate", icon && !loading && (iconPosition === "left" ? "ml-1" : "mr-1"))}>
          {children}
        </span>
      )}

      {!loading && icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
    </motion.button>
  )
}
