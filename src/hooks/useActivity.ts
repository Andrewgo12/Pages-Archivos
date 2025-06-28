"use client"

import { useState, useEffect } from "react"
import type { Activity } from "@/types"

export const useActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockActivities: Activity[] = [
          {
            id: "1",
            type: "upload",
            fileId: "file1",
            fileName: "Project Presentation.pptx",
            userId: "user1",
            userName: "John Doe",
            userAvatar: "/placeholder.svg?height=32&width=32",
            description: "uploaded Project Presentation.pptx",
            createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          },
          {
            id: "2",
            type: "share",
            fileId: "file2",
            fileName: "Budget 2024.xlsx",
            userId: "user1",
            userName: "John Doe",
            userAvatar: "/placeholder.svg?height=32&width=32",
            description: "shared Budget 2024.xlsx with team",
            createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          },
          {
            id: "3",
            type: "comment",
            fileId: "file3",
            fileName: "Design Assets",
            userId: "user2",
            userName: "Jane Smith",
            userAvatar: "/placeholder.svg?height=32&width=32",
            description: "commented on Design Assets",
            createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          },
          {
            id: "4",
            type: "download",
            fileId: "file4",
            fileName: "vacation-photos.zip",
            userId: "user3",
            userName: "Mike Johnson",
            userAvatar: "/placeholder.svg?height=32&width=32",
            description: "downloaded vacation-photos.zip",
            createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          },
          {
            id: "5",
            type: "version",
            fileId: "file5",
            fileName: "Meeting Notes.docx",
            userId: "user1",
            userName: "John Doe",
            userAvatar: "/placeholder.svg?height=32&width=32",
            description: "created new version of Meeting Notes.docx",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          },
        ]

        setActivities(mockActivities)
      } catch (error) {
        console.error("Failed to fetch activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const addActivity = (activity: Omit<Activity, "id" | "createdAt">) => {
    const newActivity: Activity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    }
    setActivities((prev) => [newActivity, ...prev])
  }

  return {
    activities,
    loading,
    addActivity,
  }
}
