"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Search, SlidersHorizontal, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import productsData from "@/lib/products.json"
import { fetchCarbonFootprint } from "@/lib/carbon-calculator" 

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [displayMode, setDisplayMode] = useState("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [productCarbonData, setProductCarbonData] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const { addToCart } = useCart()
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, sortBy])
  
  // Fetch carbon footprint data for all products on initial load
  useEffect(() => {
    async function loadAllCarbonData() {
      const carbonDataMap = {}
      
      // Load carbon data for first 6 products to avoid overloading
      const productsToLoad = productsData.slice(0, 12)
      
      for (const product of productsToLoad) {
        try {
          const data = await fetchCarbonFootprint(product.id)
          carbonDataMap[product.id] = data
        } catch (error) {
          console.error(`Error fetching carbon data for product ${product.id}:`, error)
          // Set fallback values
          carbonDataMap[product.id] = {
            footprint: product.carbonFootprint || 5.0,
            conventionalFootprint: (product.carbonFootprint || 5.0) * 3,
            savings: {
              savings: ((product.carbonFootprint || 5.0) * 2).toFixed(2),
              percentage: "67"
            }
          }
        }
      }
      
      setProductCarbonData(carbonDataMap)
    }
    
    loadAllCarbonData()
  }, [])
  
  // Filter products based on search query and selected category
  let filtered = [...productsData];
  
  // Filter by search query
  if (searchQuery) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Filter by category
  if (selectedCategory && selectedCategory !== 'all') {
    filtered = filtered.filter(product => {
      const category = product.category.toLowerCase();
      // Handle category mapping for URL parameters
      if (selectedCategory === 'home') {
        return category === 'home goods';
      } else {
        return category === selectedCategory;
      }
    });
  } else {
    // When no specific category is selected, only show stationery, personal-care, and accessories
    filtered = filtered.filter(product => {
      const category = product.category.toLowerCase();
      const isDisplayableCategory = category === 'stationery' || 
                                   category === 'personal-care' || 
                                   category === 'accessories';
      return isDisplayableCategory;
    });
  }
  
  // Sort products based on selected option
  const sortedProducts = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.price - b.price
      case "price-high-low":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "sustainability":
        const aFootprint = productCarbonData[a.id]?.footprint || a.carbonFootprint || 0
        const bFootprint = productCarbonData[b.id]?.footprint || b.carbonFootprint || 0
        return aFootprint - bFootprint
      default:
        return 0 // Default sort (featured)
    }
  })
  
  // Calculate pagination values
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex)
  
  // Generate unique categories from product data
  const categories = ["all", ...new Set(productsData.map(product => product.category))]
  
  const handleAddToCart = (product) => {
    // Add loading state for the specific product in a real implementation
    
    // Simulate an API call
    setTimeout(() => {
      addToCart({
        ...product,
        image: product.images[0] // Use first image for cart thumbnail
      })
      toast.success(`${product.name} added to cart`)
    }, 500)
  }
  
  // Function to format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }
  
  // Handle page change
  const goToPage = (page) => {
    // Ensure page is within valid range
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    // Scroll to top of products section
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <div className="container mx-auto py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sustainable Products</h1>
        <p className="text-muted-foreground">
          Browse our collection of eco-friendly products that help reduce your carbon footprint.
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="sustainability">Most Sustainable</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            
            <div className="hidden sm:flex border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-r-none ${displayMode === 'grid' ? 'bg-muted' : ''}`}
                onClick={() => setDisplayMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-l-none border-l ${displayMode === 'list' ? 'bg-muted' : ''}`}
                onClick={() => setDisplayMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Category filters */}
        <div className={`${filtersOpen || 'hidden sm:block'}`}>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Products count and pagination info */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {sortedProducts.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} products
        </p>
        
        <div className="flex items-center gap-2">
          <Select value={String(itemsPerPage)} onValueChange={(value) => {
            setItemsPerPage(Number(value))
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8 per page</SelectItem>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
              <SelectItem value="48">48 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Products grid or list */}
      <div className={`grid gap-6 ${
        displayMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <Card 
              key={product.id} 
              className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
                displayMode === 'list' ? 'flex flex-col sm:flex-row' : ''
              }`}
            >
              <Link href={`/products/${product.id}`} className="contents">
                <div className={`relative ${
                  displayMode === 'list' 
                    ? 'h-56 sm:h-auto sm:w-1/3 sm:min-h-[180px]' 
                    : 'aspect-square'
                } bg-gray-50 w-full overflow-hidden`}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes={displayMode === 'grid' 
                      ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" 
                      : "(max-width: 640px) 100vw, 33vw"
                    }
                    className="object-contain transition-transform duration-300 hover:scale-105"
                  />
                  
                  <Badge variant="secondary" className="absolute top-2 right-2 font-normal">
                    <Leaf className="h-3.5 w-3.5 mr-1 text-green-500" />
                    {productCarbonData[product.id]?.footprint || product.carbonFootprint || "5.0"} kg CO₂
                  </Badge>
                </div>
              </Link>
              
              <CardContent className={`p-4 flex flex-col ${
                displayMode === 'list' ? 'sm:flex-1' : ''
              }`}>
                <Link href={`/products/${product.id}`} className="group">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors line-clamp-1 mb-1">{product.name}</h3>
                </Link>
                
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-lg text-primary">{formatPrice(product.price)}</p>
                  
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="mt-auto">
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-muted-foreground mb-4">Try changing your search or filter criteria</p>
            <Button onClick={() => {
              setSearchQuery(""); 
              setSelectedCategory("all");
            }}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
      
      {/* Pagination controls */}
      {sortedProducts.length > 0 && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center">
              {/* Show first page */}
              {currentPage > 3 && (
                <>
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(1)}
                    className="w-8 h-8 p-0"
                  >
                    1
                  </Button>
                  {currentPage > 4 && (
                    <span className="mx-2 text-muted-foreground">...</span>
                  )}
                </>
              )}
              
              {/* Show page numbers around current page */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                
                if (totalPages <= 5) {
                  // If 5 or fewer pages, show all
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // Near the start
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // Near the end
                  pageNum = totalPages - 4 + i;
                } else {
                  // In the middle
                  pageNum = currentPage - 2 + i;
                }
                
                // Skip rendering if outside valid range or if it's an ellipsis position
                if (pageNum <= 0 || pageNum > totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className="w-8 h-8 p-0 mx-1"
                  >
                    {pageNum}
                  </Button>
                );
              }).filter(Boolean)}
              
              {/* Show last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="mx-2 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    className="w-8 h-8 p-0"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 