"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  GitBranch,
  Download,
  Eye,
  RotateCcw,
  Clock,
  User,
  FileText,
  Plus,
  ContrastIcon as Compare,
  Archive,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { formatDate, formatFileSize } from "@/lib/utils"
import type { FileVersion, FileItem } from "@/types"

// Mock version data
const mockVersions: FileVersion[] = [
  {
    id: "v1",
    fileId: "file1",
    version: 3,
    size: 2048000,
    url: "/placeholder.svg",
    uploadedBy: "John Doe",
    uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    comment: "Updated design with new color scheme",
    checksum: "abc123def456",
  },
  {
    id: "v2",
    fileId: "file1",
    version: 2,
    size: 1950000,
    url: "/placeholder.svg",
    uploadedBy: "Jane Smith",
    uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    comment: "Fixed layout issues and improved typography",
    checksum: "def456ghi789",
  },
  {
    id: "v3",
    fileId: "file1",
    version: 1,
    size: 1800000,
    url: "/placeholder.svg",
    uploadedBy: "Mike Johnson",
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    comment: "Initial version",
    checksum: "ghi789jkl012",
  },
]

const mockFiles: FileItem[] = [
  {
    id: "file1",
    name: "Design_Mockup.psd",
    type: "image/psd",
    size: 2048000,
    lastModified: new Date(),
    ownerId: "user1",
    version: 3,
  },
  {
    id: "file2",
    name: "Project_Document.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1024000,
    lastModified: new Date(),
    ownerId: "user1",
    version: 2,
  },
]

export const VersionsPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [versions, setVersions] = useState<FileVersion[]>(mockVersions)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [newVersionComment, setNewVersionComment] = useState("")
  const { addToast } = useToast()

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file)
    // Filter versions for selected file
    const fileVersions = mockVersions.filter((v) => v.fileId === file.id)
    setVersions(fileVersions)
  }

  const handleVersionSelect = (versionId: string) => {
    if (compareMode) {
      setSelectedVersions((prev) => {
        if (prev.includes(versionId)) {
          return prev.filter((id) => id !== versionId)
        } else if (prev.length < 2) {
          return [...prev, versionId]
        }
        return prev
      })
    }
  }

  const handleRestore = async (version: FileVersion) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      addToast({
        type: "success",
        title: "Version restored",
        description: `File restored to version ${version.version}`,
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Restore failed",
        description: "Could not restore version. Please try again.",
      })
    }
  }

  const handleUploadNewVersion = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newVersion: FileVersion = {
        id: `v${Date.now()}`,
        fileId: selectedFile?.id || "",
        version: Math.max(...versions.map((v) => v.version)) + 1,
        size: 2200000,
        url: "/placeholder.svg",
        uploadedBy: "John Doe",
        uploadedAt: new Date(),
        comment: newVersionComment || "New version uploaded",
        checksum: `new${Date.now()}`,
      }

      setVersions((prev) => [newVersion, ...prev])
      setUploadModalOpen(false)
      setNewVersionComment("")

      addToast({
        type: "success",
        title: "New version uploaded",
        description: "Version has been successfully uploaded.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Upload failed",
        description: "Could not upload new version. Please try again.",
      })
    }
  }

  const handleCompareVersions = () => {
    if (selectedVersions.length === 2) {
      addToast({
        type: "info",
        title: "Compare versions",
        description: "Opening version comparison view...",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">File Versions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track file version history</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={compareMode ? "primary" : "outline"}
            onClick={() => {
              setCompareMode(!compareMode)
              setSelectedVersions([])
            }}
            icon={<Compare className="w-4 h-4" />}
          >
            Compare Mode
          </Button>
          {selectedFile && (
            <Button onClick={() => setUploadModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Upload New Version
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File List */}
        <Card>
          <CardHeader>
            <CardTitle>Files with Versions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockFiles.map((file) => (
                <motion.div
                  key={file.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedFile?.id === file.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                      : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleFileSelect(file)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        v{file.version} • {formatFileSize(file.size)}
                      </p>
                    </div>
                    <GitBranch className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Version History */}
        <div className="lg:col-span-2">
          {selectedFile ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    Version History - {selectedFile.name}
                  </CardTitle>
                  {compareMode && selectedVersions.length === 2 && (
                    <Button onClick={handleCompareVersions} icon={<Compare className="w-4 h-4" />}>
                      Compare Selected
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {versions.map((version, index) => (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 border rounded-lg ${
                        compareMode && selectedVersions.includes(version.id)
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                          : "border-gray-200 dark:border-gray-800"
                      } ${compareMode ? "cursor-pointer" : ""}`}
                      onClick={() => compareMode && handleVersionSelect(version.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {compareMode && (
                              <input
                                type="checkbox"
                                checked={selectedVersions.includes(version.id)}
                                onChange={() => handleVersionSelect(version.id)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            )}
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              v{version.version}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 dark:text-gray-100">Version {version.version}</p>
                              {index === 0 && (
                                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {version.uploadedBy}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(version.uploadedAt)}
                              </span>
                              <span>{formatFileSize(version.size)}</span>
                            </div>
                            {version.comment && (
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{version.comment}</p>
                            )}
                          </div>
                        </div>

                        {!compareMode && (
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                              Preview
                            </Button>
                            <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                              Download
                            </Button>
                            {index !== 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRestore(version)}
                                icon={<RotateCcw className="w-4 h-4" />}
                              >
                                Restore
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-16">
                <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Select a File</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a file from the list to view its version history
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Upload New Version Modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Upload New Version" size="md">
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">New Version Upload</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This will create version {Math.max(...versions.map((v) => v.version)) + 1} of {selectedFile?.name}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Version Comment</label>
            <textarea
              value={newVersionComment}
              onChange={(e) => setNewVersionComment(e.target.value)}
              placeholder="Describe what changed in this version..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 resize-none"
              rows={3}
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
            <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">Drop your file here or click to browse</p>
            <Button variant="outline">Choose File</Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadNewVersion}>Upload Version</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
