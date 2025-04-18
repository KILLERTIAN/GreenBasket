"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import productsData from "@/lib/products.json"

export default function TestImagesPage() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Image Test Page</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {productsData.map(product => (
          <Button
            key={product.id}
            variant={selectedProduct?.id === product.id ? "default" : "outline"}
            onClick={() => setSelectedProduct(product)}
            className="justify-start overflow-hidden"
          >
            <span className="truncate">{product.name}</span>
          </Button>
        ))}
      </div>
      
      {selectedProduct && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedProduct.images.map((src, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-2">
                  <div className="relative aspect-square w-full">
                    <Image 
                      src={src}
                      alt={`${selectedProduct.name} image ${index + 1}`}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        e.target.src = "/placeholder.png"
                        e.target.classList.add("error")
                        e.target.closest('.card-content').classList.add("bg-red-50")
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-mono break-all">{src}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 