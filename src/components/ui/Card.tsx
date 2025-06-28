"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  padding?: "none" | "sm" | "md" | "lg"
  onClick?: () => void
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  gradient = false,
  padding = "md",
  onClick,
}) => {
  const baseClasses = `
    bg-white dark:bg-gray-900 
    border border-gray-200 dark:border-gray-800 
    rounded-lg sm:rounded-xl lg:rounded-2xl
    shadow-sm
    transition-all duration-200
  `

  const hoverClasses = hover
    ? `
      hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-800/50
      hover:-translate-y-1 cursor-pointer
      active:translate-y-0 active:shadow-md
    `
    : ""

  const gradientClasses = gradient
    ? `
      bg-gradient-to-br from-white to-gray-50
      dark:from-gray-900 dark:to-gray-800
      border-gradient
    `
    : ""

  const paddingClasses = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  }

  const Component = onClick ? motion.div : "div"
  const motionProps = onClick
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick,
      }
    : {}

  return (
    <Component
      className={cn(baseClasses, hoverClasses, gradientClasses, paddingClasses[padding], className)}
      {...motionProps}
    >
      {children}
    </Component>
  )
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)}>{children}</div>
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return <div className={cn("p-4 sm:p-6 pt-0", className)}>{children}</div>
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3
      className={cn(
        "text-lg sm:text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100",
        className,
      )}
    >
      {children}
    </h3>
  )
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  return <p className={cn("text-sm text-gray-600 dark:text-gray-400", className)}>{children}</p>
}
