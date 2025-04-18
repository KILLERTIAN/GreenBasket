"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Leaf, Droplets, Factory, Wind, ShoppingCart, Star, Heart, Truck, Shield, CheckCircle } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ProductImageSlider } from "@/components/product-image-slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import productsData from "@/lib/products.json"
import { fetchCarbonFootprint } from "@/lib/carbon-calculator"
import React from "react"

export default function ProductDetailPage({ params }) {
  const router = useRouter()
  const { addToCart, cart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [carbonData, setCarbonData] = useState(null)
  const [isLoadingCarbon, setIsLoadingCarbon] = useState(true)
  
  // Unwrap the params object using React.use()
  const unwrappedParams = React.use(params)
  const product = productsData.find(p => p.id === parseInt(unwrappedParams.id))
  
  // Fetch carbon footprint data when product loads
  useEffect(() => {
    async function loadCarbonData() {
      if (product) {
        setIsLoadingCarbon(true)
        try {
          const data = await fetchCarbonFootprint(product.id)
          setCarbonData(data)
        } catch (error) {
          console.error("Error fetching carbon data:", error)
          // Set fallback values
          setCarbonData({
            footprint: product.carbonFootprint || 5.0,
            conventionalFootprint: (product.carbonFootprint || 5.0) * 3,
            savings: {
              savings: ((product.carbonFootprint || 5.0) * 2).toFixed(2),
              percentage: "67"
            }
          })
        } finally {
          setIsLoadingCarbon(false)
        }
      }
    }
    
    loadCarbonData()
  }, [product])
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button variant="outline" onClick={() => router.push('/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to products
        </Button>
      </div>
    )
  }
  
  // Check if item is already in cart
  const cartItem = cart.find(item => item.id === product.id)
  const isInCart = !!cartItem
  
  // Check if item is in wishlist
  const productInWishlist = isInWishlist(product.id)
  
  // Function to format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }
  
  const handleAddToCart = () => {
    setIsLoading(true)
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Add product to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart({
          ...product,
          image: product.images[0] // Use first image for cart thumbnail
        });
      }
      toast.success(`${quantity} ${product.name} added to cart`)
      setIsLoading(false)
      setQuantity(1) // Reset quantity after adding to cart
    }, 600)
  }
  
  const handleToggleWishlist = () => {
    toggleWishlist(product.id)
  }
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1))
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 md:py-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center flex-wrap gap-1 xs:gap-2 text-xs sm:text-sm text-muted-foreground mb-3 md:mb-4 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-primary hover:underline">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary hover:underline">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="capitalize hover:text-primary hover:underline">{product.category}</Link>
        <span>/</span>
        <span className="truncate max-w-[100px] xs:max-w-[200px]">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:gap-10">
        {/* Product Images - Left Column */}
        <div className="lg:sticky lg:top-20 h-fit">
          <ProductImageSlider 
            images={product.images} 
            productName={product.name}
            autoRotate={false}
            interval={5000}
            showMagnifier={true}
            showThumbnails={true}
            smallButtons={true}
          />
        </div>
        
        {/* Product Details - Right Column */}
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{product.name}</h1>
            
            {/* Product Rating */}
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : i === Math.floor(product.rating) && product.rating % 1 >= 0.5
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                  }`} 
                />
              ))}
              <span className="ml-2 text-xs sm:text-sm font-medium">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>
          
          {/* Price and Stock Info */}
          <div className="py-3 sm:py-4 border-t border-b">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
              <Badge variant="outline" className="text-xs sm:text-sm font-normal px-2 py-1">
                <Leaf className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-green-500" />
                {isLoadingCarbon 
                  ? "Calculating..." 
                  : `${carbonData?.footprint || product.carbonFootprint} kg CO₂`}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {product.inStock ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                  <span className="text-xs sm:text-sm">In Stock</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <span className="text-xs sm:text-sm">Out of Stock</span>
                </div>
              )}
              
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                <span>Delivery in {product.deliveryTime}</span>
              </div>
              
              <div className="flex items-center text-xs sm:text-sm text-green-600">
                <Leaf className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                <span>
                  {isLoadingCarbon
                    ? "Calculating savings..."
                    : `Saves ${carbonData?.savings?.percentage || "67"}% emissions vs. conventional products`}
                </span>
              </div>
            </div>
          </div>
          
          {/* Product Description */}
          <div>
            <h2 className="text-base sm:text-lg font-medium mb-2">About this item</h2>
            <p className="text-sm text-muted-foreground">{product.description}</p>
            
            {/* Key Features */}
            <ul className="mt-3 sm:mt-4 space-y-1">
              {product.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{feature}</span>
                </li>
              ))}
              {product.features.length > 4 && (
                <li className="text-xs sm:text-sm text-muted-foreground pl-6">
                  +{product.features.length - 4} more features
                </li>
              )}
            </ul>
          </div>
          
          {/* Quantity Selector and Actions */}
          <div className="pt-3 sm:pt-4">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-medium">Quantity:</span>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-r-none"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  -
                </Button>
                <div className="flex h-7 w-10 sm:h-8 sm:w-12 items-center justify-center border-y border-input bg-transparent px-3 py-1 text-xs sm:text-sm" style={{ position: 'relative', zIndex: 1 }}>
                  {quantity}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-l-none"
                  onClick={incrementQuantity}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-4">
              <Button
                size="lg"
                className="flex-1 text-xs sm:text-sm py-3 h-auto"
                onClick={handleAddToCart}
                disabled={isLoading || !product.inStock}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    {isInCart ? "Add More to Cart" : "Add to Cart"}
                  </span>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={`h-10 w-10 sm:h-11 sm:w-11 ${productInWishlist ? "text-red-500 hover:text-red-600" : ""}`}
                onClick={handleToggleWishlist}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${productInWishlist ? "fill-red-500" : ""}`} />
              </Button>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-xs sm:text-sm font-medium">1 Year Warranty</h3>
                <p className="text-xs text-muted-foreground">Guaranteed quality</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-xs sm:text-sm font-medium">Free Shipping</h3>
                <p className="text-xs text-muted-foreground">On orders over ₹1,000</p>
              </div>
            </div>
          </div>
          
          {/* Detailed Tabs */}
          <div className="mt-4 sm:mt-6">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="details" className="text-xs sm:text-sm py-1.5 sm:py-2">Product Details</TabsTrigger>
                <TabsTrigger value="sustainability" className="text-xs sm:text-sm py-1.5 sm:py-2">Sustainability</TabsTrigger>
                <TabsTrigger value="shipping" className="text-xs sm:text-sm py-1.5 sm:py-2">Shipping & Returns</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-3 sm:mt-4">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4 text-sm">
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Product Details</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{product.details}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Care Instructions</h3>
                        <ul className="list-disc pl-4 text-xs sm:text-sm space-y-1">
                          <li>Handwash or machine wash on gentle cycle</li>
                          <li>Use eco-friendly detergent for best results</li>
                          <li>Hang dry to reduce carbon emissions</li>
                          <li>Avoid using bleach or harsh chemicals</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sustainability" className="mt-3 sm:mt-4">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                          <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mb-2" />
                          <h3 className="font-medium text-center text-sm sm:text-base">Water Savings</h3>
                          <p className="text-center text-xs text-muted-foreground mt-1">83% less water used in production</p>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                          <Factory className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 mb-2" />
                          <h3 className="font-medium text-center text-sm sm:text-base">Ethical Factory</h3>
                          <p className="text-center text-xs text-muted-foreground mt-1">Made in certified ethical facilities</p>
                      </div>
                        
                        <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                          <Wind className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mb-2" />
                          <h3 className="font-medium text-center text-sm sm:text-base">Carbon Offset</h3>
                          <p className="text-center text-xs text-muted-foreground mt-1">Production offset with renewable energy</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Carbon Footprint</h3>
                        <p className="mb-3">This product has a carbon footprint of <span className="font-medium">{isLoadingCarbon ? "calculating..." : `${carbonData?.footprint} kg CO₂`}</span>, which is {isLoadingCarbon ? "lower" : `${carbonData?.savings?.percentage}% lower`} than conventional alternatives.</p>
                        
                        <div className="relative pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="text-xs font-medium inline-block text-green-600">
                                GreenBasket Product
                              </span>
                            </div>
                        <div>
                              <span className="text-xs font-medium inline-block text-gray-600">
                                Conventional Product
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div style={{ width: `${isLoadingCarbon ? 33 : 100 - parseInt(carbonData?.savings?.percentage) || 33}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                            <div>{isLoadingCarbon ? "Calculating..." : `${carbonData?.footprint} kg CO₂`}</div>
                            <div>{isLoadingCarbon ? "Calculating..." : `${carbonData?.conventionalFootprint} kg CO₂`}</div>
                          </div>
                        </div>
                      </div>
                      
                        <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Sustainability Certifications</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <Badge variant="outline" className="py-1 px-2">Global Organic Textile Standard</Badge>
                          <Badge variant="outline" className="py-1 px-2">Fair Trade Certified</Badge>
                          <Badge variant="outline" className="py-1 px-2">Carbon Trust Standard</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-3 sm:mt-4">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Shipping Information</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Free Standard Shipping</span>
                              <p className="text-xs text-muted-foreground mt-0.5">On all orders over ₹1,000 (4-7 business days)</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Express Shipping</span>
                              <p className="text-xs text-muted-foreground mt-0.5">₹250 (2-3 business days)</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Low Carbon Delivery</span>
                              <p className="text-xs text-muted-foreground mt-0.5">We use electric vehicles and carbon-neutral shipping partners where possible</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Returns Policy</h3>
                        <p className="mb-2">We accept returns within 30 days of delivery. Items must be unused and in original packaging.</p>
                        <p className="text-xs text-muted-foreground">Please note that shipping costs for returns are the customer's responsibility unless the item is defective or incorrect.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
} 