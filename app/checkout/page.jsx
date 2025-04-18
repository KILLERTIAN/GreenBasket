"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

// Mock data - Replace with actual cart state
const cartItems = [
  {
    id: 1,
    name: "Recycled Denim Jacket",
    price: 49.99,
    quantity: 1,
    carbonFootprint: 2.5
  },
  {
    id: 2,
    name: "Upcycled Wooden Chair",
    price: 89.99,
    quantity: 1,
    carbonFootprint: 1.2
  }
]

export default function CheckoutPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zip: ""
  })

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalCarbonFootprint = cartItems.reduce((sum, item) => sum + item.carbonFootprint * item.quantity, 0)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePayment = async () => {
    // Initialize Razorpay
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: total * 100, // Convert to paise
      currency: "INR",
      name: "GreenBasket",
      description: "Sustainable Shopping",
      order_id: "order_123", // Replace with actual order ID from your backend
      handler: function (response) {
        // Handle successful payment
        console.log(response)
        // Redirect to success page
      },
      prefill: {
        name: formData.name,
        email: formData.email
      },
      theme: {
        color: "#4CAF50"
      }
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name">Full Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="address">Address</label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="city">City</label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="state">State</label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="zip">ZIP Code</label>
                <Input
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="font-medium">Environmental Impact</h3>
              <div className="mt-2 flex items-center justify-between">
                <span>Total Carbon Footprint</span>
                <Badge variant="secondary">
                  {totalCarbonFootprint.toFixed(1)} kg CO₂
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                By choosing sustainable products, you've saved approximately {totalCarbonFootprint * 2} kg of CO₂ emissions compared to conventional products.
              </p>
            </div>
            <Button className="w-full" onClick={handlePayment}>
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 