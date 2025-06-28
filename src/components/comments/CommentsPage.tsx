"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Send, Reply, Edit, Trash2, Heart, FileText, Search, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { formatDate } from "@/lib/utils"
import type { Comment, FileItem } from "@/types"

// Mock comments data
const mockComments: Comment[] = [
  {
    id: "c1",
    fileId: "file1",
    userId: "user1",
    userName: "John Doe",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "This design looks great! I love the new color scheme. Can we make the header a bit larger?",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    replies: [
      {
        id: "c1r1",
        fileId: "file1",
        userId: "user2",
        userName: "Jane Smith",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content: "I agree! The colors work really well together. I'll increase the header size in the next version.",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        parentId: "c1",
      },
    ],
  },
  {
    id: "c2",
    fileId: "file1",
    userId: "user3",
    userName: "Mike Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "The typography needs some work. The body text is a bit hard to read on mobile devices.",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "c3",
    fileId: "file2",
    userId: "user2",
    userName: "Jane Smith",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "Great documentation! Very thorough and well-structured. This will be helpful for the team.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
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
  },
  {
    id: "file2",
    name: "Project_Document.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1024000,
    lastModified: new Date(),
    ownerId: "user1",
  },
]

export const CommentsPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState<"all" | "unresolved" | "mine">("all")
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const { addToast } = useToast()

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file)
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedFile) return

    try {
      const comment: Comment = {
        id: `c${Date.now()}`,
        fileId: selectedFile.id,
        userId: "user1",
        userName: "John Doe",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content: newComment,
        createdAt: new Date(),
      }

      setComments((prev) => [comment, ...prev])
      setNewComment("")

      addToast({
        type: "success",
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to add comment",
        description: "Could not post comment. Please try again.",
      })
    }
  }

  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim()) return

    try {
      const reply: Comment = {
        id: `r${Date.now()}`,
        fileId: selectedFile?.id || "",
        userId: "user1",
        userName: "John Doe",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content: replyText,
        createdAt: new Date(),
        parentId,
      }

      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply],
            }
          }
          return comment
        }),
      )

      setReplyText("")
      setReplyingTo(null)

      addToast({
        type: "success",
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to add reply",
        description: "Could not post reply. Please try again.",
      })
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))

      addToast({
        type: "success",
        title: "Comment deleted",
        description: "The comment has been deleted successfully.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to delete comment",
        description: "Could not delete comment. Please try again.",
      })
    }
  }

  const getFileComments = () => {
    if (!selectedFile) return []
    return comments.filter((comment) => comment.fileId === selectedFile.id && !comment.parentId)
  }

  const filteredComments = getFileComments().filter((comment) => {
    if (searchQuery && !comment.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (filterBy === "mine" && comment.userId !== "user1") {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Comments & Collaboration</h1>
          <p className="text-gray-600 dark:text-gray-400">Discuss and collaborate on files with your team</p>
        </div>
        <Button onClick={() => setCommentModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          New Discussion
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File List */}
        <Card>
          <CardHeader>
            <CardTitle>Files with Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockFiles.map((file) => {
                const fileCommentCount = comments.filter((c) => c.fileId === file.id && !c.parentId).length
                return (
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
                          {fileCommentCount} comment{fileCommentCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="lg:col-span-2">
          {selectedFile ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Comments - {selectedFile.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search comments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-48"
                      />
                    </div>
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    >
                      <option value="all">All Comments</option>
                      <option value="mine">My Comments</option>
                      <option value="unresolved">Unresolved</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Comment */}
                <div className="space-y-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      icon={<Send className="w-4 h-4" />}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {filteredComments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-4"
                    >
                      {/* Main Comment */}
                      <div className="flex gap-3">
                        <img
                          src={comment.userAvatar || "/placeholder.svg"}
                          alt={comment.userName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-gray-100">{comment.userName}</span>
                                <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" icon={<Heart className="w-4 h-4" />}>
                                  <span className="sr-only">Like</span>
                                </Button>
                                <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />}>
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteComment(comment.id)}
                                  icon={<Trash2 className="w-4 h-4" />}
                                >
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                          </div>

                          <div className="flex items-center gap-4 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyingTo(comment.id)}
                              icon={<Reply className="w-4 h-4" />}
                            >
                              Reply
                            </Button>
                          </div>

                          {/* Reply Form */}
                          {replyingTo === comment.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-4 space-y-3"
                            >
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 resize-none"
                                rows={2}
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddReply(comment.id)}
                                  disabled={!replyText.trim()}
                                >
                                  Reply
                                </Button>
                              </div>
                            </motion.div>
                          )}

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-4 space-y-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-3">
                                  <img
                                    src={reply.userAvatar || "/placeholder.svg"}
                                    alt={reply.userName}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <div className="flex-1">
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                          {reply.userName}
                                        </span>
                                        <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                                      </div>
                                      <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredComments.length === 0 && (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No comments yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Select a File</h3>
                <p className="text-gray-600 dark:text-gray-400">Choose a file to view and add comments</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Discussion Modal */}
      <Modal
        isOpen={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        title="Start New Discussion"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select File</label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              {mockFiles.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Discussion Topic</label>
            <Input placeholder="What would you like to discuss?" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Initial Message</label>
            <textarea
              placeholder="Start the discussion..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 resize-none"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCommentModalOpen(false)}>
              Cancel
            </Button>
            <Button>Start Discussion</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
