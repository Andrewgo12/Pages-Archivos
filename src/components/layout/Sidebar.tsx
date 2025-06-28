"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import {
  Home,
  FolderOpen,
  Star,
  Share2,
  Trash2,
  Settings,
  Users,
  Shield,
  Archive,
  Activity,
  BarChart3,
  Zap,
  MessageCircle,
  GitBranch,
  Puzzle,
  X,
  ChevronDown,
  ChevronRight,
  Cloud,
  HardDrive,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

interface SidebarProps {
  isCollapsed: boolean
  currentPath: string
  onNavigate: (path: string) => void
  onClose: () => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  badge?: string | number
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: "/",
  },
  {
    id: "files",
    label: "My Files",
    icon: <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: "/files",
  },
  {
    id: "starred",
    label: "Starred",
    icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: "/starred",
  },
  {
    id: "shared",
    label: "Shared",
    icon: <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: "/shared",
  },
  {
    id: "collaboration",
    label: "Collaboration",
    icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: "/collaboration",
    children: [
      {
        id: "comments",
        label: "Comments",
        icon: <MessageCircle className="w-4 h-4" />,
        path: "/comments",
      },
      {
        id: "versions",
        label: "Versions",
        icon: <GitBranch className="w-4 h-4" />,
        path: "/versions",
      },
      {
        id: "team",
        label: "Team",
        icon: <Users className="w-4 h-4" />,
        path: "/team",
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: "/analytics",
  },
  {
    id: "automation",
    label: "Automation",
    icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: "/automation",
    badge: "New",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: <Puzzle className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: "/integrations",
  },
  {
    id: "activity",
    label: "Activity",
    icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: "/activity",
  },
  {
    id: "management",
    label: "Management",
    icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: "/management",
    children: [
      {
        id: "security",
        label: "Security",
        icon: <Shield className="w-4 h-4" />,
        path: "/security",
      },
      {
        id: "backup",
        label: "Backup",
        icon: <Archive className="w-4 h-4" />,
        path: "/backup",
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="w-4 h-4" />,
        path: "/settings",
      },
    ],
  },
  {
    id: "trash",
    label: "Trash",
    icon: <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: "/trash",
  },
]

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, currentPath, onNavigate, onClose }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["collaboration", "management"])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleExpanded = (itemId: string) => {
    if (!isCollapsed) {
      setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
    }
  }

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const active = isActive(item.path)

    return (
      <div key={item.id}>
        <motion.button
          whileHover={!isMobile ? { x: 2 } : {}}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (hasChildren && !isCollapsed) {
              toggleExpanded(item.id)
            } else if (!hasChildren) {
              onNavigate(item.path)
              if (isMobile) {
                onClose()
              }
            }
          }}
          className={cn(
            "w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-left transition-all duration-200 group touch-target",
            active
              ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
            level > 0 && !isCollapsed && "ml-4 sm:ml-6",
            isCollapsed && "justify-center",
          )}
        >
          <div className={cn("flex items-center gap-2 sm:gap-3 flex-1 min-w-0", isCollapsed && "justify-center")}>
            <div className={cn("flex-shrink-0", active ? "text-primary-600 dark:text-primary-400" : "")}>
              {item.icon}
            </div>

            {!isCollapsed && (
              <>
                <span className="font-medium truncate text-sm sm:text-base">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 sm:px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full flex-shrink-0">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </div>

          {!isCollapsed && hasChildren && (
            <div className="text-gray-400 flex-shrink-0">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          )}
        </motion.button>

        {/* Children */}
        <AnimatePresence>
          {!isCollapsed && hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">{item.children?.map((child) => renderNavItem(child, level + 1))}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const sidebarContent = (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? (isMobile ? 0 : 80) : isMobile ? 280 : 280,
        x: isMobile && isCollapsed ? -280 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full relative overflow-hidden",
        isMobile ? "fixed top-0 left-0 z-50 shadow-xl" : "relative",
        isCollapsed && isMobile && "w-0",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Cloud className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold gradient-text truncate">MegaVault</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cloud Storage</p>
            </div>
          </motion.div>
        )}

        {/* Mobile Close Button */}
        {isMobile && !isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon={<X className="w-4 h-4" />}
            className="flex-shrink-0"
          >
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
      </div>

      {/* Storage Info */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <HardDrive className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Storage Used</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-900 dark:text-gray-100">2.4 GB</span>
                <span className="text-gray-500">of 15 GB</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "16%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 sm:p-3 lg:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
        {navigationItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0"
        >
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>v2.1.0 • Updated</p>
            <p className="text-2xs">© 2024 MegaVault</p>
          </div>
        </motion.div>
      )}
    </motion.aside>
  )

  // Mobile overlay
  if (isMobile && !isCollapsed) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-80 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return sidebarContent
}
