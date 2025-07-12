"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Upload, FileImage, Download, X, Plus, Home, ChevronRight, ArrowLeft, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface ImageFile {
  file: File
  preview: string
  id: string
}

export default function JpgToPdfPage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return

    const newImages: ImageFile[] = []

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file)
        newImages.push({
          file,
          preview,
          id: Math.random().toString(36).substr(2, 9),
        })
      }
    })

    setImages((prev) => [...prev, ...newImages])
  }, [])

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const convertToPdf = async () => {
    if (images.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image to convert.",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    try {
      // Dynamic import to reduce bundle size
      const { jsPDF } = await import("jspdf")
      const pdf = new jsPDF()

      for (let i = 0; i < images.length; i++) {
        const image = images[i]

        // Create image element to get dimensions
        const img = new Image()
        img.crossOrigin = "anonymous"

        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = image.preview
        })

        // Calculate dimensions to fit page
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const imgAspectRatio = img.width / img.height
        const pageAspectRatio = pageWidth / pageHeight

        let imgWidth, imgHeight

        if (imgAspectRatio > pageAspectRatio) {
          imgWidth = pageWidth - 20 // 10px margin on each side
          imgHeight = imgWidth / imgAspectRatio
        } else {
          imgHeight = pageHeight - 20 // 10px margin on top and bottom
          imgWidth = imgHeight * imgAspectRatio
        }

        const x = (pageWidth - imgWidth) / 2
        const y = (pageHeight - imgHeight) / 2

        if (i > 0) {
          pdf.addPage()
        }

        pdf.addImage(img, "JPEG", x, y, imgWidth, imgHeight)
      }

      const pdfBlob = pdf.output("blob")
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)

      toast({
        title: "Conversion successful!",
        description: `${images.length} image(s) converted to PDF.`,
      })
    } catch (error) {
      console.error("Conversion error:", error)
      toast({
        title: "Conversion failed",
        description: "There was an error converting your images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const downloadPdf = () => {
    if (pdfUrl) {
      const a = document.createElement("a")
      a.href = pdfUrl
      a.download = `converted-images-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const resetConverter = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview))
    setImages([])
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
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
          <span className="text-gray-900 font-medium">JPG to PDF</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <FileImage className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            JPG to PDF Converter
          </motion.h1>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Convert your JPG images to a single PDF document instantly
          </motion.p>
        </div>

        {/* Upload Area */}
        {!pdfUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="mb-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <CardContent className="p-8">
                <div
                  className="text-center cursor-pointer"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  onDrop={(e) => {
                    e.preventDefault()
                    handleFileUpload(e.dataTransfer.files)
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Images</h3>
                  <p className="text-gray-600 mb-4">Drag and drop your JPG images here, or click to browse</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Image Preview */}
        {images.length > 0 && !pdfUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Selected Images ({images.length})
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={resetConverter}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Badge className="absolute top-2 left-2 text-xs">{index + 1}</Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={convertToPdf}
                    disabled={isConverting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isConverting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <FileImage className="w-4 h-4 mr-2" />
                        Convert to PDF
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Download Section */}
        {pdfUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Ready!</h3>
                <p className="text-gray-600 mb-6">Your images have been successfully converted to PDF</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={downloadPdf}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" onClick={resetConverter}>
                    Convert Another
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
