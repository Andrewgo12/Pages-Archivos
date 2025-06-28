"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { FileItem } from "@/lib/types"
import { formatFileSize, getFileIcon } from "@/lib/utils/file"
import { MoreHorizontal, Download, Share, Trash, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileListProps {
  files: FileItem[]
  loading: boolean
  onRefresh: () => void
}

export default function FileList({ files, loading, onRefresh }: FileListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const handleDownload = async (file: FileItem) => {
    try {
      // Increment download count
      await supabase.rpc("increment_download_count", { file_uuid: file.id })

      // Log download
      await supabase.from("download_logs").insert({
        file_id: file.id,
      })

      // Open file in new tab
      window.open(file.blob_url, "_blank")

      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (file: FileItem) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    setDeletingId(file.id)
    try {
      const { error } = await supabase.from("files").delete().eq("id", file.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "File deleted successfully",
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handlePreview = (file: FileItem) => {
    window.open(file.blob_url, "_blank")
  }

  if (loading) {
    return <div className="text-center py-8">Loading files...</div>
  }

  if (files.length === 0) {
    return <div className="text-center py-8 text-gray-500">No files found. Upload some files to get started.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Downloads</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getFileIcon(file.file_type)}</span>
                  <span className="truncate max-w-[200px]">{file.original_name}</span>
                  {file.is_public && <Badge variant="secondary">Public</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{file.file_type}</Badge>
              </TableCell>
              <TableCell>{formatFileSize(file.file_size)}</TableCell>
              <TableCell>{file.download_count}</TableCell>
              <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handlePreview(file)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(file)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(file)}
                      disabled={deletingId === file.id}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      {deletingId === file.id ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
