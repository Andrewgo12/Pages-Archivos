"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MoreVertical, Download, Share2, Star, Eye, FolderOpen } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ContextMenu } from "@/components/ui/ContextMenu"
import { formatFileSize, formatDate, getFileIcon } from "@/lib/utils"
import type { FileItem } from "@/types"

interface FileGridProps {
  files: FileItem[]
  onFileClick: (file: FileItem) => void
  onFileAction: (action: string, file: FileItem) => void
  loading?: boolean
}

export const FileGrid: React.FC<FileGridProps> = ({ files, onFileClick, onFileAction, loading = false }) => {
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean
    position: { x: number; y: number }
    file: FileItem | null
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    file: null,
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleContextMenu = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault()
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      file,
    })
  }

  const handleContextAction = (action: string) => {
    if (contextMenu.file) {
      onFileAction(action, contextMenu.file)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="responsive-grid">
        {Array.from({ length: isMobile ? 6 : 12 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-xl sm:rounded-2xl aspect-square mb-3 sm:mb-4" />
            <div className="space-y-2">
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <FolderOpen className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No files found</h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Upload some files to get started</p>
      </div>
    )
  }

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="responsive-grid">
        {files.map((file) => (
          <motion.div key={file.id} variants={item}>
            <Card hover className="group relative overflow-hidden">
              <div
                className="aspect-square p-3 sm:p-4 lg:p-6 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 cursor-pointer"
                onClick={() => onFileClick(file)}
                onContextMenu={(e) => handleContextMenu(e, file)}
              >
                {file.isFolder ? (
                  <FolderOpen className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-primary-500 mb-2 sm:mb-4" />
                ) : (
                  <div className="text-2xl sm:text-4xl lg:text-6xl mb-2 sm:mb-4">{getFileIcon(file.name)}</div>
                )}

                {/* File Preview Overlay */}
                {!file.isFolder && file.thumbnail && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                    style={{ backgroundImage: `url(${file.thumbnail})` }}
                  />
                )}
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className="font-medium text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-primary-600 transition-colors text-sm sm:text-base"
                    onClick={() => onFileClick(file)}
                  >
                    {file.name}
                  </h3>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleContextMenu(e, file)
                      }}
                      icon={<MoreVertical className="w-4 h-4" />}
                    >
                      <span className="sr-only">More options</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="hidden sm:inline">{formatDate(file.lastModified)}</span>
                  </div>

                  {/* File Tags */}
                  {file.tags && file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {file.tags.slice(0, isMobile ? 1 : 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-2xs sm:text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {file.tags.length > (isMobile ? 1 : 2) && (
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-2xs sm:text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                          +{file.tags.length - (isMobile ? 1 : 2)}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onFileAction("preview", file)
                    }}
                    icon={<Eye className="w-3 h-3" />}
                  >
                    <span className="sr-only">Preview</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onFileAction("download", file)
                    }}
                    icon={<Download className="w-3 h-3" />}
                  >
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onFileAction("share", file)
                    }}
                    icon={<Share2 className="w-3 h-3" />}
                  >
                    <span className="sr-only">Share</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onFileAction("star", file)
                    }}
                    icon={<Star className={`w-3 h-3 ${file.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />}
                  >
                    <span className="sr-only">Star</span>
                  </Button>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1">
                {file.isShared && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Share2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                {file.isStarred && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-600 dark:text-yellow-400 fill-current" />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={() => setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, file: null })}
        onAction={handleContextAction}
        isFolder={contextMenu.file?.isFolder}
        isStarred={contextMenu.file?.isStarred}
      />
    </>
  )
}
