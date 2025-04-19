"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/lib/cart-context"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ProductImageSlider } from "@/components/product-image-slider"
import { Leaf, ShoppingBag, Search, ShoppingCart, CreditCard, CloudOff, Recycle, Trash2, LineChart, Award, Globe, BarChart2 } from "lucide-react"
import productsData from "@/lib/products.json"
import { HomeFeaturedProductsSkeletonGrid } from "@/components/HomePageSkeleton"

// Creating new products for our categories that don't exist in the data
const additionalProducts = [
  {
    id: 101,
    name: "Eco-Friendly Correction Pen",
    price: 399,
    carbonFootprint: 0.2,
    images: [
      "/images/products/Stationery/White Strip Error/714+-YEhZYL._SX522_.jpg",
      "/images/products/Stationery/White Strip Error/71AIg4DrzJL._SX522_.jpg",
      "/images/products/Stationery/White Strip Error/7121MutBSCL._SX522_.jpg"
    ],
    category: "stationery",
    description: "Eco-friendly correction pen made with recyclable materials and non-toxic formula",
    rating: 4.6,
    reviewCount: 45,
    inStock: true
  },
  {
    id: 102,
    name: "Organic Body Lotion",
    price: 799,
    carbonFootprint: 0.3,
    images: [
      "/images/products/Personal Care/Body Lotion/612ctEDavpL._SX522_.jpg",
      "/images/products/Personal Care/Body Lotion/71LL5gkaPEL._SX522_.jpg",
      "/images/products/Personal Care/Body Lotion/713CMzfgStL._SL1500_.jpg"
    ],
    category: "personal-care",
    description: "Natural and organic body lotion with plant-based ingredients for sustainable skincare",
    rating: 4.8,
    reviewCount: 67,
    inStock: true
  },
  {
    id: 103,
    name: "Sustainable Solar Power Bank",
    price: 2499,
    carbonFootprint: 0.4,
    images: [
      "/images/products/Accessories/Cable/81eG1PLn6TL._SX522_.jpg",
      "/images/products/Accessories/Cable/717yotBLXaL._SX522_.jpg",
      "/images/products/Accessories/Cable/61DKsll9yDL._SX522_.jpg"
    ],
    category: "accessories",
    description: "High-capacity solar power bank with rapid charging technology, made from 90% recycled materials.",
    rating: 4.7,
    reviewCount: 32,
    inStock: true
  }
];

// Select 6 featured products - one from each category
const featuredProducts = [
  // Clothing - Women's dress with specific image
  {
    id: 7,
    name: "Women's Eco-Friendly Dress",
    price: 5999,
    carbonFootprint: 0.9,
    images: [
      "/images/products/Clothing/clothing women/dresses/dress4.jpg",
      "/images/products/Clothing/clothing women/dresses/dress2.jpg",
      "/images/products/Clothing/clothing women/dresses/dress3.jpg"
    ],
    category: "clothing",
    description: "Elegant sustainable dress made from organic cotton and eco-friendly materials",
    rating: 4.9
  },
  // Furniture
  productsData.find(p => p.id === 9), // Sustainable Dining Set
  // Home goods
  productsData.find(p => p.id === 3), // Recycled Glass Vase
  // Personal Care - Body Lotion with specific image
  additionalProducts[1], // Organic Body Lotion
  // Accessories - Sustainable Solar Power Bank with specific image 
  additionalProducts[2], // Sustainable Solar Power Bank
  // Stationery - Correction Pen with specific image
  additionalProducts[0] // Eco-Friendly Correction Pen
];

const productCategories = [
  {
    name: "Clothing",
    description: "Sustainable apparel made from eco-friendly materials",
    image: "/images/products/Clothing/clothing women/dresses/dress4.jpg",
    href: "/products?category=clothing"
  },
  {
    name: "Accessories",
    description: "Eco-friendly accessories to complement your lifestyle",
    image: "/images/products/Accessories/Cable/81eG1PLn6TL._SX522_.jpg",
    href: "/products?category=accessories"
  },
  {
    name: "Home",
    description: "Sustainable products for your eco-friendly home",
    image: "/images/products/Home goods/glass vase/vase1.jpg",
    href: "/products?category=home"
  },
  {
    name: "Furniture",
    description: "Sustainably sourced furniture for eco-conscious living",
    image: "/images/products/Furniture/dinning set/71Co3nhoAML._SX679_.jpg",
    href: "/products?category=furniture"
  },
  {
    name: "Personal-Care",
    description: "Natural and sustainable personal care products",
    image: "/images/products/Personal Care/Body Lotion/612ctEDavpL._SX522_.jpg",
    href: "/products?category=personal-care"
  },
  {
    name: "Stationery",
    description: "Eco-friendly writing supplies and office essentials",
    image: "/images/products/Stationery/Art Markers/61fHdGFZlAL._SX679_.jpg",
    href: "/products?category=stationery"
  }
]

