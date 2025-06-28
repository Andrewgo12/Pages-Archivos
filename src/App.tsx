"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { FileUpload } from "@/components/files/FileUpload"
import { FileGrid } from "@/components/files/FileGrid"
import { FileList } from "@/components/files/FileList"
import { GalleryView } from "@/components/views/GalleryView"
import { Modal } from "@/components/ui/Modal"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { ToastProvider, useToast } from "@/components/ui/Toast"
import { AuthProvider, useAuth } from "@/hooks/useAuth"
import { LoginPage } from "@/components/auth/LoginPage"
import { RegisterPage } from "@/components/auth/RegisterPage"
import { SettingsPage } from "@/components/settings/SettingsPage"
import { SecurityPage } from "@/components/security/SecurityPage"
import { BackupPage } from "@/components/backup/BackupPage"
import { SharedPage } from "@/components/shared/SharedPage"
import { TrashPage } from "@/components/trash/TrashPage"
import { TeamPage } from "@/components/team/TeamPage"
import { VersionsPage } from "@/components/versions/VersionsPage"
import { CommentsPage } from "@/components/comments/CommentsPage"
import { AnalyticsPage } from "@/components/analytics/AnalyticsPage"
import { IntegrationsPage } from "@/components/integrations/IntegrationsPage"
import { AutomationPage } from "@/components/automation/AutomationPage"
import { ActivityFeed } from "@/components/activity/ActivityFeed"
import { ShareModal } from "@/components/modals/ShareModal"
import { FilePropertiesModal } from "@/components/modals/FilePropertiesModal"
import {
  NotFoundPage,
  ServerErrorPage,
  NetworkErrorPage,
  UnauthorizedPage,
  MaintenancePage,
} from "@/components/errors/ErrorPages"
import { useFiles } from "@/hooks/useFiles"
import { useFileOperations } from "@/hooks/useFileOperations"
import type { FileItem } from "@/types"
import { FilePreview } from "@/components/files/FilePreview"

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return authMode === "login" ? (
      <LoginPage onSwitchToRegister={() => setAuthMode("register")} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthMode("login")} />
    )
  }

  return <>{children}</>
}

