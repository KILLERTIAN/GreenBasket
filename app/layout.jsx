"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Image from "next/image"
import { DefaultLayout } from "./default-layout"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password"

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>GreenBasket - Sustainable Shopping</title>
        <meta name="description" content="Shop sustainably with recycled and upcycled products" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <div className="flex min-h-screen flex-col">
                  {!isAuthPage && <Navbar />}
                  <main className="flex-1">
                    <DefaultLayout>
                      {children}
                    </DefaultLayout>
                  </main>
                  {!isAuthPage && (
                    <footer className="border-t py-6 md:py-0">
                      <div className="container mx-auto px-4 md:px-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 md:py-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="relative h-8 w-8 overflow-hidden">
                                <Image 
                                  src="/shopping-bag.png" 
                                  alt="Green Basket" 
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <h3 className="text-lg font-medium">About GreenBasket</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              GreenBasket is committed to providing sustainable products 
                              that help reduce your environmental footprint.
                            </p>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Customer Service</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li><a href="#" className="hover:underline">Contact Us</a></li>
                              <li><a href="#" className="hover:underline">FAQ</a></li>
                              <li><a href="#" className="hover:underline">Shipping & Returns</a></li>
                            </ul>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Resources</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li><a href="#" className="hover:underline">Sustainability Blog</a></li>
                              <li><a href="#" className="hover:underline">Our Carbon Commitment</a></li>
                              <li><a href="#" className="hover:underline">Partners</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-between gap-4 border-t py-6 md:h-16 md:flex-row md:py-0">
                          <div className="flex items-center gap-2">
                            <div className="relative h-5 w-5 overflow-hidden">
                              <Image 
                                src="/shopping-bag.png" 
                                alt="Green Basket" 
                                fill
                                className="object-contain"
                              />
                            </div>
                            <p className="text-center text-sm text-muted-foreground md:text-left">
                              &copy; {new Date().getFullYear()} GreenBasket. All rights reserved.
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <a href="#" className="text-sm text-muted-foreground hover:underline">
                              Privacy Policy
                            </a>
                            <a href="#" className="text-sm text-muted-foreground hover:underline">
                              Terms of Service
                            </a>
                          </div>
                        </div>
                      </div>
                    </footer>
                  )}
                </div>
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 