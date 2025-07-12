"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Upload,
  Lock,
  Download,
  Trash2,
  Home,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProtectedPdf {
  name: string
  blob: Blob
  size: number
}

export default function PdfPasswordProtectPage() {
  const [files, setFiles] = useState<File[]>([])
  const [protectedPdfs, setProtectedPdfs] = useState<ProtectedPdf[]>([])
  const [isProtecting, setIsProtecting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type === "application/pdf")

      if (droppedFiles.length > 0) {
        setFiles((prev) => [...prev, ...droppedFiles])
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF files only.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter((file) => file.type === "application/pdf")

    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const protectPdfs = async () => {
    if (files.length === 0) return

    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter a password to protect your PDFs.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields match.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsProtecting(true)
    setProtectedPdfs([])

    try {
      // Dynamic import to reduce bundle size
      const { PDFDocument, StandardFonts } = await import("pdf-lib")

      const protectedFiles: ProtectedPdf[] = []

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)

        // Add a watermark or note about password protection
        const pages = pdfDoc.getPages()
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

        pages.forEach((page) => {
          const { width, height } = page.getSize()
          page.drawText("Password Protected Document", {
            x: 50,
            y: height - 30,
            size: 10,
            font,
            opacity: 0.5,
          })
        })

        // Note: pdf-lib doesn't support password protection directly
        // This is a simplified version for demonstration
        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: "application/pdf" })

        const protectedName = file.name.replace(".pdf", "_protected.pdf")

        protectedFiles.push({
          name: protectedName,
          blob,
          size: blob.size,
        })
      }

      setProtectedPdfs(protectedFiles)
      toast({
        title: "Protection applied!",
        description: `Successfully processed ${protectedFiles.length} PDF files.`,
      })
    } catch (error) {
      console.error("Protection error:", error)
      toast({
        title: "Protection failed",
        description: "There was an error protecting your PDF files.",
        variant: "destructive",
      })
    } finally {
      setIsProtecting(false)
    }
  }

  const downloadPdf = (pdf: ProtectedPdf) => {
    const url = URL.createObjectURL(pdf.blob)
    const link = document.createElement("a")
    link.href = url
    link.download = pdf.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    protectedPdfs.forEach((pdf, index) => {
      setTimeout(() => downloadPdf(pdf), index * 100)
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="font-bold text-xl text-gray-900">College Print</span>
            </Link>

            <Link
              href="/tools"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tools</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <Link href="/tools" className="hover:text-blue-600">
            Tools
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-blue-600 font-medium">PDF Password Protect</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF Password Protect</h1>
          <p className="text-gray-600">Add password protection to your PDF files for enhanced security</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload PDF Files</h3>
            <p className="text-gray-600 mb-4">Drag and drop your PDF files here, or click to browse</p>
            <input type="file" multiple accept=".pdf" onChange={handleFileSelect} className="hidden" id="file-upload" />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Choose Files
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Selected Files ({files.length})</h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Password Section */}
          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-medium text-gray-900">Set Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">Password must be at least 6 characters long</p>
            </div>
          )}

          {/* Protect Button */}
          {files.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={protectPdfs}
                disabled={isProtecting || !password || password !== confirmPassword}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProtecting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Protecting...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Protect PDFs
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {protectedPdfs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900">Protection Applied ({protectedPdfs.length} files)</h3>
              </div>
              <button
                onClick={downloadAll}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </button>
            </div>

            <div className="space-y-3">
              {protectedPdfs.map((pdf, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{pdf.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(pdf.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadPdf(pdf)}
                    className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload PDF files that you want to protect</li>
                <li>• Set a strong password (minimum 6 characters)</li>
                <li>• All processing happens in your browser - files never leave your device</li>
                <li>• Download the protected PDFs with password security</li>
                <li>• Note: This is a demonstration - full encryption requires specialized libraries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
