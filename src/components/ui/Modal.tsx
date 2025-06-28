"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "./Button"
import { useEffect, useState } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
}) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const getSizeClasses = () => {
    if (isMobile) {
      return "w-full h-full max-w-none max-h-none m-0 rounded-none"
    }

    const sizes = {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md lg:max-w-lg",
      lg: "max-w-lg lg:max-w-2xl xl:max-w-4xl",
      xl: "max-w-xl lg:max-w-4xl xl:max-w-6xl",
      "2xl": "max-w-2xl lg:max-w-6xl xl:max-w-7xl",
      full: "max-w-[95vw] max-h-[95vh]",
    }

    return `${sizes[size]} w-full mx-4 sm:mx-6 lg:mx-8`
  }

  const getContentHeight = () => {
    if (isMobile) {
      return "h-full"
    }
    return "max-h-[90vh] sm:max-h-[85vh] lg:max-h-[80vh]"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 lg:p-6">
            <motion.div
              initial={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, scale: 0.95, y: 20 }}
              animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
              className={`
                ${getSizeClasses()} 
                ${getContentHeight()}
                bg-white dark:bg-gray-900 
                ${isMobile ? "" : "rounded-2xl shadow-2xl"}
                border border-gray-200 dark:border-gray-800 
                overflow-hidden flex flex-col
                ${className}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                  {title && (
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate pr-4">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="touch-target flex-shrink-0"
                      icon={<X className="w-4 h-4 sm:w-5 sm:h-5" />}
                    >
                      <span className="sr-only">Close</span>
                    </Button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
