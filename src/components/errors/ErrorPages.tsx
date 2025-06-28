"use client"

import type React from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Home, RefreshCw, ArrowLeft, Wifi, Server, Lock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"

interface ErrorPageProps {
  title: string
  description: string
  icon: React.ReactNode
  actions?: React.ReactNode
}

const ErrorPageLayout: React.FC<ErrorPageProps> = ({ title, description, icon, actions }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        <Card>
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              {icon}
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{description}</p>

            {actions && <div className="space-y-3">{actions}</div>}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export const NotFoundPage: React.FC = () => {
  return (
    <ErrorPageLayout
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      icon={<AlertTriangle className="w-10 h-10 text-orange-500" />}
      actions={
        <>
          <Button onClick={() => window.history.back()} icon={<ArrowLeft className="w-4 h-4" />}>
            Go Back
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")} icon={<Home className="w-4 h-4" />}>
            Go Home
          </Button>
        </>
      }
    />
  )
}

export const ServerErrorPage: React.FC = () => {
  return (
    <ErrorPageLayout
      title="Server Error"
      description="Something went wrong on our end. We're working to fix this issue."
      icon={<Server className="w-10 h-10 text-red-500" />}
      actions={
        <>
          <Button onClick={() => window.location.reload()} icon={<RefreshCw className="w-4 h-4" />}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")} icon={<Home className="w-4 h-4" />}>
            Go Home
          </Button>
        </>
      }
    />
  )
}

export const NetworkErrorPage: React.FC = () => {
  return (
    <ErrorPageLayout
      title="Connection Error"
      description="Unable to connect to the server. Please check your internet connection."
      icon={<Wifi className="w-10 h-10 text-blue-500" />}
      actions={
        <>
          <Button onClick={() => window.location.reload()} icon={<RefreshCw className="w-4 h-4" />}>
            Retry Connection
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")} icon={<Home className="w-4 h-4" />}>
            Go Home
          </Button>
        </>
      }
    />
  )
}

export const UnauthorizedPage: React.FC = () => {
  return (
    <ErrorPageLayout
      title="Access Denied"
      description="You don't have permission to access this resource."
      icon={<Lock className="w-10 h-10 text-purple-500" />}
      actions={
        <>
          <Button onClick={() => window.history.back()} icon={<ArrowLeft className="w-4 h-4" />}>
            Go Back
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/auth/login")}>
            Sign In
          </Button>
        </>
      }
    />
  )
}

export const MaintenancePage: React.FC = () => {
  return (
    <ErrorPageLayout
      title="Under Maintenance"
      description="We're currently performing scheduled maintenance. Please check back soon."
      icon={<Server className="w-10 h-10 text-yellow-500" />}
      actions={
        <Button onClick={() => window.location.reload()} icon={<RefreshCw className="w-4 h-4" />}>
          Check Again
        </Button>
      }
    />
  )
}
