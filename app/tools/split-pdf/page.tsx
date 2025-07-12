"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Upload,
  Split,
  Download,
  Trash2,
  Home,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SplitPage {
  id: string
  pageNumber: number
  blob: Blob
  name: string
}

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [splitPages, setSplitPages] = useState<SplitPage[]>([])
  const [isSplitting, setIsSplitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
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

      const droppedFile = e.dataTransfer.files[0]

      if (droppedFile && droppedFile.type === "application/pdf") {
        setFile(droppedFile)
        setSplitPages([])
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setSplitPages([])
    }
  }

  const removeFile = () => {
    setFile(null)
    setSplitPages([])
    setTotalPages(0)
  }

  const splitPdf = async () => {
    if (!file) return

    setIsSplitting(true)
    setSplitPages([])

    try {
      // Dynamic import to reduce bundle size
      const { PDFDocument } = await import("pdf-lib")

      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pageCount = pdfDoc.getPageCount()
      setTotalPages(pageCount)

      const pages: SplitPage[] = []

      for (let i = 0; i < pageCount; i++) {
        // Create a new PDF document for each page
        const newPdfDoc = await PDFDocument.create()
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
        newPdfDoc.addPage(copiedPage)

        const pdfBytes = await newPdfDoc.save()
        const blob = new Blob([pdfBytes], { type: "application/pdf" })

        pages.push({
          id: `page-${i + 1}`,
          pageNumber: i + 1,
          blob,
          name: `${file.name.replace(".pdf", "")}_page_${i + 1}.pdf`,
        })
      }

      setSplitPages(pages)
      toast({
        title: "PDF split successfully!",
        description: `Created ${pageCount} separate PDF files.`,
      })
    } catch (error) {
      console.error("Split error:", error)
      toast({
        title: "Split failed",
        description: "There was an error splitting your PDF file.",
        variant: "destructive",
      })
    } finally {
      setIsSplitting(false)
    }
  }

  const downloadPage = (page: SplitPage) => {
    const url = URL.createObjectURL(page.blob)
    const link = document.createElement("a")
    link.href = url
    link.download = page.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    splitPages.forEach((page, index) => {
      setTimeout(() => downloadPage(page), index * 100)
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
          <span className="text-blue-600 font-medium">Split PDF</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Split className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Split PDF</h1>
          <p className="text-gray-600">Split a PDF file into separate pages</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload PDF File</h3>
            <p className="text-gray-600 mb-4">Drag and drop your PDF file here, or click to browse</p>
            <input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" id="file-upload" />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Choose File
            </label>
          </div>

          {/* File Display */}
          {file && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Selected File</h4>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button onClick={removeFile} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Split Button */}
          {file && (
            <div className="mt-6 text-center">
              <button
                onClick={splitPdf}
                disabled={isSplitting}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSplitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Splitting...
                  </>
                ) : (
                  <>
                    <Split className="w-5 h-5 mr-2" />
                    Split PDF
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {splitPages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900">Split Complete ({splitPages.length} pages)</h3>
              </div>
              <button
                onClick={downloadAll}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {splitPages.map((page) => (
                <div key={page.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-900 text-sm mb-1">Page {page.pageNumber}</p>
                  <p className="text-xs text-gray-600 mb-3">{formatFileSize(page.blob.size)}</p>
                  <button
                    onClick={() => downloadPage(page)}
                    className="w-full inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
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
                <li>• Upload a PDF file with multiple pages</li>
                <li>• Each page will be extracted as a separate PDF file</li>
                <li>• All processing happens in your browser - files never leave your device</li>
                <li>• Download individual pages or all at once</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
