"use client"

import { Leaf } from "lucide-react"
import { SignupForm } from "@/components/signup-form"
import Image from "next/image"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium group">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <Leaf className="size-4" />
            </div>
            <span className="text-lg font-bold">Green<span className="text-primary">Basket</span></span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SignupForm />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary hover:underline">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/signup-banner.jpg"
          alt="Sustainable shopping concept"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 flex flex-col items-center justify-end p-12">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold mb-4">Join Our Eco-Friendly Community</h1>
            <p className="text-muted-foreground text-balance">
              Sign up today and start making sustainable choices that benefit both you and the environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 