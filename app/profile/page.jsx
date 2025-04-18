"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Chart } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"

// Mock data - Replace with actual API calls
const userData = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/avatars/john.jpg",
  carbonFootprint: 45.2,
  rank: 3,
  totalOrders: 12,
  totalSaved: 120.5
}

const sustainabilityData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Your Carbon Footprint",
      data: [12, 19, 15, 25, 22, 30],
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1
    },
    {
      label: "Average User",
      data: [15, 22, 18, 28, 25, 35],
      borderColor: "rgb(255, 99, 132)",
      tension: 0.1
    }
  ]
}

const recentOrders = [
  {
    id: 1,
    date: "2024-03-15",
    total: 89.99,
    carbonFootprint: 2.5,
    status: "Delivered"
  },
  {
    id: 2,
    date: "2024-03-10",
    total: 49.99,
    carbonFootprint: 1.2,
    status: "Delivered"
  }
]

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <Button>Edit Profile</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-muted-foreground">{userData.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Carbon Footprint</span>
              <Badge variant="secondary">
                {userData.carbonFootprint} kg CO₂
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Global Rank</span>
              <Badge variant="outline">#{userData.rank}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Orders</span>
              <span>{userData.totalOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Carbon Saved</span>
              <Badge variant="secondary">
                {userData.totalSaved} kg CO₂
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sustainability Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="line"
              data={sustainabilityData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top"
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="impact">Environmental Impact</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <Badge variant="secondary">
                        {order.carbonFootprint} kg CO₂
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="impact">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Trees Saved</h3>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Water Saved</h3>
                  <p className="text-2xl font-bold">1,200L</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Waste Diverted</h3>
                  <p className="text-2xl font-bold">45kg</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Energy Saved</h3>
                  <p className="text-2xl font-bold">85kWh</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4 text-center">
                  <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-green-100" />
                  <h3 className="font-medium">Eco Warrior</h3>
                  <p className="text-sm text-muted-foreground">
                    Saved 100kg of CO₂
                  </p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-blue-100" />
                  <h3 className="font-medium">Recycling Hero</h3>
                  <p className="text-sm text-muted-foreground">
                    10 recycled purchases
                  </p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-yellow-100" />
                  <h3 className="font-medium">Green Champion</h3>
                  <p className="text-sm text-muted-foreground">
                    Top 5% of users
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 