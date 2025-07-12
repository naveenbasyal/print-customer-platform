"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/stores/cart-store";
import { useStationaryStore } from "@/lib/stores/stationary-store";
import { FileUploader } from "@/components/file-uploader";
import { PriceCalculator } from "@/components/price-calculator";
import {
  Upload,
  Loader2,
  Palette,
  Copy,
  Layers,
  BookOpen,
  CheckCircle,
  Package,
  ShoppingCart,
  User,
  Home,
  LogOut,
  Menu,
  X,
  FileText,
  Settings,
  Calculator,
  Zap,
  Shield,
  Clock,
  Star,
  MapPin,
  Phone,
  AlertCircle,
  Info,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/stores/auth-store";
import Image from "next/image";

interface FileConfig {
  file: File;
  name: string;
  coloured: boolean;
  duplex: boolean;
  spiral: boolean;
  hardbind: boolean;
  quantity: number;
  price: number;
  fileType: string;
}

function UploadContent() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileConfigs, setFileConfigs] = useState<FileConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { uploadFiles, setSelectedStationary, items } = useCartStore();
  const { printingRates, fetchPrintingRates, stationaries, fetchStationaries } =
    useStationaryStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ratesError, setRatesError] = useState("");

  const stationaryId = searchParams.get("stationaryId");
  const selectedStationary = stationaries.find((s) => s.id === stationaryId);

  useEffect(() => {
    fetchStationaries();
  }, [fetchStationaries]);

  useEffect(() => {
    if (stationaryId) {
      setSelectedStationary(stationaryId);
      setRatesError("");
      fetchPrintingRates(stationaryId).catch((error) => {
        setRatesError("Failed to load printing rates. Using default rates.");
        console.error("Printing rates error:", error);
      });
    }
  }, [stationaryId, fetchPrintingRates, setSelectedStationary]);

  useEffect(() => {
    const configs = files.map((file) => ({
      file,
      name: file.name,
      coloured: false,
      duplex: false,
      spiral: false,
      hardbind: false,
      quantity: 1,
      price: 0,
      fileType: "pdf",
    }));
    setFileConfigs(configs);
  }, [files]);

  const updateFileConfig = (index: number, updates: Partial<FileConfig>) => {
    setFileConfigs((prev) =>
      prev.map((config, i) =>
        i === index ? { ...config, ...updates } : config
      )
    );
  };

  const calculatePrice = (config: FileConfig) => {
    const rates = printingRates || {
      colorRate: 10,
      bwRate: 2,
      duplexExtra: 1,
      hardbindRate: 40,
      spiralRate: 20,
    };

    let basePrice = config.coloured ? rates.colorRate : rates.bwRate;
    if (config.duplex) basePrice += rates.duplexExtra;
    if (config.spiral) basePrice += rates.spiralRate;
    if (config.hardbind) basePrice += rates.hardbindRate;

    return basePrice * config.quantity;
  };

  const handleUpload = async () => {
    if (!stationaryId) {
      setError("Stationary ID is required");
      return;
    }

    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const configsWithPrice = fileConfigs.map((config) => ({
        ...config,
        price: calculatePrice(config),
      }));

      await uploadFiles(files, configsWithPrice);
      setSuccess("Files uploaded successfully! Redirecting to cart...");

      setTimeout(() => {
        router.push("/cart");
      }, 1500);
    } catch (error: any) {
      console.error("Upload failed:", error);
      setError(error.message || "Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = fileConfigs.reduce(
    (sum, config) => sum + calculatePrice(config),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className=" rounded-lg flex items-center justify-center ">
                <Image
                  src={"/logo.png"}
                  alt="Logo"
                  width={60}
                  height={60}
                  className="w-16 rounded-full object-cover"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#3366ff] to-[#5588ff] bg-clip-text text-transparent">
                PrintHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#3366ff]"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#3366ff]"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#3366ff] relative"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {items.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#3366ff] text-white">
                      {items.length}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/tools">
                <Button
                  variant="ghost"
                  className="hover:bg-[#3366ff]/10 transition-all duration-200 bg-transparent"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Tools
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#3366ff]"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-4 py-2 space-y-1">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-600"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-600"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-600 relative"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {items.length > 0 && (
                      <Badge className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#3366ff] text-white">
                        {items.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/tools">
                  <Button
                    variant="ghost"
                    className="hover:bg-[#3366ff]/10 transition-all duration-200 bg-transparent"
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    Tools
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-600"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb & Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link
              href="/dashboard"
              className="hover:text-[#3366ff] transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900">Upload Files</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-lg flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Upload Your Files
              </h1>
              <p className="text-gray-600">
                Configure and upload your documents for printing
              </p>
            </div>
          </div>
        </motion.div>

        {/* Selected Stationary Info */}
        {selectedStationary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6 bg-gradient-to-r from-[#3366ff]/5 to-[#5588ff]/5 border-[#3366ff]/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 flex items-center">
                        <span>Printing at</span>
                        <Badge className="ml-2 bg-green-100 text-green-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          Online
                        </Badge>
                      </CardTitle>
                      <p className="text-xl font-bold text-[#3366ff]">
                        {selectedStationary.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-4 w-4 mr-2 text-[#3366ff]" />
                    <span className="text-sm">
                      {selectedStationary.address}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">{selectedStationary.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Current Printing Rates */}
        {printingRates && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-blue-800 flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Current Printing Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    {
                      label: "B&W Print",
                      value: `₹${printingRates.bwRate}`,
                      icon: FileText,
                      color: "text-gray-600",
                    },
                    {
                      label: "Color Print",
                      value: `₹${printingRates.colorRate}`,
                      icon: Palette,
                      color: "text-blue-600",
                    },
                    {
                      label: "Duplex",
                      value: `+₹${printingRates.duplexExtra}`,
                      icon: Copy,
                      color: "text-green-600",
                    },
                    {
                      label: "Spiral Bind",
                      value: `+₹${printingRates.spiralRate}`,
                      icon: Layers,
                      color: "text-purple-600",
                    },
                    {
                      label: "Hard Bind",
                      value: `+₹${printingRates.hardbindRate}`,
                      icon: BookOpen,
                      color: "text-orange-600",
                    },
                  ].map((rate, index) => (
                    <div key={index} className="text-center">
                      <div
                        className={`w-10 h-10 ${rate.color
                          .replace("text-", "bg-")
                          .replace(
                            "-600",
                            "-100"
                          )} rounded-lg flex items-center justify-center mx-auto mb-2`}
                      >
                        <rate.icon className={`h-5 w-5 ${rate.color}`} />
                      </div>
                      <div className="font-semibold text-blue-700">
                        {rate.label}
                      </div>
                      <div className="text-lg font-bold text-blue-800">
                        {rate.value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {ratesError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert className="border-orange-200 bg-orange-50">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  {ratesError}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* File Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6 border border-gray-200 hover:border-[#3366ff]/30 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-[#3366ff]" />
                <span>Select Your Files</span>
                <Badge variant="outline" className="ml-auto">
                  Step 1
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader files={files} onFilesChange={setFiles} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Configuration Section */}
        {fileConfigs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border border-gray-200 hover:border-[#3366ff]/30 transition-colors">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-green-600" />
                    <span>Configure Print Settings</span>
                    <Badge variant="outline" className="ml-2">
                      Step 2
                    </Badge>
                  </CardTitle>
                  <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-[#3366ff]">
                      ₹{totalPrice}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calculator className="h-3 w-3 mr-1" />
                      Total Cost
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {fileConfigs.map((config, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="border rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-[#3366ff]/5 hover:to-[#5588ff]/5 transition-all duration-300"
                  >
                    {/* File Header - Mobile Optimized */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 flex flex-col sm:flex-row sm:items-center truncate">
                            <span className="truncate">{config.name}</span>
                            <Badge
                              variant="outline"
                              className="text-xs mt-1 sm:mt-0 sm:ml-2 w-fit"
                            >
                              PDF
                            </Badge>
                          </h4>
                          <p className="text-sm text-gray-500">
                            Document {index + 1} of {fileConfigs.length}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <PriceCalculator
                          config={config}
                          rates={printingRates}
                          price={calculatePrice(config)}
                        />
                      </div>
                    </div>

                    {/* Print Options - Mobile Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {[
                        {
                          id: `coloured-${index}`,
                          checked: config.coloured,
                          onChange: (checked: boolean) =>
                            updateFileConfig(index, { coloured: checked }),
                          icon: Palette,
                          label: "Colored",
                          color: "text-blue-500",
                          bgColor: "bg-blue-50",
                          borderColor: "border-blue-200",
                        },
                        {
                          id: `duplex-${index}`,
                          checked: config.duplex,
                          onChange: (checked: boolean) =>
                            updateFileConfig(index, { duplex: checked }),
                          icon: Copy,
                          label: "Duplex",
                          color: "text-green-500",
                          bgColor: "bg-green-50",
                          borderColor: "border-green-200",
                        },
                        {
                          id: `spiral-${index}`,
                          checked: config.spiral,
                          onChange: (checked: boolean) =>
                            updateFileConfig(index, { spiral: checked }),
                          icon: Layers,
                          label: "Spiral Bind",
                          color: "text-purple-500",
                          bgColor: "bg-purple-50",
                          borderColor: "border-purple-200",
                        },
                        {
                          id: `hardbind-${index}`,
                          checked: config.hardbind,
                          onChange: (checked: boolean) =>
                            updateFileConfig(index, { hardbind: checked }),
                          icon: BookOpen,
                          label: "Hard Bind",
                          color: "text-orange-500",
                          bgColor: "bg-orange-50",
                          borderColor: "border-orange-200",
                        },
                      ].map((option) => (
                        <motion.div
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            option.checked
                              ? `${option.bgColor} ${option.borderColor} shadow-sm`
                              : "bg-white border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Checkbox
                            id={option.id}
                            checked={option.checked}
                            onCheckedChange={option.onChange}
                          />
                          <Label
                            htmlFor={option.id}
                            className="flex items-center space-x-2 cursor-pointer flex-1"
                          >
                            <option.icon
                              className={`h-4 w-4 ${option.color}`}
                            />
                            <span className="font-medium text-sm sm:text-base">
                              {option.label}
                            </span>
                          </Label>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quantity Selector - Mobile Optimized */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                      <Label
                        htmlFor={`quantity-${index}`}
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        <Package className="h-4 w-4 mr-2 text-gray-500" />
                        Quantity:
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          max="100"
                          value={config.quantity}
                          onChange={(e) =>
                            updateFileConfig(index, {
                              quantity: Number.parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-20 sm:w-24 text-center"
                        />
                        <span className="text-sm text-gray-500">copies</span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Final Action - Mobile Optimized */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col space-y-4 pt-6 border-t border-gray-200"
                >
                  <div className="text-center">
                    <div className="text-sm text-gray-600 flex items-center justify-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Total for {fileConfigs.length} file
                      {fileConfigs.length > 1 ? "s" : ""}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#3366ff] flex items-center justify-center">
                      <span>₹{totalPrice}</span>
                      {totalPrice > 0 && (
                        <Badge className="ml-2 bg-green-100 text-green-700">
                          <Zap className="h-3 w-3 mr-1" />
                          Ready
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={isLoading || files.length === 0}
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Need Help?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Your files are secure and encrypted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Processing takes ~2-5 minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span>Only PDF files are supported</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <UploadContent />
    </ProtectedRoute>
  );
}
