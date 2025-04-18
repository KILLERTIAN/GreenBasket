"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function ProductForm({ onSubmit, initialData }) {
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: initialData || {
      name: "",
      price: "",
      description: "",
      category: "",
      carbonFootprint: "",
    }
  });

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      // Parse numeric values
      const parsedData = {
        ...data,
        price: parseFloat(data.price),
        carbonFootprint: parseFloat(data.carbonFootprint),
      };
      
      await onSubmit(parsedData);
      toast.success("Product saved successfully!");
      if (!initialData) reset();
    } catch (error) {
      toast.error("Failed to save product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          {...register("name", { 
            required: "Product name is required",
            maxLength: { 
              value: 100, 
              message: "Name cannot exceed 100 characters" 
            }
          })}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (₹)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { 
            required: "Price is required",
            min: { 
              value: 0, 
              message: "Price must be positive" 
            }
          })}
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description", { 
            required: "Description is required",
            maxLength: { 
              value: 500, 
              message: "Description cannot exceed 500 characters" 
            }
          })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          {...register("category", { 
            required: "Category is required" 
          })}
        />
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="carbonFootprint">Carbon Footprint (kg CO₂)</Label>
        <Input
          id="carbonFootprint"
          type="number"
          step="0.1"
          {...register("carbonFootprint", { 
            required: "Carbon footprint is required",
            min: { 
              value: 0, 
              message: "Carbon footprint must be positive" 
            }
          })}
        />
        {errors.carbonFootprint && (
          <p className="text-sm text-red-500">{errors.carbonFootprint.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
} 