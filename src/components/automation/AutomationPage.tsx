"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Zap,
  Play,
  Pause,
  Plus,
  Settings,
  Clock,
  FileText,
  Upload,
  Download,
  Share2,
  Trash2,
  Copy,
  Archive,
  Tag,
  Filter,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useToast } from "@/components/ui/Toast"
import { formatDate } from "@/lib/utils"

interface WorkflowTrigger {
  type: "file_upload" | "file_download" | "file_share" | "schedule" | "file_size" | "file_type"
  label: string
  icon: React.ReactNode
  config?: Record<string, any>
}

interface WorkflowAction {
  type:
    | "move_file"
    | "copy_file"
    | "delete_file"
    | "share_file"
    | "tag_file"
    | "compress_file"
    | "backup_file"
    | "notify"
  label: string
  icon: React.ReactNode
  config?: Record<string, any>
}

interface Workflow {
  id: string
  name: string
  description: string
  trigger: WorkflowTrigger
  actions: WorkflowAction[]
  isActive: boolean
  createdAt: Date
  lastRun?: Date
  runCount: number
  successRate: number
}

const availableTriggers: WorkflowTrigger[] = [
  {
    type: "file_upload",
    label: "File Upload",
    icon: <Upload className="w-4 h-4" />,
  },
  {
    type: "file_download",
    label: "File Download",
    icon: <Download className="w-4 h-4" />,
  },
  {
    type: "file_share",
    label: "File Share",
    icon: <Share2 className="w-4 h-4" />,
  },
  {
    type: "schedule",
    label: "Schedule",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    type: "file_size",
    label: "File Size",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    type: "file_type",
    label: "File Type",
    icon: <Filter className="w-4 h-4" />,
  },
]

const availableActions: WorkflowAction[] = [
  {
    type: "move_file",
    label: "Move File",
    icon: <ArrowRight className="w-4 h-4" />,
  },
  {
    type: "copy_file",
    label: "Copy File",
    icon: <Copy className="w-4 h-4" />,
  },
  {
    type: "tag_file",
    label: "Add Tags",
    icon: <Tag className="w-4 h-4" />,
  },
  {
    type: "share_file",
    label: "Share File",
    icon: <Share2 className="w-4 h-4" />,
  },
  {
    type: "compress_file",
    label: "Compress File",
    icon: <Archive className="w-4 h-4" />,
  },
  {
    type: "backup_file",
    label: "Backup File",
    icon: <Archive className="w-4 h-4" />,
  },
  {
    type: "delete_file",
    label: "Delete File",
    icon: <Trash2 className="w-4 h-4" />,
  },
]

