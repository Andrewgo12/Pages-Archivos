"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  Check,
  Plus,
  ExternalLink,
  Cloud,
  Database,
  Mail,
  Calendar,
  MessageSquare,
  Palette,
  Code,
  Shield,
  Globe,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useToast } from "@/components/ui/Toast"

interface Integration {
  id: string
  name: string
  description: string
  category: "storage" | "productivity" | "communication" | "design" | "development" | "security"
  icon: React.ReactNode
  isConnected: boolean
  isPopular?: boolean
  features: string[]
  setupUrl?: string
}

const mockIntegrations: Integration[] = [
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Sync files with your Dropbox account for seamless backup and sharing",
    category: "storage",
    icon: <Cloud className="w-6 h-6" />,
    isConnected: true,
    isPopular: true,
    features: ["Two-way sync", "Automatic backup", "Shared folders"],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Connect with Google Drive to access and sync your files",
    category: "storage",
    icon: <Database className="w-6 h-6" />,
    isConnected: false,
    isPopular: true,
    features: ["File sync", "Collaborative editing", "Large file support"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Share files directly to Slack channels and receive notifications",
    category: "communication",
    icon: <MessageSquare className="w-6 h-6" />,
    isConnected: true,
    features: ["Direct sharing", "File notifications", "Team collaboration"],
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Send files as attachments directly from your storage",
    category: "communication",
    icon: <Mail className="w-6 h-6" />,
    isConnected: false,
    features: ["Email attachments", "Large file links", "Automatic compression"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Attach files to calendar events and schedule file sharing",
    category: "productivity",
    icon: <Calendar className="w-6 h-6" />,
    isConnected: false,
    features: ["Event attachments", "Scheduled sharing", "Meeting files"],
  },
  {
    id: "adobe-creative",
    name: "Adobe Creative Suite",
    description: "Open and edit files directly in Adobe applications",
    category: "design",
    icon: <Palette className="w-6 h-6" />,
    isConnected: false,
    isPopular: true,
    features: ["Direct editing", "Version sync", "Asset management"],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Sync code repositories and manage project files",
    category: "development",
    icon: <Code className="w-6 h-6" />,
    isConnected: false,
    features: ["Repository sync", "Code backup", "Issue attachments"],
  },
  {
    id: "1password",
    name: "1Password",
    description: "Secure file sharing with encrypted password protection",
    category: "security",
    icon: <Shield className="w-6 h-6" />,
    isConnected: false,
    features: ["Encrypted sharing", "Password protection", "Secure links"],
  },
]

export const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [setupModalOpen, setSetupModalOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleConnect = async (integration: Integration) => {
    if (integration.isConnected) {
      // Disconnect
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIntegrations((prev) => prev.map((int) => (int.id === integration.id ? { ...int, isConnected: false } : int)))
        addToast({
          type: "success",
          title: "Integration disconnected",
          description: `${integration.name} has been disconnected successfully.`,
        })
      } catch (error) {
        addToast({
          type: "error",
          title: "Disconnection failed",
          description: "Could not disconnect integration. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    } else {
      // Connect
      setSelectedIntegration(integration)
      setSetupModalOpen(true)
    }
  }

  const handleSetupIntegration = async () => {
    if (!selectedIntegration) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIntegrations((prev) =>
        prev.map((int) => (int.id === selectedIntegration.id ? { ...int, isConnected: true } : int)),
      )
      setSetupModalOpen(false)
      setSelectedIntegration(null)
      setApiKey("")
      addToast({
        type: "success",
        title: "Integration connected",
        description: `${selectedIntegration.name} has been connected successfully.`,
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Connection failed",
        description: "Could not connect integration. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "storage":
        return <Cloud className="w-4 h-4" />
      case "productivity":
        return <Calendar className="w-4 h-4" />
      case "communication":
        return <MessageSquare className="w-4 h-4" />
      case "design":
        return <Palette className="w-4 h-4" />
      case "development":
        return <Code className="w-4 h-4" />
      case "security":
        return <Shield className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  const filteredIntegrations = integrations.filter((integration) =>
    selectedCategory === "all" ? true : integration.category === selectedCategory,
  )

  const connectedCount = integrations.filter((int) => int.isConnected).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Integrations</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your favorite tools and services to enhance your workflow
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {connectedCount} of {integrations.length} connected
          </span>
          <Button icon={<Plus className="w-4 h-4" />}>Request Integration</Button>
        </div>
      </div>

      {/* Connected Integrations Summary */}
      {connectedCount > 0 && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  {connectedCount} integration{connectedCount !== 1 ? "s" : ""} active
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your connected services are working seamlessly with MegaVault
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            {Array.from(new Set(integrations.map((int) => int.category))).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                icon={getCategoryIcon(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative ${integration.isConnected ? "border-green-200 dark:border-green-800" : ""}`}>
                  {integration.isPopular && (
                    <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          {integration.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(integration.category)}
                            <span className="text-sm text-gray-500 capitalize">{integration.category}</span>
                          </div>
                        </div>
                      </div>
                      {integration.isConnected && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{integration.description}</p>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Features:</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {integration.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-primary-500 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleConnect(integration)}
                        loading={loading}
                        variant={integration.isConnected ? "outline" : "primary"}
                        className="flex-1"
                      >
                        {integration.isConnected ? "Disconnect" : "Connect"}
                      </Button>
                      {integration.setupUrl && (
                        <Button variant="ghost" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                          <span className="sr-only">Learn more</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connected">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations
              .filter((int) => int.isConnected)
              .map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-green-200 dark:border-green-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            {integration.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
                          </div>
                        </div>
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">{integration.description}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          icon={<Settings className="w-4 h-4 bg-transparent" />}
                          className="flex-1"
                        >
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleConnect(integration)}
                          loading={loading}
                          className="flex-1"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="popular">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations
              .filter((int) => int.isPopular)
              .map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative">
                    <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          {integration.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <span className="text-sm text-gray-500 capitalize">{integration.category}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">{integration.description}</p>
                      <Button
                        onClick={() => handleConnect(integration)}
                        loading={loading}
                        variant={integration.isConnected ? "outline" : "primary"}
                        className="w-full"
                      >
                        {integration.isConnected ? "Connected" : "Connect"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="space-y-8">
            {Array.from(new Set(integrations.map((int) => int.category))).map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {integrations
                    .filter((int) => int.category === category)
                    .map((integration) => (
                      <Card key={integration.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                              {integration.icon}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{integration.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {integration.isConnected ? "Connected" : "Available"}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={integration.isConnected ? "outline" : "primary"}
                            onClick={() => handleConnect(integration)}
                          >
                            {integration.isConnected ? "Manage" : "Connect"}
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Setup Integration Modal */}
      <Modal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        title={`Connect ${selectedIntegration?.name}`}
        size="md"
      >
        {selectedIntegration && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                {selectedIntegration.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{selectedIntegration.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedIntegration.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">API Key / Access Token</label>
                <Input
                  type="password"
                  placeholder="Enter your API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can find your API key in your {selectedIntegration.name} account settings
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What you'll get:</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  {selectedIntegration.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSetupModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetupIntegration} loading={loading} disabled={!apiKey.trim()}>
                Connect Integration
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
