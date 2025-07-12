"use client";

import type React from "react";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Home,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConvertedPdf {
  name: string;
  blob: Blob;
  size: number;
}

export default function WordToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedPdfs, setConvertedPdfs] = useState<ConvertedPdf[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const acceptedTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "text/plain", // .txt
    "application/rtf", // .rtf
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) =>
          acceptedTypes.includes(file.type) ||
          file.name.endsWith(".txt") ||
          file.name.endsWith(".docx")
      );

      if (droppedFiles.length > 0) {
        setFiles((prev) => [...prev, ...droppedFiles]);
      } else {
        toast({
          title: "Invalid file type",
          description:
            "Please upload Word documents (.docx only), text files (.txt), or RTF files. .doc files are not supported.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      (file) =>
        acceptedTypes.includes(file.type) ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".docx")
    );

    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    } else {
      toast({
        title: "Invalid file type",
        description:
          "Please upload Word documents (.docx only), text files (.txt), or RTF files. .doc files are not supported.",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const convertToPdf = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setConvertedPdfs([]);

    try {
      // Dynamic imports
      const { jsPDF } = await import("jspdf");
      const mammoth = await import("mammoth");

      const convertedFiles: ConvertedPdf[] = [];

      for (const file of files) {
        try {
          let pdf: any;
          const pdfName = file.name.replace(/\.[^/.]+$/, "") + ".pdf";

          if (file.type === "text/plain" || file.name.endsWith(".txt")) {
            // Handle plain text files
            const textContent = await file.text();
            pdf = new jsPDF();

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const maxWidth = pageWidth - 2 * margin;
            const lineHeight = 7;

            const lines = pdf.splitTextToSize(textContent, maxWidth);
            let yPosition = margin;

            for (let i = 0; i < lines.length; i++) {
              if (yPosition + lineHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
              }
              pdf.text(lines[i], margin, yPosition);
              yPosition += lineHeight;
            }
          } else if (
            file.type.includes("wordprocessingml") ||
            file.name.endsWith(".docx")
          ) {
            // Handle .docx files with formatting and images preserved
            const arrayBuffer = await file.arrayBuffer();

            // Extract HTML to preserve formatting and images
            const result = await mammoth.convertToHtml({
              arrayBuffer,
              convertImage: mammoth.images.imgElement(function (image) {
                return image.read("base64").then(function (imageBuffer) {
                  return {
                    src: "data:" + image.contentType + ";base64," + imageBuffer,
                  };
                });
              }),
            });

            const htmlContent = result.value;

            if (!htmlContent.trim()) {
              throw new Error("No content found in the document");
            }

            // Create PDF with proper formatting
            pdf = new jsPDF({
              orientation: "portrait",
              unit: "mm",
              format: "a4",
            });

            // Create a temporary div to render HTML with better styling
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.position = "absolute";
            tempDiv.style.left = "-9999px";
            tempDiv.style.top = "-9999px";
            tempDiv.style.width = "210mm"; // A4 width
            tempDiv.style.padding = "20mm";
            tempDiv.style.fontFamily = "Arial, sans-serif";
            tempDiv.style.fontSize = "12px";
            tempDiv.style.lineHeight = "1.6";
            tempDiv.style.backgroundColor = "white";
            tempDiv.style.color = "black";
            document.body.appendChild(tempDiv);

            // Enhanced styles for better PDF conversion
            const styleSheet = document.createElement("style");
            styleSheet.textContent = `
              .temp-pdf-content {
                max-width: 170mm;
                margin: 0 auto;
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.6;
                color: #000;
              }
              .temp-pdf-content h1 { 
                font-size: 18px; 
                font-weight: bold; 
                margin: 20px 0 10px 0; 
                color: #000;
                page-break-after: avoid;
              }
              .temp-pdf-content h2 { 
                font-size: 16px; 
                font-weight: bold; 
                margin: 16px 0 8px 0; 
                color: #000;
                page-break-after: avoid;
              }
              .temp-pdf-content h3 { 
                font-size: 14px; 
                font-weight: bold; 
                margin: 12px 0 6px 0; 
                color: #000;
                page-break-after: avoid;
              }
              .temp-pdf-content p { 
                margin: 10px 0; 
                text-align: justify;
                orphans: 2;
                widows: 2;
              }
              .temp-pdf-content ul, .temp-pdf-content ol { 
                margin: 10px 0; 
                padding-left: 20px; 
              }
              .temp-pdf-content li { 
                margin: 6px 0; 
                line-height: 1.5;
              }
              .temp-pdf-content strong, .temp-pdf-content b { 
                font-weight: bold; 
              }
              .temp-pdf-content em, .temp-pdf-content i { 
                font-style: italic; 
              }
              .temp-pdf-content table { 
                border-collapse: collapse; 
                width: 100%; 
                margin: 15px 0;
                page-break-inside: avoid;
              }
              .temp-pdf-content td, .temp-pdf-content th { 
                border: 1px solid #333; 
                padding: 8px; 
                text-align: left;
                vertical-align: top;
              }
              .temp-pdf-content th { 
                background-color: #f5f5f5; 
                font-weight: bold; 
              }
              .temp-pdf-content img {
                max-width: 100%;
                height: auto;
                display: block;
                margin: 15px auto;
                page-break-inside: avoid;
              }
              .temp-pdf-content blockquote {
                margin: 15px 0;
                padding-left: 20px;
                border-left: 3px solid #ccc;
                font-style: italic;
              }
            `;
            document.head.appendChild(styleSheet);
            tempDiv.className = "temp-pdf-content";

            // Wait for images to load and rendering to complete
            await new Promise((resolve) => {
              const images = tempDiv.querySelectorAll("img");
              let loadedImages = 0;

              if (images.length === 0) {
                setTimeout(resolve, 200);
                return;
              }

              images.forEach((img) => {
                if (img.complete) {
                  loadedImages++;
                } else {
                  img.onload = () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                      setTimeout(resolve, 200);
                    }
                  };
                  img.onerror = () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                      setTimeout(resolve, 200);
                    }
                  };
                }
              });

              if (loadedImages === images.length) {
                setTimeout(resolve, 200);
              }
            });

            // Use html2canvas to convert with better quality
            const html2canvas = await import("html2canvas");
            const canvas = await html2canvas.default(tempDiv, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: "#ffffff",
              logging: false,
              height: tempDiv.scrollHeight,
              width: tempDiv.scrollWidth,
            });

            // Clean up
            document.body.removeChild(tempDiv);
            document.head.removeChild(styleSheet);

            // Convert canvas to PDF with proper pagination
            const imgData = canvas.toDataURL("image/jpeg", 0.95);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // Calculate dimensions to fit properly
            const ratio = Math.min(
              pdfWidth / canvasWidth,
              pdfHeight / canvasHeight
            );
            const scaledWidth = canvasWidth * ratio;
            const scaledHeight = canvasHeight * ratio;

            // Center the content
            const xOffset = (pdfWidth - scaledWidth) / 2;
            const yOffset = 0;

            // Add content to PDF with proper page breaks
            let remainingHeight = scaledHeight;
            let sourceY = 0;
            let isFirstPage = true;

            while (remainingHeight > 0) {
              if (!isFirstPage) {
                pdf.addPage();
              }

              const pageContentHeight = Math.min(remainingHeight, pdfHeight);
              const sourceHeight = pageContentHeight / ratio;

              // Create a temporary canvas for this page
              const pageCanvas = document.createElement("canvas");
              pageCanvas.width = canvasWidth;
              pageCanvas.height = sourceHeight;
              const pageCtx = pageCanvas.getContext("2d");

              // Draw the portion of the original canvas for this page
              pageCtx.drawImage(
                canvas,
                0,
                sourceY,
                canvasWidth,
                sourceHeight,
                0,
                0,
                canvasWidth,
                sourceHeight
              );

              const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.95);

              pdf.addImage(
                pageImgData,
                "JPEG",
                xOffset,
                yOffset,
                scaledWidth,
                pageContentHeight
              );

              remainingHeight -= pageContentHeight;
              sourceY += sourceHeight;
              isFirstPage = false;
            }
          } else if (
            file.type === "application/rtf" ||
            file.name.endsWith(".rtf")
          ) {
            // Basic RTF handling
            const rtfContent = await file.text();
            // Simple RTF to text conversion (basic)
            const textContent = rtfContent
              .replace(/\{\\[^}]*\}|\\\w+\s?/g, "")
              .replace(/\s+/g, " ")
              .trim();

            pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const maxWidth = pageWidth - 2 * margin;
            const lineHeight = 7;

            const lines = pdf.splitTextToSize(textContent, maxWidth);
            let yPosition = margin;

            for (let i = 0; i < lines.length; i++) {
              if (yPosition + lineHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
              }
              pdf.text(lines[i], margin, yPosition);
              yPosition += lineHeight;
            }
          } else {
            throw new Error("Unsupported file format");
          }

          const pdfBlob = pdf.output("blob");

          convertedFiles.push({
            name: pdfName,
            blob: pdfBlob,
            size: pdfBlob.size,
          });
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          toast({
            title: `Failed to convert ${file.name}`,
            description:
              "This file format may not be supported or the file may be corrupted.",
            variant: "destructive",
          });
        }
      }

      if (convertedFiles.length > 0) {
        setConvertedPdfs(convertedFiles);
        toast({
          title: "Conversion completed!",
          description: `Successfully converted ${convertedFiles.length} files to PDF with proper pagination.`,
        });
      }
    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion failed",
        description:
          "There was an error converting your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPdf = (pdf: ConvertedPdf) => {
    const url = URL.createObjectURL(pdf.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = pdf.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    convertedPdfs.forEach((pdf, index) => {
      setTimeout(() => downloadPdf(pdf), index * 100);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".docx")) {
      return <FileText className="w-5 h-5 text-blue-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

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
              <span className="font-bold text-xl text-gray-900">
                College Print
              </span>
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
          <span className="text-blue-600 font-medium">Word to PDF</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Word to PDF Converter
          </h1>
          <p className="text-gray-600">
            Convert Word documents (.docx) to PDF with proper pagination and
            text quality
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Document Files
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your Word documents, text files, or RTF files here
            </p>
            <input
              type="file"
              multiple
              accept=".docx,.txt,.rtf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Choose Files
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: .docx, .txt, .rtf
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">
                Selected Files ({files.length})
              </h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.name)}
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(file.size)}
                        </p>
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
                onClick={convertToPdf}
                disabled={isConverting}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting to PDF...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Convert to PDF
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {convertedPdfs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Conversion Complete ({convertedPdfs.length} files)
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
              {convertedPdfs.map((pdf, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">{pdf.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(pdf.size)}
                      </p>
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
                <li>
                  • Upload Word documents (.docx) - text content is extracted
                  and properly formatted
                </li>
                <li>
                  • Text files (.txt) and RTF files are converted with proper
                  pagination
                </li>
                <li>
                  • Content is split into proper pages with correct margins and
                  spacing
                </li>
                <li>
                  • All processing happens in your browser - files never leave
                  your device
                </li>
                <li>• Download individual PDFs or all at once</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
