"use client"

import { Inter } from "next/font/google"
import "@/app/globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "sonner"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <Navbar />
                  <main>{children}</main>
                  <Footer />
                  <Toaster position="top-center" richColors closeButton />
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
} 