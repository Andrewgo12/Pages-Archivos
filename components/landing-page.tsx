import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Shield, Share, Zap, Users, BarChart } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">CloudVault</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Secure File Storage & Sharing</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Store, organize, and share your files with advanced security features. Support for all file types up to 2GB
          with real-time collaboration.
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link href="/auth/register">Start Free Trial</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>AES-256 encryption, secure sharing, and advanced access controls</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Share className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Easy Sharing</CardTitle>
              <CardDescription>Share files with customizable permissions and expiration dates</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-600 mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>Global CDN ensures fast uploads and downloads worldwide</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>Real-time comments, version control, and team workspaces</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>Track downloads, storage usage, and file engagement</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Cloud className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Unlimited File Types</CardTitle>
              <CardDescription>Support for all file formats with preview capabilities</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who trust CloudVault with their files
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/register">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 CloudVault. All rights reserved.</p>
      </footer>
    </div>
  )
}
