"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, File, ImageIcon, Video, Music, Archive, FileText, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/Progress"
import { formatFileSize } from "@/lib/utils"

interface UploadFile {
  file: File
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  id: string
}

interface FileUploadProps {
  onUploadComplete?: (files: File[]) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
      id: Math.random().toString(36).substr(2, 9),
    }))
    setUploadFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
  })

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const startUpload = async () => {
    setIsUploading(true)

    // Simulate upload progress
    for (const uploadFile of uploadFiles) {
      if (uploadFile.status !== "pending") continue

      setUploadFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading" } : f)))

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setUploadFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f)))
      }

      setUploadFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed" } : f)))
    }

    setIsUploading(false)
    onUploadComplete?.(uploadFiles.map((f) => f.file))
  }

  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-5 h-5 text-green-500" />
    if (file.type.startsWith("video/")) return <Video className="w-5 h-5 text-blue-500" />
    if (file.type.startsWith("audio/")) return <Music className="w-5 h-5 text-purple-500" />
    if (file.type.includes("zip") || file.type.includes("rar")) return <Archive className="w-5 h-5 text-orange-500" />
    if (file.type.includes("text") || file.type.includes("document"))
      return <FileText className="w-5 h-5 text-blue-600" />
    return <File className="w-5 h-5 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          ${
            isDragActive
              ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
              : "border-gray-300 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }
        `}
      >
        <input {...getInputProps()} />

        <motion.div animate={isDragActive ? { scale: 1.1 } : { scale: 1 }} className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {isDragActive ? "Drop files here" : "Upload your files"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Drag and drop files here, or click to browse</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Maximum file size: 2GB</p>
          </div>
        </motion.div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl" />
        </div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {uploadFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Files to Upload ({uploadFiles.length})
              </h4>
              {uploadFiles.some((f) => f.status === "pending") && (
                <Button onClick={startUpload} loading={isUploading} icon={<Upload className="w-4 h-4" />}>
                  Upload All
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {uploadFiles.map((uploadFile) => (
                <motion.div
                  key={uploadFile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="flex-shrink-0">{getFileTypeIcon(uploadFile.file)}</div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{uploadFile.file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(uploadFile.file.size)}</p>

                    {uploadFile.status === "uploading" && (
                      <div className="mt-2">
                        <Progress value={uploadFile.progress} showLabel />
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {uploadFile.status === "completed" && (
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                    )}

                    {uploadFile.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        icon={<X className="w-4 h-4" />}
                      >
                        <span className="sr-only">Remove file</span>
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
