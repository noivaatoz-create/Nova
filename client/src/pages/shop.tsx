import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useCartStore } from "@/lib/cart-store";
import { useState } from "react";
import type { Product } from "@shared/schema";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ShopPage() {
  const { data: products, isLoading } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { addItem } = useCartStore();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const categories = ["all", "Best Sellers", "Portable", "Family", "Accessories"];

  const filtered = products?.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[hsl(220,40%,7%)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-4" data-testid="text-shop-title">Shop All Products</h1>
          <p className="text-[hsl(215,30%,65%)] text-lg">Premium water flossers engineered for the modern bathroom.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(215,30%,65%)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] pl-10 pr-4 py-2.5 text-white placeholder-[hsl(215,30%,65%)] focus:outline-none focus:ring-1 focus:ring-[hsl(38,92%,50%)] focus:border-[hsl(38,92%,50%)] text-sm"
              data-testid="input-search"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-[hsl(38,92%,50%)] text-white"
                    : "bg-[hsl(220,38%,10%)] text-[hsl(215,30%,65%)] border border-[hsl(218,35%,17%)] hover:border-[hsl(38,92%,50%)]/50 hover:text-white"
                }`}
                data-testid={`button-filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] overflow-hidden">
                <div className="aspect-[4/5] bg-[hsl(218,35%,17%)] animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-[hsl(218,35%,17%)] rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-[hsl(218,35%,17%)] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-[hsl(215,30%,65%)] text-sm mb-6" data-testid="text-product-count">
              {filtered?.length || 0} product{(filtered?.length || 0) !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered?.map((product) => (
                <div key={product.id} className="flex flex-col overflow-hidden rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] shadow-sm transition-all hover:shadow-md hover:border-[hsl(38,92%,50%)]/30 group" data-testid={`card-product-${product.id}`}>
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-[4/5] w-full bg-gray-800 overflow-hidden cursor-pointer">
                      <img
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                        src={product.image}
                      />
                      {product.badge && (
                        <div className={`absolute top-3 left-3 rounded-md px-2 py-1 text-xs font-bold text-white uppercase tracking-wider ${
                          product.badge === "Flagship" ? "bg-[hsl(38,92%,50%)]" :
                          product.badge === "Best Seller" ? "bg-emerald-500" :
                          product.badge === "Family" ? "bg-violet-500" :
                          "bg-amber-500"
                        }`}>
                          {product.badge}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        {product.compareAtPrice && (
                          <span className="text-[hsl(215,30%,65%)] text-sm line-through">${product.compareAtPrice}</span>
                        )}
                        <span className="text-[hsl(38,92%,50%)] font-bold">${product.price}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[hsl(215,30%,65%)] mb-3 flex-1">{product.shortDescription}</p>
                    <p className="text-xs text-[hsl(215,30%,65%)]/70 mb-4">{product.category}</p>
                    <div className="flex gap-2">
                      <Link href={`/product/${product.slug}`} className="flex-1">
                        <button className="w-full rounded-md bg-white/5 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors border border-white/10" data-testid={`button-view-${product.slug}`}>
                          View Details
                        </button>
                      </Link>
                      <button
                        onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
                        className="rounded-md bg-[hsl(38,92%,50%)] py-2 px-4 text-sm font-semibold text-white hover:bg-[hsl(38,92%,40%)] transition-colors"
                        data-testid={`button-add-cart-${product.slug}`}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
