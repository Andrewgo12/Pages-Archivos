import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileIcon(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase()

  const iconMap: Record<string, string> = {
    // Images
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    svg: "🖼️",
    webp: "🖼️",
    // Documents
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    txt: "📃",
    rtf: "📃",
    // Spreadsheets
    xls: "📊",
    xlsx: "📊",
    csv: "📊",
    // Presentations
    ppt: "📽️",
    pptx: "📽️",
    // Archives
    zip: "📦",
    rar: "📦",
    "7z": "📦",
    tar: "📦",
    gz: "📦",
    // Audio
    mp3: "🎵",
    wav: "🎵",
    flac: "🎵",
    aac: "🎵",
    // Video
    mp4: "🎥",
    avi: "🎥",
    mkv: "🎥",
    mov: "🎥",
    wmv: "🎥",
    // Code
    js: "💻",
    ts: "💻",
    html: "💻",
    css: "💻",
    json: "💻",
    xml: "💻",
  }

  return iconMap[extension || ""] || "📁"
}

export function getFileColor(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase()

  const colorMap: Record<string, string> = {
    // Images
    jpg: "text-green-500",
    jpeg: "text-green-500",
    png: "text-green-500",
    gif: "text-green-500",
    svg: "text-green-500",
    webp: "text-green-500",
    // Documents
    pdf: "text-red-500",
    doc: "text-blue-500",
    docx: "text-blue-500",
    txt: "text-gray-500",
    rtf: "text-gray-500",
    // Spreadsheets
    xls: "text-emerald-500",
    xlsx: "text-emerald-500",
    csv: "text-emerald-500",
    // Presentations
    ppt: "text-orange-500",
    pptx: "text-orange-500",
    // Archives
    zip: "text-purple-500",
    rar: "text-purple-500",
    "7z": "text-purple-500",
    // Audio
    mp3: "text-pink-500",
    wav: "text-pink-500",
    flac: "text-pink-500",
    // Video
    mp4: "text-indigo-500",
    avi: "text-indigo-500",
    mkv: "text-indigo-500",
    // Code
    js: "text-yellow-500",
    ts: "text-blue-600",
    html: "text-orange-600",
  }

  return colorMap[extension || ""] || "text-gray-400"
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30

  if (diff < minute) return "Just now"
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`
  if (diff < day) return `${Math.floor(diff / hour)}h ago`
  if (diff < week) return `${Math.floor(diff / day)}d ago`
  if (diff < month) return `${Math.floor(diff / week)}w ago`

  return d.toLocaleDateString()
}
