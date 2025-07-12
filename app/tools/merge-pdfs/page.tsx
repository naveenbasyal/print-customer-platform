"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Upload, FileText, Download, X, Plus, Home, ChevronRight, ArrowLeft, Eye, Trash2, Merge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface PdfFile {
  file: File
  id: string
  name: string
  size: string
}

export default function MergePdfsPage() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newPdfs: PdfFile[] = []

      Array.from(files).forEach((file) => {
        if (file.type === "application/pdf") {
          newPdfs.push({
            file,
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: formatFileSize(file.size),
          })
        }
      })

      if (newPdfs.length === 0) {
        toast({
          title: "Invalid files",
          description: "Please select only PDF files.",
          variant: "destructive",
        })
        return
      }

      setPdfs((prev) => [...prev, ...newPdfs])
    },
    [toast],
  )

  const removePdf = (id: string) => {
    setPdfs((prev) => prev.filter((pdf) => pdf.id !== id))
  }

  const movePdf = (id: string, direction: "up" | "down") => {
    setPdfs((prev) => {
      const index = prev.findIndex((pdf) => pdf.id === id)
      if (index === -1) return prev

      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newPdfs = [...prev]
      const [movedPdf] = newPdfs.splice(index, 1)
      newPdfs.splice(newIndex, 0, movedPdf)
      return newPdfs
    })
  }

  const mergePdfs = async () => {
    if (pdfs.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please upload at least 2 PDF files to merge.",
        variant: "destructive",
      })
      return
    }

    setIsMerging(true)

    try {
      // Dynamic import to reduce bundle size
      const { PDFDocument } = await import("pdf-lib")

      const mergedPdf = await PDFDocument.create()

      for (const pdfFile of pdfs) {
        const arrayBuffer = await pdfFile.file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      setMergedPdfUrl(url)

      toast({
        title: "Merge successful!",
        description: `${pdfs.length} PDF files merged successfully.`,
      })
    } catch (error) {
      console.error("Merge error:", error)
      toast({
        title: "Merge failed",
        description: "There was an error merging your PDFs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMerging(false)
    }
  }

  const downloadMergedPdf = () => {
    if (mergedPdfUrl) {
      const a = document.createElement("a")
      a.href = mergedPdfUrl
      a.download = `merged-pdf-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const resetMerger = () => {
    setPdfs([])
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl)
      setMergedPdfUrl(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CP</span>
                </div>
                <span className="font-semibold text-gray-900">College Print</span>
              </Link>
            </div>

            <Button asChild variant="outline" size="sm">
              <Link href="/tools">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/tools" className="hover:text-blue-600 transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Merge PDFs</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Merge className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Merge PDF Files
          </motion.h1>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Combine multiple PDF files into a single document
          </motion.p>
        </div>

        {/* Upload Area */}
        {!mergedPdfUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="mb-8 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
              <CardContent className="p-8">
                <div
                  className="text-center cursor-pointer"
                  onClick={() => document.getElementById("pdf-upload")?.click()}
                  onDrop={(e) => {
                    e.preventDefault()
                    handleFileUpload(e.dataTransfer.files)
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF Files</h3>
                  <p className="text-gray-600 mb-4">Drag and drop your PDF files here, or click to browse</p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Choose PDFs
                  </Button>
                  <input
                    id="pdf-upload"
                    type="file"
                    multiple
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* PDF List */}
        {pdfs.length > 0 && !mergedPdfUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    PDF Files ({pdfs.length})
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={resetMerger}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {pdfs.map((pdf, index) => (
                    <div key={pdf.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <FileText className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-xs">{pdf.name}</p>
                          <p className="text-sm text-gray-500">{pdf.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col space-y-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-6 p-0 bg-transparent"
                            onClick={() => movePdf(pdf.id, "up")}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-6 p-0 bg-transparent"
                            onClick={() => movePdf(pdf.id, "down")}
                            disabled={index === pdfs.length - 1}
                          >
                            ↓
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-8 h-8 p-0"
                          onClick={() => removePdf(pdf.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={mergePdfs}
                    disabled={isMerging || pdfs.length < 2}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isMerging ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Merging...
                      </>
                    ) : (
                      <>
                        <Merge className="w-4 h-4 mr-2" />
                        Merge PDFs
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Download Section */}
        {mergedPdfUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Merged Successfully!</h3>
                <p className="text-gray-600 mb-6">Your PDF files have been merged into a single document</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={downloadMergedPdf}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Merged PDF
                  </Button>
                  <Button variant="outline" onClick={resetMerger}>
                    Merge Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
