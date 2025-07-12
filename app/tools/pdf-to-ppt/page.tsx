"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Upload,
  FileType,
  Download,
  Trash2,
  Home,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConvertedPpt {
  name: string
  content: string
  size: number
}

export default function PdfToPptPage() {
  const [files, setFiles] = useState<File[]>([])
  const [convertedPpts, setConvertedPpts] = useState<ConvertedPpt[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
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

  const convertToPpt = async () => {
    if (files.length === 0) return

    setIsConverting(true)
    setConvertedPpts([])

    try {
      // Dynamic import to reduce bundle size
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const convertedFiles: ConvertedPpt[] = []

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

        let pptContent = `PowerPoint Presentation converted from ${file.name}\n\n`

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum)
          const textContent = await page.getTextContent()

          const pageText = textContent.items.map((item: any) => item.str).join(" ")

          pptContent += `Slide ${pageNum}:\n${pageText}\n\n---\n\n`
        }

        const pptName = file.name.replace(".pdf", ".txt")

        convertedFiles.push({
          name: pptName,
          content: pptContent,
          size: new Blob([pptContent]).size,
        })
      }

      setConvertedPpts(convertedFiles)
      toast({
        title: "Conversion completed!",
        description: `Successfully extracted text from ${convertedFiles.length} PDF files.`,
      })
    } catch (error) {
      console.error("Conversion error:", error)
      toast({
        title: "Conversion failed",
        description: "There was an error converting your PDF files.",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const downloadPpt = (ppt: ConvertedPpt) => {
    const blob = new Blob([ppt.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = ppt.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    convertedPpts.forEach((ppt, index) => {
      setTimeout(() => downloadPpt(ppt), index * 100)
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
          <span className="text-blue-600 font-medium">PDF to PPT</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileType className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF to PPT Converter</h1>
          <p className="text-gray-600">Extract text from PDF files for PowerPoint presentations</p>
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
                      <FileType className="w-5 h-5 text-red-500" />
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

          {/* Convert Button */}
          {files.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={convertToPpt}
                disabled={isConverting}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <FileType className="w-5 h-5 mr-2" />
                    Extract Text
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {convertedPpts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Conversion Complete ({convertedPpts.length} files)
                </h3>
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
              {convertedPpts.map((ppt, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <FileType className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900">{ppt.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(ppt.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadPpt(ppt)}
                      className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{ppt.content.substring(0, 200)}...</p>
                  </div>
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
                <li>• Upload PDF files with text content</li>
                <li>• Text is extracted from each page and formatted for presentations</li>
                <li>• All processing happens in your browser - files never leave your device</li>
                <li>• Download as text files that can be imported into PowerPoint</li>
                <li>• Note: This extracts text only, not images or complex formatting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
