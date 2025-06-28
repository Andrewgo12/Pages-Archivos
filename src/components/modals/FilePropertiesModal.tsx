"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Info, Calendar, HardDrive, User, Tag, MapPin, Camera, FileText, Edit, Save, X } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useToast } from "@/components/ui/Toast"
import { formatFileSize, formatDate, getFileIcon } from "@/lib/utils"
import type { FileItem } from "@/types"

interface FilePropertiesModalProps {
  isOpen: boolean
  onClose: () => void
  file: FileItem | null
  onUpdate?: (updates: Partial<FileItem>) => void
}

interface FileMetadata {
  dimensions?: { width: number; height: number }
  duration?: number
  bitrate?: number
  codec?: string
  location?: { lat: number; lng: number; address: string }
  camera?: {
    make: string
    model: string
    iso: number
    aperture: string
    shutterSpeed: string
    focalLength: string
  }
  author?: string
  title?: string
  subject?: string
  keywords?: string[]
  createdWith?: string
  lastModifiedBy?: string
}

export const FilePropertiesModal: React.FC<FilePropertiesModalProps> = ({ isOpen, onClose, file, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedFile, setEditedFile] = useState<Partial<FileItem>>({})
  const [newTag, setNewTag] = useState("")
  const { addToast } = useToast()

  // Mock metadata based on file type
  const getFileMetadata = (file: FileItem): FileMetadata => {
    const metadata: FileMetadata = {}

    if (file.type.startsWith("image/")) {
      metadata.dimensions = { width: 1920, height: 1080 }
      metadata.camera = {
        make: "Canon",
        model: "EOS R5",
        iso: 400,
        aperture: "f/2.8",
        shutterSpeed: "1/125",
        focalLength: "85mm",
      }
      metadata.location = {
        lat: 40.7128,
        lng: -74.006,
        address: "New York, NY, USA",
      }
    } else if (file.type.startsWith("video/")) {
      metadata.dimensions = { width: 1920, height: 1080 }
      metadata.duration = 180 // 3 minutes
      metadata.bitrate = 5000
      metadata.codec = "H.264"
    } else if (file.type.startsWith("audio/")) {
      metadata.duration = 240 // 4 minutes
      metadata.bitrate = 320
      metadata.codec = "MP3"
    } else if (file.type.includes("document") || file.type.includes("pdf")) {
      metadata.author = "John Doe"
      metadata.title = file.name
      metadata.subject = "Document subject"
      metadata.keywords = ["document", "work", "important"]
      metadata.createdWith = "Microsoft Word"
    }

    return metadata
  }

  const handleSave = async () => {
    if (!file || !onUpdate) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onUpdate(editedFile)
      setIsEditing(false)
      setEditedFile({})

      addToast({
        type: "success",
        title: "Properties updated",
        description: "File properties have been saved successfully.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Update failed",
        description: "Could not update file properties. Please try again.",
      })
    }
  }

  const handleAddTag = () => {
    if (!newTag.trim() || !file) return

    const currentTags = editedFile.tags || file.tags || []
    const updatedTags = [...currentTags, newTag.trim()]

    setEditedFile((prev) => ({ ...prev, tags: updatedTags }))
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (!file) return

    const currentTags = editedFile.tags || file.tags || []
    const updatedTags = currentTags.filter((tag) => tag !== tagToRemove)

    setEditedFile((prev) => ({ ...prev, tags: updatedTags }))
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (!file) return null

  const metadata = getFileMetadata(file)
  const currentTags = editedFile.tags || file.tags || []
  const currentDescription = editedFile.description || file.description || ""

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="File Properties" size="lg">
      <div className="space-y-6">
        {/* File Header */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-3xl">
            {getFileIcon(file.name)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{file.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{file.type}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{formatFileSize(file.size)}</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} icon={<Save className="w-4 h-4" />}>
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedFile({})
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} icon={<Edit className="w-4 h-4" />}>
                Edit
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">File Name</label>
                  {isEditing ? (
                    <Input
                      value={editedFile.name || file.name}
                      onChange={(e) => setEditedFile((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100">{file.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  {isEditing ? (
                    <textarea
                      value={currentDescription}
                      onChange={(e) => setEditedFile((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 resize-none"
                      rows={3}
                      placeholder="Add a description..."
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100">{currentDescription || "No description"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {currentTags.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-primary-600 hover:text-primary-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </motion.span>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddTag()
                            }
                          }}
                        />
                        <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <HardDrive className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Size:</span>
                  <span className="font-medium">{formatFileSize(file.size)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <span className="font-medium">{formatDate(file.lastModified)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Modified:</span>
                  <span className="font-medium">{formatDate(file.lastModified)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Owner:</span>
                  <span className="font-medium">John Doe</span>
                </div>

                {file.downloadCount !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Downloads:</span>
                    <span className="font-medium">{file.downloadCount}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">File Information</h4>

                {metadata.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
                    <span className="font-medium">
                      {metadata.dimensions.width} × {metadata.dimensions.height}
                    </span>
                  </div>
                )}

                {metadata.duration && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-medium">{formatDuration(metadata.duration)}</span>
                  </div>
                )}

                {metadata.bitrate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bitrate:</span>
                    <span className="font-medium">{metadata.bitrate} kbps</span>
                  </div>
                )}

                {metadata.codec && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Codec:</span>
                    <span className="font-medium">{metadata.codec}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Document Properties</h4>

                {metadata.author && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Author:</span>
                    <span className="font-medium">{metadata.author}</span>
                  </div>
                )}

                {metadata.title && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Title:</span>
                    <span className="font-medium">{metadata.title}</span>
                  </div>
                )}

                {metadata.subject && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subject:</span>
                    <span className="font-medium">{metadata.subject}</span>
                  </div>
                )}

                {metadata.createdWith && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Created with:</span>
                    <span className="font-medium">{metadata.createdWith}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            {metadata.camera && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Camera Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Make:</span>
                    <span className="font-medium">{metadata.camera.make}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Model:</span>
                    <span className="font-medium">{metadata.camera.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">ISO:</span>
                    <span className="font-medium">{metadata.camera.iso}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Aperture:</span>
                    <span className="font-medium">{metadata.camera.aperture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shutter Speed:</span>
                    <span className="font-medium">{metadata.camera.shutterSpeed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Focal Length:</span>
                    <span className="font-medium">{metadata.camera.focalLength}</span>
                  </div>
                </div>
              </div>
            )}

            {metadata.location && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Address:</span>
                    <span className="font-medium">{metadata.location.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Coordinates:</span>
                    <span className="font-medium">
                      {metadata.location.lat}, {metadata.location.lng}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Recent Activity</h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">File modified</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">2 hours ago by John Doe</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Shared with team</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1 day ago by John Doe</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">File created</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">3 days ago by John Doe</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  )
}
