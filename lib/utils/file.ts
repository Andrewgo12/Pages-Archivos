export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileIcon(fileType: string): string {
  const type = fileType.toLowerCase()

  if (type.includes("image")) return "🖼️"
  if (type.includes("video")) return "🎥"
  if (type.includes("audio")) return "🎵"
  if (type.includes("pdf")) return "📄"
  if (type.includes("word") || type.includes("doc")) return "📝"
  if (type.includes("excel") || type.includes("sheet")) return "📊"
  if (type.includes("powerpoint") || type.includes("presentation")) return "📽️"
  if (type.includes("zip") || type.includes("rar") || type.includes("archive")) return "📦"
  if (type.includes("text")) return "📃"

  return "📁"
}

export function isPreviewable(fileType: string): boolean {
  const previewableTypes = ["image/", "text/", "application/pdf", "video/", "audio/"]

  return previewableTypes.some((type) => fileType.startsWith(type))
}
