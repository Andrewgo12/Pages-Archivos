"use client"

import { useState, useCallback } from "react"
import type { FileItem, FileOperation } from "@/types"

export const useFileOperations = () => {
  const [operations, setOperations] = useState<FileOperation[]>([])
  const [loading, setLoading] = useState(false)

  const addOperation = useCallback((operation: FileOperation) => {
    setOperations((prev) => [...prev, { ...operation, id: Math.random().toString(36).substr(2, 9) }])
  }, [])

  const updateOperation = useCallback((id: string, updates: Partial<FileOperation>) => {
    setOperations((prev) => prev.map((op) => (op.id === id ? { ...op, ...updates } : op)))
  }, [])

  const removeOperation = useCallback((id: string) => {
    setOperations((prev) => prev.filter((op) => op.id !== id))
  }, [])

  const uploadFiles = useCallback(
    async (files: File[], parentId?: string) => {
      setLoading(true)
      const uploadPromises = files.map(async (file) => {
        const operationId = Math.random().toString(36).substr(2, 9)

        addOperation({
          type: "upload",
          status: "pending",
          progress: 0,
        })

        try {
          // Simulate upload with progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise((resolve) => setTimeout(resolve, 100))
            updateOperation(operationId, { progress, status: "in-progress" })
          }

          const newFile: FileItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(),
            isFolder: false,
            parentId,
            isStarred: false,
            isShared: false,
            tags: [],
            url: URL.createObjectURL(file),
          }

          updateOperation(operationId, { status: "completed" })
          setTimeout(() => removeOperation(operationId), 2000)

          return newFile
        } catch (error) {
          updateOperation(operationId, {
            status: "error",
            error: error instanceof Error ? error.message : "Upload failed",
          })
          throw error
        }
      })

      try {
        const results = await Promise.all(uploadPromises)
        setLoading(false)
        return results
      } catch (error) {
        setLoading(false)
        throw error
      }
    },
    [addOperation, updateOperation, removeOperation],
  )

  const deleteFile = useCallback(
    async (fileId: string) => {
      const operationId = Math.random().toString(36).substr(2, 9)

      addOperation({
        type: "delete",
        fileId,
        status: "in-progress",
      })

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        updateOperation(operationId, { status: "completed" })
        setTimeout(() => removeOperation(operationId), 1000)
        return true
      } catch (error) {
        updateOperation(operationId, {
          status: "error",
          error: error instanceof Error ? error.message : "Delete failed",
        })
        throw error
      }
    },
    [addOperation, updateOperation, removeOperation],
  )

  const renameFile = useCallback(
    async (fileId: string, newName: string) => {
      const operationId = Math.random().toString(36).substr(2, 9)

      addOperation({
        type: "rename",
        fileId,
        status: "in-progress",
      })

      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        updateOperation(operationId, { status: "completed" })
        setTimeout(() => removeOperation(operationId), 1000)
        return newName
      } catch (error) {
        updateOperation(operationId, {
          status: "error",
          error: error instanceof Error ? error.message : "Rename failed",
        })
        throw error
      }
    },
    [addOperation, updateOperation, removeOperation],
  )

  const toggleStar = useCallback(async (fileId: string, isStarred: boolean) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      return !isStarred
    } catch (error) {
      throw error
    }
  }, [])

  const shareFile = useCallback(async (fileId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const shareUrl = `${window.location.origin}/shared/${fileId}`
      return shareUrl
    } catch (error) {
      throw error
    }
  }, [])

  return {
    operations,
    loading,
    uploadFiles,
    deleteFile,
    renameFile,
    toggleStar,
    shareFile,
  }
}
