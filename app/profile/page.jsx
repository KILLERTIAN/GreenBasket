"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Chart } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { 
  BadgeCheck, 
  Leaf, 
  BarChart3, 
  CalendarDays, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  Droplets, 
  Recycle, 
  Zap, 
  Star, 
  Globe, 
  CircleUser
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Mock data - Replace with actual API calls
const userData = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/avatars/john.jpg",
  carbonFootprint: 45.2,
  rank: 3,
  totalOrders: 12,
  totalSaved: 120.5,
  level: 4,
  nextLevelProgress: 78,
  memberSince: "Jan 2023"
}

const sustainabilityData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Your Carbon Footprint",
      data: [12, 19, 15, 25, 22, 30],
      borderColor: "rgba(16, 185, 129, 1)",
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      tension: 0.4,
      fill: true
    },
    {
      label: "Average User",
      data: [15, 22, 18, 28, 25, 35],
      borderColor: "rgba(99, 102, 241, 1)",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      tension: 0.4,
      fill: true
    }
  ]
}

const categorySpendingData = {
  labels: ["Clothing", "Furniture", "Home", "Accessories", "Personal Care", "Stationery"],
  datasets: [
    {
      label: "Amount Spent (₹)",
      data: [4500, 7800, 3200, 2100, 1800, 900],
      backgroundColor: [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(153, 102, 255, 0.7)",
        "rgba(255, 159, 64, 0.7)",
      ],
      borderWidth: 1
    }
  ]
}

const monthlySavingsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Carbon Savings (kg CO₂)",
      data: [5, 12, 8, 17, 22, 28],
      backgroundColor: "rgba(16, 185, 129, 0.7)",
      borderColor: "rgba(16, 185, 129, 1)",
      borderWidth: 1
    }
  ]
}

const recentOrders = [
  {
    id: "ORD-2023-0001",
    date: "2024-03-15",
    total: 8999,
    items: 3,
    carbonFootprint: 2.5,
    status: "Delivered"
  },
  {
    id: "ORD-2023-0002",
    date: "2024-03-10",
    total: 4999,
    items: 1,
    carbonFootprint: 1.2,
    status: "Delivered"
  },
  {
    id: "ORD-2023-0003",
    date: "2024-02-22",
    total: 6499,
    items: 2,
    carbonFootprint: 1.8,
    status: "Delivered"
  }
]

const achievements = [
  {
    id: 1,
    title: "Eco Warrior",
    description: "Saved 100kg of CO₂",
    icon: Leaf,
    progress: 100,
    completed: true,
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Recycling Hero",
    description: "10 recycled purchases",
    icon: Recycle,
    progress: 100,
    completed: true,
    date: "2024-02-10"
  },
  {
    id: 3,
    title: "Green Champion",
    description: "Top 5% of users",
    icon: Star,
    progress: 100,
    completed: true,
    date: "2024-03-05"
  },
  {
    id: 4,
    title: "Global Impact",
    description: "Save 200kg of CO₂",
    icon: Globe,
    progress: 60,
    completed: false
  }
]

