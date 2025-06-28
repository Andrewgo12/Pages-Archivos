"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Folder } from "@/lib/types"
import { FolderPlus, FolderIcon, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FolderListProps {
  folders: Folder[]
  currentFolder: string | null
  onFolderClick: (folderId: string | null) => void
  onRefresh: () => void
}

export default function FolderList({ folders, currentFolder, onFolderClick, onRefresh }: FolderListProps) {
  const [newFolderName, setNewFolderName] = useState("")
  const [creating, setCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    setCreating(true)
    try {
      const { error } = await supabase.from("folders").insert({
        name: newFolderName.trim(),
        parent_id: currentFolder,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Folder created successfully",
      })

      setNewFolderName("")
      setDialogOpen(false)
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {currentFolder && (
            <Button variant="ghost" size="sm" onClick={() => onFolderClick(null)}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <span className="text-sm text-gray-500">{currentFolder ? "Current Folder" : "Root Directory"}</span>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <FolderPlus className="h-4 w-4 mr-1" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFolder()
                  }
                }}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFolder} disabled={creating || !newFolderName.trim()}>
                  {creating ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Folders Grid */}
      {folders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onFolderClick(folder.id)}
              className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FolderIcon className="h-12 w-12 text-blue-500 mb-2" />
              <span className="text-sm font-medium truncate w-full text-center">{folder.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
