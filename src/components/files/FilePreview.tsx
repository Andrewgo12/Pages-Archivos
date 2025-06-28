"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Download, Share2, Star, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { formatFileSize, formatDate, getFileIcon } from "@/lib/utils"
import type { FileItem } from "@/types"

interface FilePreviewProps {
  file: FileItem | null
  isOpen: boolean
  onClose: () => void
  onAction: (action: string, file: FileItem) => void
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, isOpen, onClose, onAction }) => {
  if (!file) return null

  const isImage = file.type.startsWith("image/")
  const isVideo = file.type.startsWith("video/")
  const isAudio = file.type.startsWith("audio/")
  const isPDF = file.type === "application/pdf"
  const isText = file.type.startsWith("text/")

  const renderPreview = () => {
    if (isImage && file.url) {
      return (
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <img
            src={file.url || "/placeholder.svg"}
            alt={file.name}
            className="max-w-full max-h-96 object-contain rounded-lg"
          />
        </div>
      )
    }

    if (isVideo && file.url) {
      return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <video src={file.url} controls className="w-full max-h-96 rounded-lg">
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    if (isAudio && file.url) {
      return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🎵</div>
          <audio src={file.url} controls className="w-full">
            Your browser does not support the audio tag.
          </audio>
        </div>
      )
    }

    if (isPDF && file.url) {
      return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <iframe src={file.url} className="w-full h-96 rounded-lg" title={file.name} />
        </div>
      )
    }

    // Default preview for other file types
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-12 text-center">
        <div className="text-6xl mb-4">{getFileIcon(file.name)}</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{file.name}</h3>
        <p className="text-gray-600 dark:text-gray-400">Preview not available for this file type</p>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">{file.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{formatFileSize(file.size)}</span>
              <span>{file.type}</span>
              <span>{formatDate(file.lastModified)}</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {renderPreview()}
        </motion.div>

        {/* File Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">File Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Size:</span>
                <span className="text-gray-900 dark:text-gray-100">{formatFileSize(file.size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span className="text-gray-900 dark:text-gray-100">{file.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Modified:</span>
                <span className="text-gray-900 dark:text-gray-100">{formatDate(file.lastModified)}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {file.tags && file.tags.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {file.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="primary" onClick={() => onAction("download", file)} icon={<Download className="w-4 h-4" />}>
            Download
          </Button>
          <Button variant="outline" onClick={() => onAction("share", file)} icon={<Share2 className="w-4 h-4" />}>
            Share
          </Button>
          <Button
            variant="outline"
            onClick={() => onAction("star", file)}
            icon={<Star className={`w-4 h-4 ${file.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />}
          >
            {file.isStarred ? "Unstar" : "Star"}
          </Button>
          <Button variant="outline" onClick={() => onAction("rename", file)} icon={<Edit className="w-4 h-4" />}>
            Rename
          </Button>
          <Button variant="destructive" onClick={() => onAction("delete", file)} icon={<Trash2 className="w-4 h-4" />}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