const sustainabilityStats = [
  {
    title: "Carbon Saved",
    value: "1,200 kg",
    description: "Total CO₂ emissions prevented"
  },
  {
    title: "Trees Protected",
    value: "150",
    description: "Trees saved from deforestation"
  },
  {
    title: "Water Conserved",
    value: "12,000L",
    description: "Water saved through sustainable practices"
  },
  {
    title: "Waste Diverted",
    value: "500 kg",
    description: "Waste materials repurposed"
  }
]

export default function HomePage() {
  const { addToCart } = useCart()
  const [loadingProductId, setLoadingProductId] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch featured products from database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true)
      try {
        // Simulate API call with timeout for demo purposes
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // For demo - select 6 featured products from productsData
        // In a real app, this would be a fetch call to your API
        const categories = ['clothing', 'furniture', 'home', 'stationery', 'personal-care', 'accessories']
        const featured = []
        
        // Try to find one product per category
        for (const category of categories) {
          const productForCategory = productsData.find(p => 
            p.category.toLowerCase() === category.toLowerCase() && 
            !featured.some(f => f.id === p.id)
          )
          
          if (productForCategory) {
            featured.push(productForCategory)
          }
        }
        
        // If we don't have 6 products yet, fill with other products
        while (featured.length < 6 && featured.length < productsData.length) {
          const randomProduct = productsData[Math.floor(Math.random() * productsData.length)]
          if (!featured.some(p => p.id === randomProduct.id)) {
            featured.push(randomProduct)
          }
        }
        
        setFeaturedProducts(featured)
      } catch (error) {
        console.error('Error fetching featured products:', error)
        // Fallback to hardcoded data if fetch fails
        const fallbackProducts = productsData.slice(0, 6)
        setFeaturedProducts(fallbackProducts)
      } finally {
        setLoading(false)
      }
    }
    
    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = (product) => {
    setLoadingProductId(product.id)
    
    // Simulate API call with timeout
    setTimeout(() => {
      addToCart({
        ...product,
        image: product.images[0] // Use first image for cart thumbnail
      })
      toast.success(`${product.name} added to cart`)
      setLoadingProductId(null)
    }, 600)
  }

  // Function to format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-600/70" />
        <div className="absolute inset-0 flex items-end">
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-4 pb-0">
            <div className="flex flex-col justify-center mb-8 md:mb-0 z-10 p-10 md:p-20">
              <h1 className="text-3xl sm:text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Shop Sustainably
            </h1>
              <p className="mt-4 max-w-md text-base sm:text-lg text-white/90">
              Discover eco-friendly products that help reduce your carbon footprint.
              Every purchase makes a difference.
            </p>
              <Button size="lg" className="mt-6 md:mt-8 w-fit" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            </div>
            <div className="flex items-end justify-center md:justify-end h-full relative">
              <div className="relative h-[85%] md:h-[95%] w-full max-w-[600px]">
                <Image
                  src="/hero.png"
                  alt="Sustainable shopping"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 80vw, (max-width: 768px) 70vw, (max-width: 1200px) 50vw, 600px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <Link href="/products">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {productCategories.map((category) => (
            <Link 
              href={category.href}
              key={category.name}
              className="group flex flex-col items-center p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="relative mb-3 h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 overflow-hidden rounded-full border-2 border-primary/10 transition-all group-hover:border-primary">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors" />
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-base sm:text-lg font-medium group-hover:text-primary transition-colors text-center">{category.name}</h3>
              <p className="mt-1 text-xs text-center text-muted-foreground line-clamp-2">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sustainability Stats */}
      <section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {sustainabilityStats.map((stat) => (
            <Card key={stat.title} className="py-4">
              <CardHeader>
                <CardTitle className="text-lg">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        
        {/* Using the same card format as products page - exactly 6 products */}
        {loading ? (
          <HomeFeaturedProductsSkeletonGrid />
        ) : (
          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden transition-all duration-200 hover:shadow-lg"
              >
                <Link href={`/products/${product.id}`} className="contents">
                  <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    <Image
                      src={product.images[0] || "/placeholder.png"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    
                    <Badge variant="secondary" className="absolute top-2 right-2 font-normal">
                      <Leaf className="h-3.5 w-3.5 mr-1 text-green-500" />
                      {product.carbonFootprint} kg CO₂
                      </Badge>
                    </div>
                </Link>
                
                <CardContent className="p-4 flex flex-col">
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
                  
                  <div className="mt-auto flex flex-col gap-2">
                    <Badge className="w-fit self-start capitalize">{product.category}</Badge>
                <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                  className="w-full"
                  disabled={loadingProductId === product.id}
                >
                  {loadingProductId === product.id ? "Adding..." : "Add to Cart"}
                </Button>
                  </div>
                </CardContent>
            </Card>
          ))}
        </div>
        )}
      </section>

      {/* How It Works */}
      <section className="py-8 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">How Green Basket Works</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Making sustainable shopping simple, transparent and impactful through our easy three-step process.
            </p>
          </div>
          
        <Tabs defaultValue="shop" className="mt-8">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 w-full max-w-lg">
                <TabsTrigger value="shop" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shop</span>
                </TabsTrigger>
                <TabsTrigger value="impact" className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  <span>Impact</span>
                </TabsTrigger>
                <TabsTrigger value="track" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Track</span>
                </TabsTrigger>
          </TabsList>
            </div>
            
          <TabsContent value="shop">
              <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                <Card className="border-green-200 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="mb-5 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Search className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">1. Browse Products</h3>
                    <p className="text-muted-foreground">
                      Explore our curated collection of sustainable products. Each item displays its carbon footprint and environmental impact, making it easy to make informed choices.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="mb-5 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <ShoppingCart className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                    <h3 className="text-xl font-semibold mb-3">2. Add to Cart</h3>
                    <p className="text-muted-foreground">
                      Select your items and see real-time calculation of your environmental impact. Our transparent approach shows the emissions you're saving compared to conventional products.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="mb-5 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <CreditCard className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                    <h3 className="text-xl font-semibold mb-3">3. Checkout</h3>
                    <p className="text-muted-foreground">
                      Complete your purchase with our secure payment process. Receive a detailed sustainability report with your order confirmation, showcasing your positive environmental impact.
                    </p>
              </CardContent>
            </Card>
              </div>
          </TabsContent>
            
          <TabsContent value="impact">
              <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                <Card className="border-green-200 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="mb-5 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <CloudOff className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Carbon Reduction</h3>
                    <p className="text-muted-foreground">
                      Our products average 67% lower carbon footprint than conventional alternatives. Through sustainable materials and eco-friendly production methods, we minimize environmental harm.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="mb-5 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Recycle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                    <h3 className="text-xl font-semibold mb-3">Resource Conservation</h3>
                    <p className="text-muted-foreground">
                      We prioritize recycled, upcycled, and responsibly sourced materials. Our partnerships with ethical suppliers ensure sustainable resource management throughout our supply chain.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="mb-5 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Trash2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                    <h3 className="text-xl font-semibold mb-3">Waste Reduction</h3>
                    <p className="text-muted-foreground">
                      Our circular approach diverts waste from landfills through innovative recycling and biodegradable packaging. We strive for zero-waste operations across our business.
                    </p>
              </CardContent>
            </Card>
              </div>
          </TabsContent>
            
          <TabsContent value="track">
              <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                <Card className="border-green-200 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="mb-5 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <LineChart className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Personal Dashboard</h3>
                    <p className="text-muted-foreground">
                      Monitor your environmental impact through a personalized dashboard. View detailed metrics on carbon saved, resources conserved, and your contribution to sustainability goals.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="mb-5 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                    <h3 className="text-xl font-semibold mb-3">Achievements & Rewards</h3>
                    <p className="text-muted-foreground">
                      Earn badges, points, and exclusive rewards for your sustainable shopping habits. Unlock special offers and discounts as you reach new sustainability milestones.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="mb-5 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                    <h3 className="text-xl font-semibold mb-3">Community Impact</h3>
                    <p className="text-muted-foreground">
                      Join our community of eco-conscious shoppers making a collective difference. Compare your impact with others and participate in community challenges and initiatives.
                    </p>
              </CardContent>
            </Card>
              </div>
          </TabsContent>
        </Tabs>
          
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/products">Start Shopping Sustainably</Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">Join thousands of eco-conscious shoppers making a difference with every purchase</p>
          </div>
        </div>
      </section>
    </div>
  )
} 