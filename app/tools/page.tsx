"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileImage,
  FileText,
  Merge,
  Split,
  Minimize2,
  FileType,
  Lock,
  Unlock,
  Filter,
  ArrowRight,
  Home,
  ChevronRight,
  Clock,
  CheckCircle,
  Zap,
  Sparkles,
  Package,
  Wrench,
  ShoppingCart,
  LogOut,
  X,
  Menu,
  User,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";

const tools = [
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG images to PDF documents",
    icon: FileImage,
    category: "image",
    color: "from-blue-500 to-blue-600",
    available: true,
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Extract images from PDF files",
    icon: FileImage,
    category: "image",
    color: "from-green-500 to-green-600",
    available: false,
  },
  {
    id: "merge-pdfs",
    name: "Merge PDFs",
    description: "Combine multiple PDF files into one",
    icon: Merge,
    category: "pdf",
    color: "from-purple-500 to-purple-600",
    available: true,
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Split PDF into separate pages",
    icon: Split,
    category: "pdf",
    color: "from-orange-500 to-orange-600",
    available: true,
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size",
    icon: Minimize2,
    category: "pdf",
    color: "from-red-500 to-red-600",
    available: false,
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Word documents to PDF",
    icon: FileText,
    category: "office",
    color: "from-blue-600 to-indigo-600",
    available: false,
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF to editable Word document",
    icon: FileText,
    category: "office",
    color: "from-indigo-500 to-purple-500",
    available: false,
  },
  {
    id: "ppt-to-pdf",
    name: "PPT to PDF",
    description: "Convert PowerPoint to PDF",
    icon: FileType,
    category: "office",
    color: "from-pink-500 to-rose-500",
    available: false,
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF",
    icon: FileType,
    category: "office",
    color: "from-emerald-500 to-teal-500",
    available: false,
  },
  {
    id: "pdf-to-ppt",
    name: "PDF to PPT",
    description: "Convert PDF to PowerPoint presentation",
    icon: FileType,
    category: "office",
    color: "from-violet-500 to-purple-500",
    available: false,
  },
  {
    id: "pdf-password-protect",
    name: "PDF Password Protect",
    description: "Add password protection to PDF files",
    icon: Lock,
    category: "security",
    color: "from-gray-600 to-gray-700",
    available: false,
  },
  {
    id: "pdf-unlock",
    name: "PDF Unlock",
    description: "Remove password from PDF files",
    icon: Unlock,
    category: "security",
    color: "from-yellow-500 to-amber-500",
    available: false,
  },
];

export default function ToolsPage() {
  const { user, changePassword, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const availableTools = tools.filter((tool) => tool.available);
  const filteredTools =
    selectedCategory === "all"
      ? availableTools
      : availableTools.filter((tool) => tool.category === selectedCategory);
  const availableCount = filteredTools.filter((tool) => tool.available).length;
  const comingSoonCount = tools.filter((tool) => !tool.available).length;

  const categories = [
    { id: "all", name: "All Tools", count: availableTools.length },
    {
      id: "image",
      name: "Image",
      count: availableTools.filter((t) => t.category === "image").length,
    },
    {
      id: "pdf",
      name: "PDF",
      count: availableTools.filter((t) => t.category === "pdf").length,
    },
    {
      id: "office",
      name: "Office",
      count: availableTools.filter((t) => t.category === "office").length,
    },
    {
      id: "security",
      name: "Security",
      count: availableTools.filter((t) => t.category === "security").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Home className="w-4 h-4" />
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-blue-600 font-medium">Tools</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Document Tools
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Convert, merge, split, and process your documents directly in your
            browser. No uploads required - everything happens locally and
            securely.
          </motion.p>

          {/* Status Summary */}
          <motion.div
            className="flex items-center justify-center space-x-6 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">{availableCount} Available</span>
            </div>
            <div className="flex items-center space-x-2 text-amber-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{comingSoonCount} Coming Soon</span>
            </div>
          </motion.div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          {filteredTools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative"
              >
                <div
                  className={`bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 h-[280px] flex flex-col ${
                    tool.available
                      ? "hover:shadow-xl hover:-translate-y-1"
                      : "opacity-75 hover:opacity-90"
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {tool.available ? (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        <span>Coming Soon</span>
                      </div>
                    )}
                  </div>

                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
                      tool.color
                    } flex items-center justify-center mb-4 ${
                      tool.available ? "group-hover:scale-110" : ""
                    } transition-transform duration-200`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-20">
                    {tool.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
                    {tool.description}
                  </p>

                  {/* Button Container - Always at bottom */}
                  <div className="mt-auto">
                    {tool.available ? (
                      <Link
                        href={`/tools/${tool.id}`}
                        className="group/button inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg overflow-hidden relative"
                      >
                        <span className="relative z-10 flex items-center">
                          <span className="group-hover/button:mr-1 transition-all duration-300">
                            Use Tool
                          </span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/button:translate-x-1 group-hover/button:opacity-0 transition-all duration-300" />
                          <Zap className="w-4 h-4 ml-2 opacity-0 group-hover/button:opacity-100 group-hover/button:-translate-x-6 transition-all duration-300 absolute" />
                        </span>

                        {/* Sparkle effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300">
                          <Sparkles className="w-3 h-3 absolute top-1 right-2 text-white/60 animate-pulse" />
                          <Sparkles className="w-2 h-2 absolute bottom-2 left-3 text-white/40 animate-pulse delay-150" />
                        </div>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>

                {/* Coming Soon Overlay */}
                {!tool.available && (
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] rounded-xl pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose Our Tools?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">100% Secure</h3>
              <p className="text-gray-600 text-sm">
                All processing happens in your browser. Your files never leave
                your device.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileType className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Limits</h3>
              <p className="text-gray-600 text-sm">
                Process unlimited files without size restrictions or usage
                limits.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Minimize2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600 text-sm">
                Instant processing with no upload or download delays.
              </p>
            </div>
          </div>
        </div>

        {/* Development Roadmap */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-900">
              Coming Soon
            </h3>
          </div>
          <p className="text-amber-800 text-sm mb-4">
            We're actively working on expanding our tool collection. Office
            document conversions and advanced features are in development.
          </p>
          <div className="flex flex-wrap gap-2">
            {tools
              .filter((tool) => !tool.available)
              .map((tool) => (
                <span
                  key={tool.id}
                  className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tool.name}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
