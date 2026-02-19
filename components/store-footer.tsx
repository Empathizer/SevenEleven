import Link from "next/link"
import { Package } from "lucide-react"

export function StoreFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">EsellerStore</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Your trusted multi-vendor marketplace. Shop millions of products from thousands of sellers worldwide.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Customer Service</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/orders" className="hover:text-primary">Track Order</Link></li>
              <li><Link href="/returns" className="hover:text-primary">Returns & Refunds</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Shop</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/products?category=fashion" className="hover:text-primary">Fashion</Link></li>
              <li><Link href="/products?category=beauty" className="hover:text-primary">Beauty</Link></li>
              <li><Link href="/products?category=shoes" className="hover:text-primary">Shoes</Link></li>
              <li><Link href="/products?category=jewelry" className="hover:text-primary">Jewelry</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Sell on EsellerStore</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/seller/register" className="hover:text-primary">Start Selling</Link></li>
              <li><Link href="/seller" className="hover:text-primary">Seller Center</Link></li>
              <li><Link href="/policies" className="hover:text-primary">Seller Policies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          2026 Developed by 智云科技 (Smart Cloud Technology). All rights reserved.
        </div>
      </div>
    </footer>
  )
}
