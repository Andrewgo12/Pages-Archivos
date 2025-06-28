"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  Plus,
  Grid3X3,
  List,
  Filter,
  MoreHorizontal,
  User,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface HeaderProps {
  onToggleSidebar: () => void
  onToggleTheme: () => void
  onUploadClick: () => void
  isDark: boolean
  viewMode: "grid" | "list" | "gallery"
  onViewModeChange: (mode: "grid" | "list" | "gallery") => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onToggleTheme,
  onUploadClick,
  isDark,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 relative z-40"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Menu Button */}
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "md"}
            onClick={onToggleSidebar}
            icon={<Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="flex-shrink-0"
          >
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          {/* Search - Desktop */}
          {!isMobile && (
            <div className="relative flex-1 max-w-md lg:max-w-lg xl:max-w-2xl">
              <Input
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="w-full"
              />
            </div>
          )}

          {/* Search Button - Mobile */}
          {isMobile && !showMobileSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileSearch(true)}
              icon={<Search className="w-4 h-4" />}
            >
              <span className="sr-only">Search</span>
            </Button>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
          {/* View Mode Toggle - Hidden on mobile */}
          {!isMobile && (
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                icon={<Grid3X3 className="w-4 h-4" />}
              >
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                icon={<List className="w-4 h-4" />}
              >
                <span className="sr-only">List view</span>
              </Button>
            </div>
          )}

          {/* Filter Button - Hidden on small screens */}
          {!isMobile && (
            <Button variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />} className="hidden lg:flex">
              <span className="hidden xl:inline">Filter</span>
            </Button>
          )}

          {/* Upload Button */}
          <Button
            variant="primary"
            size={isMobile ? "sm" : "md"}
            onClick={onUploadClick}
            icon={<Plus className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">Upload</span>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "md"}
            icon={<Bell className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="relative"
          >
            <span className="sr-only">Notifications</span>
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "md"}
            onClick={onToggleTheme}
            icon={isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          >
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "md"}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center"
              >
                <span className="text-white font-medium text-sm sm:text-base">JD</span>
              </motion.div>
            </Button>

            {/* User Dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-gray-100">John Doe</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">john@example.com</p>
                </div>

                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </button>

                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>

                <hr className="my-2 border-gray-200 dark:border-gray-700" />

                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign out</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* More Options - Mobile */}
          {isMobile && (
            <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
              <span className="sr-only">More options</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobile && showMobileSearch && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 z-30"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                autoFocus
              />
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowMobileSearch(false)}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Click outside to close menus */}
      {(showUserMenu || showMobileSearch) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowUserMenu(false)
            setShowMobileSearch(false)
          }}
        />
      )}
    </motion.header>
  )
}
