"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileText, Cloud } from "lucide-react";

interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export function FileUploader({ files, onFilesChange }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const pdfFiles = acceptedFiles.filter(
        (file) => file.type === "application/pdf"
      );
      onFilesChange([...files, ...pdfFiles]);
    },
    [files, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
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

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`p-6 md:p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-400 bg-blue-50" : "hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <div>
              {isDragActive ? (
                <div>
                  <Cloud className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                  <p className="text-xl font-semibold text-blue-600 mb-2">
                    Drop your files here!
                  </p>
                  <p className="text-gray-600">Release to upload your PDFs</p>
                </div>
              ) : (
                <div>
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="md:h-10 md:w-10 h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Upload Your PDFs
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Drag & drop your files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Only PDF files are supported
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Selected Files ({files.length})
              </h3>
            </div>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 md:p-4 bg-white rounded-lg border border-green-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm break-all whitespace-normal">
                        {file.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
