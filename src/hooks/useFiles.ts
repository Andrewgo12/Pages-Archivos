"use client"

import { useState, useCallback, useMemo } from "react"
import type { FileItem, SortOption, FilterOption, BreadcrumbItem } from "@/types"

const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Project Presentation.pptx",
    size: 15728640,
    type: "application/vnd.ms-powerpoint",
    lastModified: new Date("2024-01-15"),
    isFolder: false,
    isStarred: true,
    tags: ["work", "presentation"],
    path: "/",
  },
  {
    id: "2",
    name: "Design Assets",
    size: 0,
    type: "folder",
    lastModified: new Date("2024-01-14"),
    isFolder: true,
    isShared: true,
    path: "/",
  },
  {
    id: "3",
    name: "vacation-photos.zip",
    size: 524288000,
    type: "application/zip",
    lastModified: new Date("2024-01-13"),
    isFolder: false,
    tags: ["personal", "photos"],
    path: "/",
  },
  {
    id: "4",
    name: "Budget 2024.xlsx",
    size: 2097152,
    type: "application/vnd.ms-excel",
    lastModified: new Date("2024-01-12"),
    isFolder: false,
    isStarred: true,
    tags: ["finance"],
    path: "/",
  },
  {
    id: "5",
    name: "Meeting Notes.docx",
    size: 1048576,
    type: "application/msword",
    lastModified: new Date("2024-01-11"),
    isFolder: false,
    tags: ["work", "notes"],
    path: "/",
  },
  {
    id: "6",
    name: "Profile Picture.jpg",
    size: 3145728,
    type: "image/jpeg",
    lastModified: new Date("2024-01-10"),
    isFolder: false,
    isStarred: false,
    tags: ["personal"],
    path: "/",
  },
  // Nested files in Design Assets folder
  {
    id: "7",
    name: "Logo.svg",
    size: 45678,
    type: "image/svg+xml",
    lastModified: new Date("2024-01-09"),
    isFolder: false,
    parentId: "2",
    path: "/Design Assets/",
  },
  {
    id: "8",
    name: "Brand Guidelines.pdf",
    size: 8765432,
    type: "application/pdf",
    lastModified: new Date("2024-01-08"),
    isFolder: false,
    parentId: "2",
    path: "/Design Assets/",
  },
]

export const useFiles = () => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>({ field: "name", direction: "asc" })
  const [filterOption, setFilterOption] = useState<FilterOption>({})

  const currentFolder = useMemo(() => {
    return files.find((file) => file.id === currentFolderId && file.isFolder)
  }, [files, currentFolderId])

  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [{ id: "root", name: "Home", path: "/" }]

    if (currentFolder) {
      // Build breadcrumb path
      let folder = currentFolder
      const folderPath = []

      while (folder) {
        folderPath.unshift(folder)
        folder = files.find((f) => f.id === folder.parentId && f.isFolder) || null
      }

      folderPath.forEach((f) => {
        crumbs.push({
          id: f.id,
          name: f.name,
          path: f.path || "/",
        })
      })
    }

    return crumbs
  }, [currentFolder, files])

  const filteredAndSortedFiles = useMemo(() => {
    const filtered = files.filter((file) => {
      // Filter by current folder
      if (file.parentId !== currentFolderId) return false

      // Filter by search query
      if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Filter by type
      if (filterOption.type && file.type !== filterOption.type) {
        return false
      }

      // Filter by date range
      if (filterOption.dateRange) {
        const fileDate = new Date(file.lastModified)
        if (fileDate < filterOption.dateRange.start || fileDate > filterOption.dateRange.end) {
          return false
        }
      }

      // Filter by size range
      if (filterOption.sizeRange) {
        if (file.size < filterOption.sizeRange.min || file.size > filterOption.sizeRange.max) {
          return false
        }
      }

      return true
    })

    // Sort files
    filtered.sort((a, b) => {
      // Folders first
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1

      let aValue = a[sortOption.field as keyof FileItem]
      let bValue = b[sortOption.field as keyof FileItem]

      if (sortOption.field === "lastModified") {
        aValue = new Date(aValue as Date).getTime()
        bValue = new Date(bValue as Date).getTime()
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOption.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOption.direction === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return filtered
  }, [files, currentFolderId, searchQuery, sortOption, filterOption])

  const addFiles = useCallback((newFiles: FileItem[]) => {
    setFiles((prev) => [...newFiles, ...prev])
  }, [])

  const updateFile = useCallback((fileId: string, updates: Partial<FileItem>) => {
    setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, ...updates } : file)))
  }, [])

  const deleteFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }, [])

  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId)
  }, [])

  const createFolder = useCallback(
    (name: string) => {
      const newFolder: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        size: 0,
        type: "folder",
        lastModified: new Date(),
        isFolder: true,
        parentId: currentFolderId,
        isStarred: false,
        isShared: false,
        tags: [],
        path: currentFolder ? `${currentFolder.path}${currentFolder.name}/` : "/",
      }

      setFiles((prev) => [newFolder, ...prev])
      return newFolder
    },
    [currentFolderId, currentFolder],
  )

  return {
    files: filteredAndSortedFiles,
    allFiles: files,
    currentFolder,
    currentFolderId,
    breadcrumbs,
    searchQuery,
    sortOption,
    filterOption,
    setSearchQuery,
    setSortOption,
    setFilterOption,
    addFiles,
    updateFile,
    deleteFile,
    navigateToFolder,
    createFolder,
  }
}
