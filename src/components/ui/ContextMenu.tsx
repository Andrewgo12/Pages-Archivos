"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Share2, Star, Edit, Trash2, Copy, Move, Eye } from "lucide-react"

interface ContextMenuProps {
  isOpen: boolean
  position: { x: number; y: number }
  onClose: () => void
  onAction: (action: string) => void
  isFolder?: boolean
  isStarred?: boolean
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  onClose,
  onAction,
  isFolder = false,
  isStarred = false,
}) => {
  const menuItems = [
    { icon: Eye, label: "Preview", action: "preview", disabled: isFolder },
    { icon: Download, label: "Download", action: "download" },
    { icon: Share2, label: "Share", action: "share" },
    { icon: Star, label: isStarred ? "Unstar" : "Star", action: "star" },
    { type: "separator" },
    { icon: Edit, label: "Rename", action: "rename" },
    { icon: Copy, label: "Copy", action: "copy" },
    { icon: Move, label: "Move", action: "move" },
    { type: "separator" },
    { icon: Trash2, label: "Delete", action: "delete", destructive: true },
  ]

  const handleClickOutside = () => onClose()
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose()
  }

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            zIndex: 1000,
          }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-2 min-w-[180px]"
          onClick={(e) => e.stopPropagation()}
        >
          {menuItems.map((item, index) => {
            if (item.type === "separator") {
              return <div key={index} className="h-px bg-gray-200 dark:bg-gray-800 my-1" />
            }

            return (
              <button
                key={item.action}
                onClick={() => {
                  onAction(item.action)
                  onClose()
                }}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                  item.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : item.destructive
                      ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {React.createElement(item.icon, { className: "w-4 h-4" })}
                {item.label}
              </button>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
