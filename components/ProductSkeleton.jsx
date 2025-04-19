import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ProductSkeleton({ displayMode = "grid" }) {
  return (
    <Card className={`overflow-hidden ${
      displayMode === 'list' ? 'flex flex-col sm:flex-row' : ''
    }`}>
      <div className={`relative ${
        displayMode === 'list' 
          ? 'h-56 sm:h-auto sm:w-1/3 sm:min-h-[180px]' 
          : 'aspect-square'
      } bg-gray-100 w-full overflow-hidden`}>
        <Skeleton className="h-full w-full" />
      </div>
      
      <CardContent className={`p-4 flex flex-col ${
        displayMode === 'list' ? 'sm:flex-1' : ''
      }`}>
        <Skeleton className="h-6 w-3/4 mb-2" />
        
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-4" />
        
        <div className="mt-auto">
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductSkeletonGrid({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} displayMode="grid" />
      ))}
    </>
  )
}

export function ProductSkeletonList({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} displayMode="list" />
      ))}
    </>
  )
} 