const mockWorkflows: Workflow[] = [
  {
    id: "w1",
    name: "Auto-organize Images",
    description: "Automatically move uploaded images to the Photos folder and add date tags",
    trigger: {
      type: "file_upload",
      label: "File Upload",
      icon: <Upload className="w-4 h-4" />,
      config: { fileTypes: ["image/*"] },
    },
    actions: [
      {
        type: "move_file",
        label: "Move File",
        icon: <ArrowRight className="w-4 h-4" />,
        config: { destination: "/Photos" },
      },
      {
        type: "tag_file",
        label: "Add Tags",
        icon: <Tag className="w-4 h-4" />,
        config: { tags: ["photo", "auto-organized"] },
      },
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    runCount: 45,
    successRate: 98,
  },
  {
    id: "w2",
    name: "Large File Backup",
    description: "Backup files larger than 100MB to external storage",
    trigger: {
      type: "file_size",
      label: "File Size",
      icon: <FileText className="w-4 h-4" />,
      config: { minSize: 104857600 }, // 100MB
    },
    actions: [
      {
        type: "backup_file",
        label: "Backup File",
        icon: <Archive className="w-4 h-4" />,
        config: { destination: "external-storage" },
      },
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    runCount: 12,
    successRate: 100,
  },
  {
    id: "w3",
    name: "Weekly Cleanup",
    description: "Delete temporary files older than 7 days every Sunday",
    trigger: {
      type: "schedule",
      label: "Schedule",
      icon: <Clock className="w-4 h-4" />,
      config: { schedule: "0 0 * * 0" }, // Every Sunday at midnight
    },
    actions: [
      {
        type: "delete_file",
        label: "Delete File",
        icon: <Trash2 className="w-4 h-4" />,
        config: { pattern: "*.tmp", olderThan: 7 },
      },
    ],
    isActive: false,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    runCount: 3,
    successRate: 100,
  },
]

export const AutomationPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null)
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    trigger: null as WorkflowTrigger | null,
    actions: [] as WorkflowAction[],
  })
  const { addToast } = useToast()

  const handleToggleWorkflow = async (workflowId: string) => {
    try {
      setWorkflows((prev) =>
        prev.map((workflow) => (workflow.id === workflowId ? { ...workflow, isActive: !workflow.isActive } : workflow)),
      )

      const workflow = workflows.find((w) => w.id === workflowId)
      addToast({
        type: "success",
        title: `Workflow ${workflow?.isActive ? "paused" : "activated"}`,
        description: `${workflow?.name} has been ${workflow?.isActive ? "paused" : "activated"}.`,
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to update workflow",
        description: "Could not update workflow status. Please try again.",
      })
    }
  }

  const handleCreateWorkflow = async () => {
    if (!newWorkflow.name || !newWorkflow.trigger || newWorkflow.actions.length === 0) {
      addToast({
        type: "error",
        title: "Incomplete workflow",
        description: "Please fill in all required fields.",
      })
      return
    }

    try {
      const workflow: Workflow = {
        id: `w${Date.now()}`,
        name: newWorkflow.name,
        description: newWorkflow.description,
        trigger: newWorkflow.trigger,
        actions: newWorkflow.actions,
        isActive: true,
        createdAt: new Date(),
        runCount: 0,
        successRate: 0,
      }

      setWorkflows((prev) => [workflow, ...prev])
      setCreateModalOpen(false)
      setNewWorkflow({
        name: "",
        description: "",
        trigger: null,
        actions: [],
      })

      addToast({
        type: "success",
        title: "Workflow created",
        description: "Your new workflow has been created and activated.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to create workflow",
        description: "Could not create workflow. Please try again.",
      })
    }
  }

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm("Are you sure you want to delete this workflow?")) return

    try {
      setWorkflows((prev) => prev.filter((workflow) => workflow.id !== workflowId))
      addToast({
        type: "success",
        title: "Workflow deleted",
        description: "The workflow has been deleted successfully.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to delete workflow",
        description: "Could not delete workflow. Please try again.",
      })
    }
  }

  const activeWorkflows = workflows.filter((w) => w.isActive).length
  const totalRuns = workflows.reduce((sum, w) => sum + w.runCount, 0)
  const avgSuccessRate =
    workflows.length > 0 ? workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Automation & Workflows</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Automate repetitive tasks and streamline your file management
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Workflows</p>
                <p className="text-2xl font-bold text-green-600">{activeWorkflows}</p>
              </div>
              <Zap className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Workflows</p>
                <p className="text-2xl font-bold text-blue-600">{workflows.length}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Runs</p>
                <p className="text-2xl font-bold text-purple-600">{totalRuns}</p>
              </div>
              <Play className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-orange-600">{avgSuccessRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows">My Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <div className="space-y-4">
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={workflow.isActive ? "border-green-200 dark:border-green-800" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{workflow.name}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              workflow.isActive
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {workflow.isActive ? "Active" : "Paused"}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{workflow.description}</p>

                        {/* Workflow Flow */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            {workflow.trigger.icon}
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              {workflow.trigger.label}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <div className="flex items-center gap-2">
                            {workflow.actions.map((action, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                  {action.icon}
                                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                                    {action.label}
                                  </span>
                                </div>
                                {idx < workflow.actions.length - 1 && <ArrowRight className="w-3 h-3 text-gray-400" />}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                          <span>Created {formatDate(workflow.createdAt)}</span>
                          {workflow.lastRun && <span>Last run {formatDate(workflow.lastRun)}</span>}
                          <span>{workflow.runCount} runs</span>
                          <span>{workflow.successRate}% success rate</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleWorkflow(workflow.id)}
                          icon={workflow.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        >
                          {workflow.isActive ? "Pause" : "Activate"}
                        </Button>
                        <Button variant="outline" size="sm" icon={<Settings className="w-4 h-4 bg-transparent" />}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                          icon={<Trash2 className="w-4 h-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {workflows.length === 0 && (
              <Card>
                <CardContent className="text-center py-16">
                  <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No workflows yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first workflow to automate file management tasks
                  </p>
                  <Button onClick={() => setCreateModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                    Create Workflow
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Auto-organize by Type",
                description: "Automatically organize files into folders based on their type",
                trigger: "File Upload",
                actions: ["Move File", "Add Tags"],
              },
              {
                name: "Backup Large Files",
                description: "Automatically backup files larger than a specified size",
                trigger: "File Size",
                actions: ["Backup File", "Notify"],
              },
              {
                name: "Clean Temp Files",
                description: "Regularly delete temporary and cache files",
                trigger: "Schedule",
                actions: ["Delete File"],
              },
            ].map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{template.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Trigger: {template.trigger}</p>
                      <p className="text-sm font-medium">Actions: {template.actions.join(", ")}</p>
                    </div>
                    <Button className="w-full">Use Template</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Workflow Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    workflow: "Auto-organize Images",
                    status: "success",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    filesProcessed: 5,
                  },
                  {
                    workflow: "Large File Backup",
                    status: "success",
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    filesProcessed: 2,
                  },
                  {
                    workflow: "Auto-organize Images",
                    status: "failed",
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    filesProcessed: 0,
                    error: "Destination folder not found",
                  },
                ].map((run, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          run.status === "success" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                        }`}
                      >
                        {run.status === "success" ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{run.workflow}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(run.timestamp)} • {run.filesProcessed} files processed
                        </p>
                        {run.error && <p className="text-sm text-red-600 dark:text-red-400">{run.error}</p>}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        run.status === "success"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {run.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Workflow Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Workflow" size="lg">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Workflow Name</label>
              <Input
                placeholder="Enter workflow name..."
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                placeholder="Describe what this workflow does..."
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Choose Trigger</h3>
            <div className="grid grid-cols-2 gap-3">
              {availableTriggers.map((trigger) => (
                <button
                  key={trigger.type}
                  onClick={() => setNewWorkflow((prev) => ({ ...prev, trigger }))}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    newWorkflow.trigger?.type === trigger.type
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                      : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {trigger.icon}
                    <span className="font-medium">{trigger.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Choose Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {availableActions.map((action) => (
                <button
                  key={action.type}
                  onClick={() => {
                    const isSelected = newWorkflow.actions.some((a) => a.type === action.type)
                    if (isSelected) {
                      setNewWorkflow((prev) => ({
                        ...prev,
                        actions: prev.actions.filter((a) => a.type !== action.type),
                      }))
                    } else {
                      setNewWorkflow((prev) => ({
                        ...prev,
                        actions: [...prev.actions, action],
                      }))
                    }
                  }}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    newWorkflow.actions.some((a) => a.type === action.type)
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                      : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {action.icon}
                    <span className="font-medium">{action.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
