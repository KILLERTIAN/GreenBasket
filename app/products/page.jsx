"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation" 
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
import { fetchCarbonFootprint } from "@/lib/carbon-calculator"
import { SearchBar } from "@/components/SearchBar"
import { ProductSkeletonGrid, ProductSkeletonList } from "@/components/ProductSkeleton"
import productsData from "@/lib/products.json"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category')
  const urlSearch = searchParams.get('search')
  
  const [searchQuery, setSearchQuery] = useState(urlSearch || "")
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || "all")
  const [displayMode, setDisplayMode] = useState("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [productCarbonData, setProductCarbonData] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState(["all"])
  const { addToCart } = useCart()
  
  // Initialize search query and category from URL parameters
  useEffect(() => {
    if (urlSearch) setSearchQuery(urlSearch)
    if (urlCategory) setSelectedCategory(urlCategory)
  }, [urlSearch, urlCategory])
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, sortBy])
  
  // Fetch product data and apply filters client-side
  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      setLoading(true)
      try {
        // Filter products based on search and category
        let filteredProducts = [...productsData];
        
        // Apply category filter if not 'all'
        if (selectedCategory && selectedCategory !== 'all') {
          filteredProducts = filteredProducts.filter(
            product => product.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        }
        
        // Apply search filter if present
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
          );
        }
        
        // Apply sorting
        switch(sortBy) {
          case 'price-low-high':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high-low':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'sustainability':
            filteredProducts.sort((a, b) => (a.carbonFootprint || 5) - (b.carbonFootprint || 5));
            break;
          default: // 'featured' - maintain default order or implement featured sorting logic
            break;
        }
        
        // Calculate pagination
        const total = filteredProducts.length;
        const pages = Math.ceil(total / itemsPerPage);
        
        // Get current page items
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
        
        // Update state
        setProducts(paginatedProducts);
        setTotalProducts(total);
        setTotalPages(pages);
        
        // Extract unique categories for filters
        const uniqueCategories = ['all', ...new Set(productsData.map(p => p.category.toLowerCase()))];
        setCategories(uniqueCategories);
        
      } catch (error) {
        console.error('Error processing products:', error);
        toast.error('Failed to load products');
      } finally {
        // Add slight delay to make loading state visible
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };
    
    fetchAndFilterProducts();
  }, [currentPage, itemsPerPage, selectedCategory, searchQuery, sortBy]);
  
  // Fetch carbon footprint data
  useEffect(() => {
    async function loadCarbonData() {
      const carbonDataMap = {}
      
      // Load carbon data for displayed products
      for (const product of products) {
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
    
    if (products.length > 0) {
      loadCarbonData()
    }
  }, [products])
  
  const handleAddToCart = (product) => {
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
        <h1 className="text-3xl font-bold mb-2">
          {selectedCategory !== 'all' 
            ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`
            : 'All Products'}
        </h1>
        <p className="text-muted-foreground">
          Browse our collection of eco-friendly products that help reduce your carbon footprint.
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              icon={<Search className="h-4 w-4" />}
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
          Showing {totalProducts > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
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
        {loading ? (
          displayMode === 'grid' 
            ? <ProductSkeletonGrid count={itemsPerPage} />
            : <ProductSkeletonList count={Math.min(itemsPerPage, 8)} />
        ) : products.length > 0 ? (
          products.map((product) => (
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
      {totalPages > 1 && !loading && (
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