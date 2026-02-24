"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroBanner() {
  const [banners, setBanners] = useState<any[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetch("/api/admin/banners")
      .then(r => r.json())
      .then(data => setBanners((data.data || []).filter((b: any) => b.isActive)))
  }, [])

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length)
  }, [banners.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length)
  }, [banners.length])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  if (banners.length === 0) return null

  return (
    <section className="relative overflow-hidden rounded-xl bg-foreground/5">
      <div className="relative aspect-[3/1] min-h-[200px] w-full md:aspect-[3.5/1]">
        {banners.map((banner, idx) => (
          <Link
            key={banner._id}
            href={banner.link}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={banner.image || "/placeholder.svg"}
              alt={banner.title}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
              <h2 className="max-w-lg text-balance text-2xl font-bold text-white md:text-4xl">{banner.title}</h2>
              <p className="mt-2 max-w-md text-pretty text-sm text-white/80 md:text-base">{banner.subtitle}</p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                  Shop Now
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Controls */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/80 text-foreground shadow-md hover:bg-card"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/80 text-foreground shadow-md hover:bg-card"
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next</span>
      </Button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all ${idx === current ? "w-6 bg-primary" : "w-2 bg-card/60"}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
