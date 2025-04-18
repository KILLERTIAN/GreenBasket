"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useWishlist } from "@/lib/wishlist-context"
import Link from "next/link"
import { ShoppingCart, Search, Menu, X, User, LogOut, Settings, Package, Heart, Home, Info, Phone, Leaf } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const { cart } = useCart()
  const { user, logout } = useAuth()
  const { wishlistCount } = useWishlist()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // For hydration mismatch prevention with theme
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)
  
  const totalCartItems = cart.reduce((total, item) => total + (item.quantity || 1), 0)
  
  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-200",
      scrolled ? "bg-background/90 backdrop-blur-md border-b shadow-sm" : "bg-background border-b"
    )}>
      <div className="container flex h-16 items-center px-2 sm:px-4">
        <div className="md:hidden mr-1">
          <Button variant="ghost" size="sm" onClick={toggleMenu} aria-label="Toggle menu" className="p-1">
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex items-center">
          <Link href="/" className="mr-2 sm:mr-6 flex items-center space-x-1 sm:space-x-2 group">
            <div className="relative h-6 w-6 sm:h-8 sm:w-8 overflow-hidden transition-transform group-hover:scale-110">
              <Image 
                src="/shopping-bag.png" 
                alt="Green Basket" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-base sm:text-lg transition-colors group-hover:text-primary">
              Green<span className="text-primary">Basket</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-2 text-sm font-medium">
            <Link href="/" className="flex items-center text-muted-foreground px-3 py-2 rounded-md transition-colors hover:text-foreground hover:bg-accent">
              <Home className="mr-1 h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link href="/products" className="flex items-center text-muted-foreground px-3 py-2 rounded-md transition-colors hover:text-foreground hover:bg-accent">
              <Package className="mr-1 h-4 w-4" />
              <span>Products</span>
            </Link>
            <Link href="/about" className="flex items-center text-muted-foreground px-3 py-2 rounded-md transition-colors hover:text-foreground hover:bg-accent">
              <Info className="mr-1 h-4 w-4" />
              <span>About</span>
            </Link>
            <Link href="/contact" className="flex items-center text-muted-foreground px-3 py-2 rounded-md transition-colors hover:text-foreground hover:bg-accent">
              <Phone className="mr-1 h-4 w-4" />
              <span>Contact</span>
            </Link>
            {user?.isAdmin && (
              <Link href="/admin" className="flex items-center text-muted-foreground px-3 py-2 rounded-md transition-colors hover:text-foreground hover:bg-accent">
                <Settings className="mr-1 h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Only render ModeToggle when mounted to avoid hydration issues */}
          {mounted && <div className="block"><ModeToggle /></div>}
          
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full h-8 w-8 sm:h-9 sm:w-9"
            onClick={toggleSearch}
            aria-label="Search"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <Link href="/wishlist" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="relative rounded-full h-8 w-8 sm:h-9 sm:w-9" aria-label="Wishlist">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center translate-x-1/3 -translate-y-1/3">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Button>
          </Link>
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative rounded-full h-8 w-8 sm:h-9 sm:w-9" aria-label="Cart">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center translate-x-1/3 -translate-y-1/3">
                  {totalCartItems > 99 ? '99+' : totalCartItems}
                </span>
              )}
            </Button>
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full h-8 w-8 sm:h-9 sm:w-9 border border-border overflow-hidden p-0"
                  aria-label="User menu"
                >
                  <span className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary text-sm sm:text-base rounded-full">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1" sideOffset={8}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Wishlist</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-white font-medium text-xs sm:text-sm px-3 sm:px-5 h-8 sm:h-9">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden border-t transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-1 px-4 pb-3 pt-2">
          <Link 
            href="/" 
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="mr-2 h-5 w-5" />
            Home
          </Link>
          <Link 
            href="/products" 
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setIsMenuOpen(false)}
          >
            <Package className="mr-2 h-5 w-5" />
            Products
          </Link>
          <Link 
            href="/about" 
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setIsMenuOpen(false)}
          >
            <Info className="mr-2 h-5 w-5" />
            About
          </Link>
          <Link 
            href="/contact" 
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setIsMenuOpen(false)}
          >
            <Phone className="mr-2 h-5 w-5" />
            Contact
          </Link>
          <Link 
            href="/wishlist" 
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setIsMenuOpen(false)}
          >
            <Heart className="mr-2 h-5 w-5" />
            <span className="flex-1">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          {mounted && <div className="flex items-center px-3 py-2 text-sm font-medium">
            <Leaf className="mr-2 h-5 w-5" />
            <span className="mr-2">Theme:</span>
            <ModeToggle />
          </div>}
          {user?.isAdmin && (
            <Link 
              href="/admin" 
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="mr-2 h-5 w-5" />
              Admin
            </Link>
          )}
        </div>
      </div>
      
      {/* Search Overlay */}
      <div className={`${isSearchOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-16 z-50 border-b bg-background/95 backdrop-blur-sm p-2 sm:p-4 shadow-md`}>
        <form className="flex w-full max-w-2xl mx-auto">
          <Input
            type="search"
            placeholder="Search for eco-friendly products..."
            className="flex-1 rounded-l-full rounded-r-none border-r-0 text-sm"
            autoFocus
          />
          <Button type="submit" className="rounded-l-none rounded-r-full text-sm px-3 sm:px-4">
            Search
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={toggleSearch}
            className="ml-1 sm:ml-2 rounded-full h-8 w-8 sm:h-9 sm:w-9"
            aria-label="Close search"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </form>
      </div>
    </header>
  )
} 