// Format price in Indian Rupees
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price)
}

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8 pb-10">
      {/* Header with profile summary */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="text-xl">{userData.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{userData.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  Member since {userData.memberSince}
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4" />
                  {userData.totalOrders} orders
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary">
              <CircleUser className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Link href="/orders">
              <Button variant="outline">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group hover:shadow-md transition-all">
          <CardHeader className="pb-2 pt-5">
            <CardDescription>Current Level</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              Level {userData.level}
              <BadgeCheck className="ml-2 h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Next Level</span>
                <span className="font-medium">{userData.nextLevelProgress}%</span>
              </div>
              <Progress value={userData.nextLevelProgress} />
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all">
          <CardHeader className="pb-2 pt-5">
            <CardDescription>Carbon Footprint</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {userData.carbonFootprint} kg CO₂
              <Leaf className="ml-2 h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>15% better than average</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all">
          <CardHeader className="pb-2 pt-5">
            <CardDescription>Community Rank</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              #{userData.rank}
              <Star className="ml-2 h-5 w-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="flex items-center text-sm text-muted-foreground">
              <BadgeCheck className="h-4 w-4 mr-1 text-blue-500" />
              <span>Top 5% of eco-shoppers</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all">
          <CardHeader className="pb-2 pt-5">
            <CardDescription>Total Carbon Saved</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {userData.totalSaved} kg CO₂
              <Globe className="ml-2 h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="flex items-center text-sm text-muted-foreground">
              <Leaf className="h-4 w-4 mr-1 text-green-500" />
              <span>Equivalent to planting 8 trees</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pt-5">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Sustainability Progress
            </CardTitle>
            <CardDescription>Your carbon footprint compared to average users</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-2 pb-5">
            <Chart
              type="area"
              data={sustainabilityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top"
                  },
                  tooltip: {
                    intersect: false,
                    mode: "index"
                  }
                }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pt-5">
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
              Category Spending
            </CardTitle>
            <CardDescription>Your spending across different categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-2 pb-5">
            <Chart
              type="bar"
              data={categorySpendingData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Recent Orders</span>
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            <span>Environmental Impact</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            <span>Achievements</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader className="pb-2 pt-5">
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                Recent Orders
              </CardTitle>
              <CardDescription>Your purchase history from the last few months</CardDescription>
            </CardHeader>
            <CardContent className="py-5">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium flex items-center">
                        {order.id}
                        <Badge variant="outline" className="ml-2">{order.status}</Badge>
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-1" />
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                        {order.items} {order.items > 1 ? 'items' : 'item'}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <p className="font-medium text-primary">{formatPrice(order.total)}</p>
                      <Badge className="mt-1 flex items-center bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200">
                        <Leaf className="h-3.5 w-3.5 mr-1" />
                        Saved {order.carbonFootprint} kg CO₂
                      </Badge>
                      <Button variant="ghost" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-center py-3">
              <Link href="/orders">
                <Button variant="link">View All Orders</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="impact">
          <div className="grid gap-6 md:grid-cols-5">
            <Card className="md:col-span-3">
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Monthly Carbon Savings
                </CardTitle>
                <CardDescription>Your environmental impact over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] py-5">
                <Chart
                  type="bar"
                  data={monthlySavingsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-primary" />
                  Environmental Impact
                </CardTitle>
                <CardDescription>Your positive impact on the planet</CardDescription>
              </CardHeader>
              <CardContent className="py-5 space-y-6">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Trees Equivalent</h3>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Water Saved</h3>
                      <p className="text-2xl font-bold">1,200L</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      <Recycle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Waste Diverted</h3>
                      <p className="text-2xl font-bold">45kg</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Energy Saved</h3>
                      <p className="text-2xl font-bold">85kWh</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader className="pb-2 pt-5">
              <CardTitle className="flex items-center">
                <BadgeCheck className="h-5 w-5 mr-2 text-primary" />
                Your Achievements
              </CardTitle>
              <CardDescription>Badges and accomplishments earned through sustainable shopping</CardDescription>
            </CardHeader>
            <CardContent className="py-5">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {achievements.map((achievement) => {
                  const AchievementIcon = achievement.icon;
                  return (
                    <div 
                      key={achievement.id} 
                      className={`rounded-lg border p-5 text-center hover:shadow-md transition-all ${
                        achievement.completed ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30" : ""
                      }`}
                    >
                      <div className={`mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full ${
                        achievement.completed 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <AchievementIcon className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-medium">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                      {!achievement.completed && (
                        <div className="mt-3 space-y-2">
                          <Progress value={achievement.progress} />
                          <p className="text-xs text-muted-foreground">
                            {achievement.progress}% Complete
                          </p>
                        </div>
                      )}
                      {achievement.completed && achievement.date && (
                        <Badge className="mt-3" variant="outline">
                          Earned on {new Date(achievement.date).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 