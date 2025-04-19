"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart } from "@/components/ui/chart"
import { 
  Plus, 
  Edit, 
  Trash2, 
  ShoppingBag, 
  Users, 
  Leaf, 
  TrendingUp, 
  BarChart4, 
  Package, 
  RefreshCw,
  Download,
  Search,
  FileText 
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import ProductModal from "@/components/product-modal"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock data - Replace with actual API calls
const products = [
  {
    id: 1,
    name: "Recycled Denim Jacket",
    price: 49.99,
    carbonFootprint: 2.5,
    stock: 100,
    category: "clothing",
    status: "active"
  },
  {
    id: 2,
    name: "Upcycled Wooden Chair",
    price: 89.99,
    carbonFootprint: 1.2,
    stock: 50,
    category: "furniture",
    status: "active"
  },
  {
    id: 3,
    name: "Eco-Friendly Water Bottle",
    price: 24.99,
    carbonFootprint: 0.8,
    stock: 200,
    category: "accessories",
    status: "active"
  },
  {
    id: 4,
    name: "Bamboo Toothbrush",
    price: 5.99,
    carbonFootprint: 0.3,
    stock: 500,
    category: "personal-care",
    status: "active"
  },
  {
    id: 5,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    carbonFootprint: 1.5,
    stock: 150,
    category: "clothing",
    status: "active"
  }
]

// Mock order data
const orders = [
  {
    id: "ORD-2023-0001",
    customer: "John Doe",
    date: "2023-11-15",
    total: 10997,
    status: "delivered",
    items: 2
  },
  {
    id: "ORD-2023-0002",
    customer: "Jane Smith",
    date: "2023-12-01",
    total: 12999,
    status: "shipped",
    items: 1
  },
  {
    id: "ORD-2023-0003",
    customer: "Amit Patel",
    date: "2023-12-10",
    total: 5997,
    status: "processing",
    items: 3
  },
  {
    id: "ORD-2023-0004",
    customer: "Sarah Johnson",
    date: "2023-12-15",
    total: 8999,
    status: "processing",
    items: 2
  },
  {
    id: "ORD-2023-0005",
    customer: "Michael Brown",
    date: "2023-12-18",
    total: 3999,
    status: "pending",
    items: 1
  }
]

// Mock user data
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    carbonSaved: 12,
    joinDate: "2023-10-05",
    orders: 3
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    carbonSaved: 8,
    joinDate: "2023-11-12",
    orders: 2
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@gmail.com",
    role: "admin",
    carbonSaved: 25,
    joinDate: "2023-09-01",
    orders: 5
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "user",
    carbonSaved: 5,
    joinDate: "2023-12-08",
    orders: 1
  }
]

const sustainabilityData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Carbon Footprint Reduction (kg)",
      data: [12, 19, 15, 25, 22, 30],
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.3,
      fill: true
    }
  ]
}

const salesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Monthly Sales (₹)",
      data: [25000, 32000, 28000, 42000, 38000, 52000],
      borderColor: "rgb(54, 162, 235)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.3,
      fill: true
    }
  ]
}

function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [productStatusFilter, setProductStatusFilter] = useState("all")
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (productId) => {
    try {
      // TODO: Implement delete product API call
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
      console.error(error)
    }
  }

  const handleSubmitProduct = async (data) => {
    try {
      // TODO: Implement create/update product API call
      console.log("Product data:", data)
      toast.success(
        selectedProduct
          ? "Product updated successfully"
          : "Product created successfully"
      )
      setIsModalOpen(false)
    } catch (error) {
      toast.error("Failed to save product")
      console.error(error)
    }
  }

  // Filter products based on search term and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (productStatusFilter === "all") {
      return matchesSearch;
    }
    
    return matchesSearch && product.status === productStatusFilter;
  });

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    if (orderStatusFilter === "all") {
      return true;
    }
    
    return order.status === orderStatusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Delivered</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-6 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 w-full py-4" />
          ))}
        </div>

        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full py-4" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold py-4">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your products, orders, and customers</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-6 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white shadow-md py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {products.filter(p => p.stock < 20).length} items low in stock
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Carbon Saved</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120 kg CO₂</div>
            <p className="text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              15% increase from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {orders.filter(o => o.status === 'processing').length} orders being processed
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {users.filter(u => new Date(u.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} new users this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="bg-white shadow-sm rounded-lg mb-6">
          <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Products</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Orders</TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Users</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card className="bg-white shadow-md py-4">
            <CardHeader>
              <CardTitle className="py-4">Product Management</CardTitle>
              <CardDescription>Manage your product inventory and details</CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={productStatusFilter}
                  onValueChange={setProductStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Carbon Footprint</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="capitalize">{product.category}</TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>
                            <span className={product.stock < 20 ? "text-red-500 font-medium" : ""}>
                              {product.stock}
                            </span>
                          </TableCell>
                          <TableCell>{product.carbonFootprint} kg CO₂</TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card className="bg-white shadow-md py-4">
            <CardHeader>
              <CardTitle className="py-4">Order Management</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
              
              <div className="flex justify-between items-center mt-4 flex-col sm:flex-row gap-4">
                <Select
                  value={orderStatusFilter}
                  onValueChange={setOrderStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Download className="h-4 w-4" />
                  Export Orders
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>{formatPrice(order.total / 100)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card className="bg-white shadow-md py-4">
            <CardHeader>
              <CardTitle className="py-4">User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Carbon Saved</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "destructive" : "outline"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.orders}</TableCell>
                        <TableCell>{user.carbonSaved} kg CO₂</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card className="bg-white shadow-md py-4">
              <CardHeader>
                <CardTitle className="py-4">Sustainability Metrics</CardTitle>
                <CardDescription>Carbon footprint reduction over time</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Chart
                  type="line"
                  data={sustainabilityData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top"
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                  className="h-80 min-w-[300px]"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md py-4">
              <CardHeader>
                <CardTitle className="py-4">Sales Overview</CardTitle>
                <CardDescription>Monthly sales data</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Chart
                  type="bar"
                  data={salesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top"
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                  className="h-80 min-w-[300px]"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md md:col-span-2 py-4">
              <CardHeader>
                <CardTitle className="py-4">Product Category Distribution</CardTitle>
                <CardDescription>Breakdown of products by category</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center overflow-x-auto">
                <Chart
                  type="doughnut"
                  data={{
                    labels: ['Clothing', 'Furniture', 'Accessories', 'Personal Care', 'Home Goods'],
                    datasets: [
                      {
                        label: 'Products',
                        data: [
                          products.filter(p => p.category === 'clothing').length,
                          products.filter(p => p.category === 'furniture').length,
                          products.filter(p => p.category === 'accessories').length,
                          products.filter(p => p.category === 'personal-care').length,
                          products.filter(p => p.category === 'home').length,
                        ],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                        ],
                        borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        display: true,
                        labels: {
                          boxWidth: 10,
                          padding: 10,
                        }
                      },
                    },
                  }}
                  className="h-80 min-w-[300px] max-w-md"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedProduct}
          onSubmit={handleSubmitProduct}
        />
      )}
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  )
} 