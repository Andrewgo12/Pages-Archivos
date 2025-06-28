"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { createClient } from "@/lib/supabase/client"
import { put } from "@vercel/blob"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, File } from "lucide-react"
import { formatFileSize } from "@/lib/utils/file"

interface FileUploadProps {
  currentFolder: string | null
  onUploadComplete: () => void
}

interface UploadFile {
  file: File
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  error?: string
}

export default function FileUpload({ currentFolder, onUploadComplete }: FileUploadProps) {
  const [filesToUpload, setFilesToUpload] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
    }))
    setFilesToUpload((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
  })

  const removeFile = (index: number) => {
    setFilesToUpload((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadFiles = async () => {
    if (filesToUpload.length === 0) return

    setUploading(true)

    for (let i = 0; i < filesToUpload.length; i++) {
      const uploadFile = filesToUpload[i]
      if (uploadFile.status !== "pending") continue

      try {
        // Update status to uploading
        setFilesToUpload((prev) => prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f)))

        // Upload to Vercel Blob
        const blob = await put(uploadFile.file.name, uploadFile.file, {
          access: "public",
        })

        // Save file info to database
        const { error } = await supabase.from("files").insert({
          name: uploadFile.file.name,
          original_name: uploadFile.file.name,
          file_type: uploadFile.file.type,
          file_size: uploadFile.file.size,
          blob_url: blob.url,
          folder_id: currentFolder,
        })

        if (error) throw error

        // Update status to completed
        setFilesToUpload((prev) => prev.map((f, idx) => (idx === i ? { ...f, status: "completed", progress: 100 } : f)))
      } catch (error) {
        console.error("Upload error:", error)
        setFilesToUpload((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: "error",
                  error: error instanceof Error ? error.message : "Upload failed",
                }
              : f,
          ),
        )
      }
    }

    setUploading(false)
    onUploadComplete()

    toast({
      title: "Upload Complete",
      description: "Files have been uploaded successfully",
    })

    // Clear completed files after a delay
    setTimeout(() => {
      setFilesToUpload((prev) => prev.filter((f) => f.status !== "completed"))
    }, 2000)
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
            <p className="text-sm text-gray-500">Maximum file size: 2GB</p>
          </div>
        )}
      </div>

      {/* File List */}
      {filesToUpload.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Files to Upload</h3>
          {filesToUpload.map((uploadFile, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              <File className="h-5 w-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(uploadFile.file.size)}</p>
                {uploadFile.status === "uploading" && <Progress value={uploadFile.progress} className="mt-1" />}
                {uploadFile.status === "error" && <p className="text-xs text-red-500 mt-1">{uploadFile.error}</p>}
              </div>
              <div className="flex items-center space-x-2">
                {uploadFile.status === "completed" && <span className="text-green-500 text-sm">✓</span>}
                {uploadFile.status === "error" && <span className="text-red-500 text-sm">✗</span>}
                {uploadFile.status === "pending" && (
                  <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filesToUpload.some((f) => f.status === "pending") && (
            <Button onClick={handleUploadFiles} disabled={uploading} className="w-full">
              {uploading ? "Uploading..." : "Upload Files"}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