const AppContent: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "gallery">("grid")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [propertiesModalOpen, setPropertiesModalOpen] = useState(false)
  const [selectedFileForModal, setSelectedFileForModal] = useState<FileItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)

  const location = useLocation()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const {
    files,
    currentFolder,
    currentFolderId,
    breadcrumbs,
    searchQuery,
    sortOption,
    setSearchQuery,
    setSortOption,
    addFiles,
    updateFile,
    deleteFile,
    navigateToFolder,
    createFolder,
  } = useFiles()

  const { uploadFiles, deleteFile: deleteFileOperation, renameFile, toggleStar, shareFile } = useFileOperations()

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true)
    }
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark])

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSort = (field: string) => {
    setSortOption((prev) => ({
      field: field as any,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleFileClick = (file: FileItem) => {
    if (file.isFolder) {
      navigateToFolder(file.id)
    } else {
      handleFileAction("preview", file)
    }
  }

  const handleFileAction = async (action: string, file: FileItem) => {
    try {
      switch (action) {
        case "preview":
          setPreviewFile(file)
          break

        case "download":
          if (file.url) {
            const link = document.createElement("a")
            link.href = file.url
            link.download = file.name
            link.click()
            addToast({
              type: "success",
              title: "Download started",
              description: `${file.name} is being downloaded`,
            })
          }
          break

        case "share":
          setSelectedFileForModal(file)
          setShareModalOpen(true)
          break

        case "properties":
          setSelectedFileForModal(file)
          setPropertiesModalOpen(true)
          break

        case "star":
          const newStarred = await toggleStar(file.id, file.isStarred || false)
          updateFile(file.id, { isStarred: newStarred })
          addToast({
            type: "success",
            title: newStarred ? "File starred" : "File unstarred",
            description: `${file.name} has been ${newStarred ? "added to" : "removed from"} your starred files`,
          })
          break

        case "rename":
          const newName = prompt("Enter new name:", file.name)
          if (newName && newName !== file.name) {
            await renameFile(file.id, newName)
            updateFile(file.id, { name: newName })
            addToast({
              type: "success",
              title: "File renamed",
              description: `File renamed to ${newName}`,
            })
          }
          break

        case "delete":
          if (confirm(`Are you sure you want to delete ${file.name}?`)) {
            await deleteFileOperation(file.id)
            deleteFile(file.id)
            addToast({
              type: "success",
              title: "File deleted",
              description: `${file.name} has been moved to trash`,
            })
          }
          break

        default:
          console.log("Unhandled action:", action, file)
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Action failed",
        description: error instanceof Error ? error.message : "An error occurred",
      })
    }
  }

  const handleUploadComplete = async (uploadedFiles: File[]) => {
    try {
      setLoading(true)
      const newFiles = await uploadFiles(uploadedFiles, currentFolderId)
      addFiles(newFiles)
      setUploadModalOpen(false)
      addToast({
        type: "success",
        title: "Upload complete",
        description: `${uploadedFiles.length} file(s) uploaded successfully`,
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBreadcrumbNavigate = (id: string | null) => {
    navigateToFolder(id)
  }

  const renderFileView = () => {
    switch (viewMode) {
      case "gallery":
        return <GalleryView files={files} onFileAction={handleFileAction} />
      case "list":
        return (
          <FileList
            files={files}
            onFileClick={handleFileClick}
            onFileAction={handleFileAction}
            sortField={sortOption.field}
            sortDirection={sortOption.direction}
            onSort={handleSort}
          />
        )
      default:
        return (
          <FileGrid files={files} onFileClick={handleFileClick} onFileAction={handleFileAction} loading={loading} />
        )
    }
  }

  const renderContent = () => {
    switch (location.pathname) {
      case "/":
        return <Dashboard />

      case "/files":
        return (
          <div className="space-y-4 lg:space-y-6">
            <Breadcrumb items={breadcrumbs} onNavigate={handleBreadcrumbNavigate} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {currentFolder ? currentFolder.name : "My Files"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{files.length} items</p>
              </div>
            </div>

            {renderFileView()}
          </div>
        )

      case "/starred":
        const starredFiles = files.filter((file) => file.isStarred)
        return (
          <div className="space-y-4 lg:space-y-6">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">Starred Files</h1>
              <p className="text-gray-600 dark:text-gray-400">{starredFiles.length} starred items</p>
            </div>
            {renderFileView()}
          </div>
        )

      case "/shared":
        return <SharedPage />

      case "/trash":
        return <TrashPage />

      case "/settings":
        return <SettingsPage />

      case "/security":
        return <SecurityPage />

      case "/backup":
        return <BackupPage />

      case "/team":
        return <TeamPage />

      case "/versions":
        return <VersionsPage />

      case "/comments":
        return <CommentsPage />

      case "/analytics":
        return <AnalyticsPage />

      case "/integrations":
        return <IntegrationsPage />

      case "/automation":
        return <AutomationPage />

      case "/activity":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Activity Feed</h1>
              <p className="text-gray-600 dark:text-gray-400">Track all file activities and team collaboration</p>
            </div>
            <ActivityFeed />
          </div>
        )

      case "/404":
        return <NotFoundPage />

      case "/500":
        return <ServerErrorPage />

      case "/network-error":
        return <NetworkErrorPage />

      case "/unauthorized":
        return <UnauthorizedPage />

      case "/maintenance":
        return <MaintenancePage />

      default:
        return <NotFoundPage />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        currentPath={location.pathname}
        onNavigate={(path) => navigate(path)}
        onClose={() => setSidebarCollapsed(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onToggleTheme={() => setIsDark(!isDark)}
          onUploadClick={() => setUploadModalOpen(true)}
          isDark={isDark}
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode as any)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + currentFolderId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Upload Modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Upload Files" size="lg">
        <FileUpload onUploadComplete={handleUploadComplete} />
      </Modal>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false)
          setSelectedFileForModal(null)
        }}
        file={selectedFileForModal}
      />

      {/* File Properties Modal */}
      <FilePropertiesModal
        isOpen={propertiesModalOpen}
        onClose={() => {
          setPropertiesModalOpen(false)
          setSelectedFileForModal(null)
        }}
        file={selectedFileForModal}
        onUpdate={(updates) => {
          if (selectedFileForModal) {
            updateFile(selectedFileForModal.id, updates)
          }
        }}
      />

      {/* File Preview Modal */}
      <FilePreview
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        onAction={(action, file) => {
          handleFileAction(action, file)
          if (action === "delete") {
            setPreviewFile(null)
          }
        }}
      />
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AuthWrapper>
            <Routes>
              <Route path="/*" element={<AppContent />} />
            </Routes>
          </AuthWrapper>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
