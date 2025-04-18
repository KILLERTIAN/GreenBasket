"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "@/components/product-form"

export function ProductModal({ open, onOpenChange, product, onSubmit }) {
  const [isOpen, setIsOpen] = useState(open)

  const handleOpenChange = (value) => {
    setIsOpen(value)
    onOpenChange?.(value)
  }

  const handleSubmit = async (data) => {
    await onSubmit(data)
    handleOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 