"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  fullWidth?: boolean
  variant?: "default" | "filled" | "outlined"
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconPosition = "left", fullWidth = true, variant = "default", className, ...props }, ref) => {
    const baseClasses = `
      flex h-10 sm:h-12 rounded-lg border transition-colors
      file:border-0 file:bg-transparent file:text-sm file:font-medium
      placeholder:text-gray-500 dark:placeholder:text-gray-400
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-50
      text-sm sm:text-base
    `

    const variants = {
      default: `
        border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        focus:border-primary-500 focus:ring-primary-500
        dark:focus:ring-primary-400
      `,
      filled: `
        border-transparent
        bg-gray-100 dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        focus:bg-white dark:focus:bg-gray-700
        focus:border-primary-500 focus:ring-primary-500
        dark:focus:ring-primary-400
      `,
      outlined: `
        border-2 border-gray-300 dark:border-gray-600
        bg-transparent
        text-gray-900 dark:text-gray-100
        focus:border-primary-500 focus:ring-primary-500
        dark:focus:ring-primary-400
      `,
    }

    const paddingClasses = icon
      ? iconPosition === "left"
        ? "pl-10 sm:pl-12 pr-3 sm:pr-4"
        : "pl-3 sm:pl-4 pr-10 sm:pr-12"
      : "px-3 sm:px-4"

    return (
      <div className={cn("space-y-2", fullWidth && "w-full")}>
        {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}

        <div className="relative">
          {icon && (
            <div
              className={cn(
                "absolute inset-y-0 flex items-center pointer-events-none text-gray-400",
                iconPosition === "left" ? "left-3 sm:left-4" : "right-3 sm:right-4",
              )}
            >
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              baseClasses,
              variants[variant],
              paddingClasses,
              fullWidth && "w-full",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className,
            )}
            {...props}
          />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"
