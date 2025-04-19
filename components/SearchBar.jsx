"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

export const SearchBar = ({ onClose, variant = "default" }) => {
  const [query, setQuery] = useState("")
  const router = useRouter()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
      if (onClose) onClose()
    }
  }
  
  const isCompact = variant === "compact"
  
  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for eco-friendly products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${isCompact ? 'h-9' : 'h-10'} pl-9 pr-3 rounded-l-full rounded-r-none border-r-0`}
            autoFocus
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button
          type="submit"
          className={`${isCompact ? 'h-9' : 'h-10'} rounded-l-none rounded-r-full px-4`}
        >
          Search
        </Button>
      </form>
    </div>
  )
} 