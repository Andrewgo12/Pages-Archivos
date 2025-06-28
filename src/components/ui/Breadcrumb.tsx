"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ChevronRight, Home } from "lucide-react"
import { Button } from "./Button"
import type { BreadcrumbItem } from "@/types"

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onNavigate: (id: string) => void
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center space-x-1 text-sm">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center"
        >
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item.id === "root" ? null : item.id)}
            className={`px-2 py-1 ${
              index === items.length - 1
                ? "text-gray-900 dark:text-gray-100 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
            icon={item.id === "root" ? <Home className="w-4 h-4" /> : undefined}
          >
            {item.name}
          </Button>
        </motion.div>
      ))}
    </nav>
  )
}
