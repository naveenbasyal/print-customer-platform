"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import {
  Package,
  Home,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  Wrench,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavbarProps {
  currentPage?: string;
}

export function Navbar({ currentPage }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items, fetchCartItems } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPath = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: Package },
    // { href: "/upload", label: "Upload", icon: Upload },
    { href: "/tools", label: "Tools", icon: Wrench },
    { href: "/cart", label: "Cart", icon: ShoppingCart, badge: items.length },
    { href: "/orders", label: "Orders", icon: ShoppingBag },
    { href: "/profile", label: "Profile", icon: User },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated]);

  const isCurrentPage = (href: string) => {
    if (currentPath) {
      return currentPath === href;
    }
    return false;
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="rounded-lg flex items-center justify-center">
              <Image
                src={"/logo.png"}
                alt="Logo"
                width={60}
                height={60}
                className="w-16 rounded-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#3366ff] to-[#5588ff] bg-clip-text text-transparent">
              PrintHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                if (
                  currentPath === "/" &&
                  item.href !== "/dashboard" &&
                  currentPath === "/" &&
                  item.href !== "/tools"
                ) {
                  return null;
                }

                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative transition-colors ${
                        isCurrentPage(item.href)
                          ? "text-[#3366ff] bg-[#3366ff]/10"
                          : "text-gray-600 hover:text-[#3366ff]"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#3366ff] text-white">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className=" text-red-600 border border-red-400 hover:bg-red-500 hover:text-white "
              >
                <LogOut className="h-4 w-4 me-2" />
                Sign Out
              </Button>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/tools">
                <Button
                  variant="ghost"
                  className={`w-full justify-start relative ${
                    isCurrentPage("/tools")
                      ? "text-[#3366ff] bg-[#3366ff]/10"
                      : "text-gray-600"
                  }`}
                >
                  <Wrench className="h-3 w-3" />
                  Tools
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="hover:bg-gray-100 transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Get Started
                </Button>
              </Link>
            </nav>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
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
            <div className="px-4 py-2 space-y-1 md:flex ">
              {isAuthenticated ? (
                <div className=" gap-x-2">
                  {navItems.slice(1).map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start relative ${
                            isCurrentPage(item.href)
                              ? "text-[#3366ff] bg-[#3366ff]/10"
                              : "text-gray-600"
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                          {item.badge && item.badge > 0 && (
                            <Badge className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#3366ff] text-white">
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      </Link>
                    );
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-red-600"
                  >
                    <LogOut className="h-4 w-4 " />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/tools">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start relative ${
                        isCurrentPage("/tools")
                          ? "text-[#3366ff] bg-[#3366ff]/10"
                          : "text-gray-600"
                      }`}
                    >
                      <Wrench className="h-3 w-3" />
                      Tools
                    </Button>
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-600"
                    >
                      <LogIn className="h-4 w-4 " />
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r mt-2 from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
