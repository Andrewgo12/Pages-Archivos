"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Trash2, RotateCcw, X, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { FileGrid } from "@/components/files/FileGrid"
import { useToast } from "@/components/ui/Toast"
import { formatDate } from "@/lib/utils"
import type { FileItem } from "@/types"

// Mock deleted files
const mockDeletedFiles: (FileItem & { deletedAt: Date; deletedBy: string })[] = [
  {
    id: "deleted1",
    name: "Old Presentation.pptx",
    size: 15728640,
    type: "application/vnd.ms-powerpoint",
    lastModified: new Date("2024-01-10"),
    isFolder: false,
    tags: ["work", "old"],
    path: "/",
    deletedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    deletedBy: "John Doe",
  },
  {
    id: "deleted2",
    name: "Temp Files",
    size: 0,
    type: "folder",
    lastModified: new Date("2024-01-08"),
    isFolder: true,
    path: "/",
    deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    deletedBy: "John Doe",
  },
]

export const TrashPage: React.FC = () => {
  const [deletedFiles, setDeletedFiles] = useState(mockDeletedFiles)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const { addToast } = useToast()

  const handleRestore = async (fileIds: string[]) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDeletedFiles((prev) => prev.filter((file) => !fileIds.includes(file.id)))
      setSelectedFiles([])

      addToast({
        type: "success",
        title: "Files restored",
        description: `${fileIds.length} file(s) have been restored successfully.`,
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Restore failed",
        description: "Failed to restore files. Please try again.",
      })
    }
  }

  const handlePermanentDelete = async (fileIds: string[]) => {
    if (!confirm("Are you sure you want to permanently delete these files? This action cannot be undone.")) {
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDeletedFiles((prev) => prev.filter((file) => !fileIds.includes(file.id)))
      setSelectedFiles([])

      addToast({
        type: "success",
        title: "Files permanently deleted",
        description: `${fileIds.length} file(s) have been permanently deleted.`,
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Delete failed",
        description: "Failed to delete files permanently. Please try again.",
      })
    }
  }

  const handleEmptyTrash = async () => {
    if (
      !confirm(
        "Are you sure you want to empty the trash? All files will be permanently deleted and cannot be recovered.",
      )
    ) {
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setDeletedFiles([])
      setSelectedFiles([])

      addToast({
        type: "success",
        title: "Trash emptied",
        description: "All files have been permanently deleted.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Empty trash failed",
        description: "Failed to empty trash. Please try again.",
      })
    }
  }

  const handleFileClick = (file: FileItem) => {
    // Toggle selection for deleted files
    if (selectedFiles.includes(file.id)) {
      setSelectedFiles((prev) => prev.filter((id) => id !== file.id))
    } else {
      setSelectedFiles((prev) => [...prev, file.id])
    }
  }

  const handleFileAction = (action: string, file: FileItem) => {
    switch (action) {
      case "restore":
        handleRestore([file.id])
        break
      case "delete":
        handlePermanentDelete([file.id])
        break
      default:
        console.log("Unhandled trash action:", action, file)
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedFiles.length === 0) return

    switch (action) {
      case "restore":
        handleRestore(selectedFiles)
        break
      case "delete":
        handlePermanentDelete(selectedFiles)
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Trash</h1>
          <p className="text-gray-600 dark:text-gray-400">Files in trash are automatically deleted after 30 days</p>
        </div>

        {deletedFiles.length > 0 && (
          <Button variant="destructive" onClick={handleEmptyTrash} icon={<Trash2 className="w-4 h-4" />}>
            Empty Trash
          </Button>
        )}
      </div>

      {/* Auto-delete warning */}
      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Automatic Deletion Notice</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Files in trash are automatically deleted after 30 days. Restore important files before they're
                permanently removed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {deletedFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Trash is empty</h3>
            <p className="text-gray-600 dark:text-gray-400">Deleted files will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
                  {selectedFiles.length} file(s) selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("restore")}
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  Restore
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  icon={<X className="w-4 h-4" />}
                >
                  Delete Forever
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFiles([])}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Deleted Files</h2>
              <p className="text-gray-600 dark:text-gray-400">{deletedFiles.length} items in trash</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "primary" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>

          {/* Files Display */}
          {viewMode === "grid" ? (
            <FileGrid files={deletedFiles} onFileClick={handleFileClick} onFileAction={handleFileAction} />
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Custom header for trash */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === deletedFiles.length && deletedFiles.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(deletedFiles.map((f) => f.id))
                      } else {
                        setSelectedFiles([])
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="col-span-4 font-medium text-gray-700 dark:text-gray-300">Name</div>
                <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">Size</div>
                <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">Deleted</div>
                <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">Deleted By</div>
                <div className="col-span-1 font-medium text-gray-700 dark:text-gray-300">Actions</div>
              </div>

              {/* File rows */}
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {deletedFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedFiles.includes(file.id) ? "bg-primary-50 dark:bg-primary-950" : ""
                    }`}
                  >
                    <div className="col-span-1 flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles((prev) => [...prev, file.id])
                          } else {
                            setSelectedFiles((prev) => prev.filter((id) => id !== file.id))
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="col-span-4 flex items-center">
                      <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</span>
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                      {file.isFolder ? "—" : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(file.deletedAt)}
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                      {file.deletedBy}
                    </div>
                    <div className="col-span-1 flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore([file.id])}
                        icon={<RotateCcw className="w-3 h-3" />}
                        title="Restore"
                      >
                        <span className="sr-only">Restore</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePermanentDelete([file.id])}
                        icon={<X className="w-3 h-3" />}
                        title="Delete Forever"
                      >
                        <span className="sr-only">Delete Forever</span>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
