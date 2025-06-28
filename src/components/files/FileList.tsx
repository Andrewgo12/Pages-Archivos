"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { MoreVertical, Share2, Star, FolderOpen, ChevronDown, ChevronUp, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ContextMenu } from "@/components/ui/ContextMenu"
import { formatFileSize, formatDate, getFileIcon, getFileColor } from "@/lib/utils"
import type { FileItem } from "@/types"

interface FileListProps {
  files: FileItem[]
  onFileClick: (file: FileItem) => void
  onFileAction: (action: string, file: FileItem) => void
  sortField: string
  sortDirection: "asc" | "desc"
  onSort: (field: string) => void
  loading?: boolean
  selectable?: boolean
  selectedFiles?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onFileClick,
  onFileAction,
  sortField,
  sortDirection,
  onSort,
  loading = false,
  selectable = false,
  selectedFiles = [],
  onSelectionChange,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean
    position: { x: number; y: number }
    file: FileItem | null
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    file: null,
  })

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

  const handleSelectFile = (fileId: string, selected: boolean) => {
    if (!onSelectionChange) return

    if (selected) {
      onSelectionChange([...selectedFiles, fileId])
    } else {
      onSelectionChange(selectedFiles.filter((id) => id !== fileId))
    }
  }

  const handleSelectAll = (selected: boolean) => {
    if (!onSelectionChange) return

    if (selected) {
      onSelectionChange(files.map((f) => f.id))
    } else {
      onSelectionChange([])
    }
  }

  const SortButton: React.FC<{ field: string; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-left font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
    >
      {children}
      {sortField === field &&
        (sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
    </button>
  )

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="animate-pulse flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No files found</h3>
        <p className="text-gray-600 dark:text-gray-400">Upload some files to get started</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm">
          {selectable && (
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedFiles.length === files.length && files.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
          )}
          <div className={selectable ? "col-span-4" : "col-span-5"}>
            <SortButton field="name">Name</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="size">Size</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="type">Type</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="lastModified">Modified</SortButton>
          </div>
          <div className="col-span-1"></div>
        </div>

        {/* File Rows */}
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group ${
                selectedFiles.includes(file.id) ? "bg-primary-50 dark:bg-primary-950" : ""
              }`}
              onContextMenu={(e) => handleContextMenu(e, file)}
            >
              {selectable && (
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={(e) => handleSelectFile(file.id, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
              )}

              {/* Name */}
              <div className={`${selectable ? "col-span-4" : "col-span-5"} flex items-center gap-3`}>
                <div className="flex-shrink-0">
                  {file.isFolder ? (
                    <FolderOpen className="w-8 h-8 text-primary-500" />
                  ) : (
                    <div className={`text-2xl ${getFileColor(file.name)}`}>{getFileIcon(file.name)}</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => onFileClick(file)}
                    className="text-left font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate block w-full"
                  >
                    {file.name}
                  </button>
                  {file.tags && file.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {file.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {file.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                          +{file.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Size */}
              <div className="col-span-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                {file.isFolder ? "—" : formatFileSize(file.size)}
              </div>

              {/* Type */}
              <div className="col-span-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                {file.isFolder ? "Folder" : file.type.split("/")[1]?.toUpperCase() || "File"}
              </div>

              {/* Modified */}
              <div className="col-span-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                {formatDate(file.lastModified)}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {file.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  {file.isShared && <Share2 className="w-4 h-4 text-blue-500" />}

                  {/* Quick Actions */}
                  <div className="flex items-center gap-1">
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
                        handleContextMenu(e, file)
                      }}
                      icon={<MoreVertical className="w-4 h-4" />}
                    >
                      <span className="sr-only">More options</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
