"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { toast } from "sonner"
import productsData from "./products.json"

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Load wishlist data when user changes
  useEffect(() => {
    const loadWishlist = () => {
      if (user) {
        // Get wishlist from localStorage
        const savedWishlist = localStorage.getItem(`wishlist_${user.id}`)
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist))
        } else {
          setWishlistItems([])
        }
      } else {
        // No user, empty wishlist
        setWishlistItems([])
      }
      setLoading(false)
    }
    
    loadWishlist()
  }, [user])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user && !loading) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, user, loading])

  // Add product to wishlist
  const addToWishlist = (productId) => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist")
      return false
    }
    
    // Check if product already in wishlist
    if (wishlistItems.includes(productId)) {
      toast.info("Item already in wishlist")
      return false
    }
    
    // Add to wishlist
    setWishlistItems(prev => [...prev, productId])
    toast.success("Added to wishlist")
    return true
  }

  // Remove product from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(id => id !== productId))
    toast.success("Removed from wishlist")
    return true
  }

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId)
  }

  // Toggle wishlist status
  const toggleWishlist = (productId) => {
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId)
    } else {
      return addToWishlist(productId)
    }
  }

  // Get wishlist items with product details
  const getWishlistWithDetails = () => {
    return wishlistItems.map(productId => {
      const productDetails = productsData.find(p => p.id === productId)
      if (productDetails) {
        return {
          ...productDetails,
          image: productDetails.images[0] // Use first image for display
        }
      }
      return null
    }).filter(Boolean) // Remove any nulls (products that couldn't be found)
  }

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([])
    toast.success("Wishlist cleared")
    return true
  }

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    getWishlistWithDetails,
    clearWishlist,
    wishlistCount: wishlistItems.length
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
} 