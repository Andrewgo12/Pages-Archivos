"use client"

import type { React } from "react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Grid3X3, Calendar, MapPin, Camera, ChevronLeft, ChevronRight, Download, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { formatDate, formatFileSize } from "@/lib/utils"
import type { FileItem } from "@/types"

interface GalleryViewProps {
  files: FileItem[]
  onFileAction: (action: string, file: FileItem) => void
}

interface GroupedFiles {
  [key: string]: FileItem[]
}

export const GalleryView: React.FC<GalleryViewProps> = ({ files, onFileAction }) => {
  const [viewMode, setViewMode] = useState<"grid" | "timeline" | "map">("grid")
  const [selectedImage, setSelectedImage] = useState<FileItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [groupBy, setGroupBy] = useState<"date" | "location" | "none">("date")

  // Filter only image and video files
  const mediaFiles = useMemo(() => {
    return files.filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
  }, [files])

  // Group files based on selected criteria
  const groupedFiles = useMemo((): GroupedFiles => {
    if (groupBy === "none") {
      return { "All Media": mediaFiles }
    }

    const groups: GroupedFiles = {}

    mediaFiles.forEach((file) => {
      let groupKey: string

      if (groupBy === "date") {
        const date = new Date(file.lastModified)
        groupKey = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      } else if (groupBy === "location") {
        // Mock location grouping
        groupKey = Math.random() > 0.5 ? "New York, NY" : "San Francisco, CA"
      } else {
        groupKey = "All Media"
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(file)
    })

    return groups
  }, [mediaFiles, groupBy])

  const handleImageClick = (file: FileItem) => {
    setSelectedImage(file)
    setCurrentImageIndex(mediaFiles.findIndex((f) => f.id === file.id))
  }

  const handlePrevImage = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : mediaFiles.length - 1
    setCurrentImageIndex(newIndex)
    setSelectedImage(mediaFiles[newIndex])
  }

  const handleNextImage = () => {
    const newIndex = currentImageIndex < mediaFiles.length - 1 ? currentImageIndex + 1 : 0
    setCurrentImageIndex(newIndex)
    setSelectedImage(mediaFiles[newIndex])
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedImage) return

    switch (e.key) {
      case "ArrowLeft":
        handlePrevImage()
        break
      case "ArrowRight":
        handleNextImage()
        break
      case "Escape":
        setSelectedImage(null)
        break
    }
  }

  const { useEffect } = require("react")
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, currentImageIndex])

  if (mediaFiles.length === 0) {
    return (
      <div className="text-center py-16">
        <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No media files</h3>
        <p className="text-gray-600 dark:text-gray-400">Upload some images or videos to see them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gallery Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              icon={<Grid3X3 className="w-4 h-4" />}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "timeline" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("timeline")}
              icon={<Calendar className="w-4 h-4" />}
            >
              Timeline
            </Button>
            <Button
              variant={viewMode === "map" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
              icon={<MapPin className="w-4 h-4" />}
            >
              Map
            </Button>
          </div>

          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="none">No grouping</option>
            <option value="date">Group by date</option>
            <option value="location">Group by location</option>
          </select>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">{mediaFiles.length} media files</div>
      </div>

      {/* Gallery Content */}
      <div className="space-y-8">
        {Object.entries(groupedFiles).map(([groupName, groupFiles]) => (
          <div key={groupName} className="space-y-4">
            {groupBy !== "none" && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {groupBy === "date" && <Calendar className="w-5 h-5" />}
                {groupBy === "location" && <MapPin className="w-5 h-5" />}
                {groupName}
                <span className="text-sm font-normal text-gray-500">({groupFiles.length})</span>
              </h3>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {groupFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={() => handleImageClick(file)}
                >
                  {/* Thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-white text-2xl">🎥</div>
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

                  {/* File info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-white text-xs font-medium truncate">{file.name}</p>
                    <p className="text-white/80 text-xs">{formatFileSize(file.size)}</p>
                  </div>

                  {/* Quick actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onFileAction("star", file)
                        }}
                        className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                      >
                        <Heart className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Video indicator */}
                  {file.type.startsWith("video/") && (
                    <div className="absolute top-2 left-2">
                      <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} size="xl">
            <div className="relative">
              {/* Image */}
              <div className="flex items-center justify-center bg-black rounded-lg overflow-hidden">
                {selectedImage.type.startsWith("image/") ? (
                  <img
                    src={selectedImage.url || "/placeholder.svg"}
                    alt={selectedImage.name}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <video src={selectedImage.url} controls className="max-w-full max-h-[70vh]">
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Navigation */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Info */}
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedImage.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatFileSize(selectedImage.size)} • {formatDate(selectedImage.lastModified)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onFileAction("download", selectedImage)}
                      icon={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onFileAction("share", selectedImage)}
                      icon={<Share2 className="w-4 h-4" />}
                    >
                      Share
                    </Button>
                  </div>
                </div>

                {/* Image counter */}
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {currentImageIndex + 1} of {mediaFiles.length}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
