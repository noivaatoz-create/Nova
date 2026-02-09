import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useCartStore } from "@/lib/cart-store";
import { useState } from "react";
import type { Product, Review } from "@shared/schema";
import { ChevronDown, Minus, Plus, Truck, ShieldCheck, Droplets, Battery, Waves, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug;
  const { data: products, isLoading } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: reviews } = useQuery<Review[]>({ queryKey: ["/api/reviews"] });
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const product = products?.find((p) => p.slug === slug);
  const productReviews = reviews?.filter((r) => r.productId === product?.id) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted rounded-md animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse w-2/3" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link href="/shop">
            <button className="rounded-md bg-primary px-6 py-2 text-white font-semibold">
              Back to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const specs = product.specs as Record<string, string> | null;
  const features = product.features || [];
  const whatsInBox = product.whatsInBox || [];

  const specIcons: Record<string, typeof Droplets> = {
    "Pressure": Droplets,
    "Battery Life": Battery,
    "Pulse Tech": Waves,
    "Protection": Shield,
    "Tank Capacity": Droplets,
    "Modes": Waves,
    "Weight": Shield,
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
  };

  const avgRating = productReviews.length > 0
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" data-testid="breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
              <img
                alt={product.name}
                className="h-full w-full object-cover"
                src={product.image}
                data-testid="img-product-main"
              />
            </div>
            {product.badge && (
              <div className={`absolute top-4 left-4 rounded-md px-3 py-1.5 text-xs font-bold text-white uppercase tracking-wider ${
                product.badge === "Flagship" ? "bg-primary" :
                product.badge === "Best Seller" ? "bg-emerald-500" :
                product.badge === "Family" ? "bg-violet-500" :
                "bg-amber-500"
              }`} data-testid="badge-product">
                {product.badge}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-primary text-sm font-bold tracking-widest uppercase mb-2" data-testid="text-category">{product.category}</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3" data-testid="text-product-name">{product.name}</h1>

              {productReviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? "text-amber-400" : "text-muted"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm">({productReviews.length} reviews)</span>
                </div>
              )}

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-foreground" data-testid="text-product-price">${product.price}</span>
                {product.compareAtPrice && (
                  <span className="text-lg text-muted-foreground line-through">${product.compareAtPrice}</span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">{product.longDescription}</p>
            </div>

            {features.length > 0 && (
              <div className="space-y-2">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{f}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-b border-border py-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-foreground font-medium text-sm">Quantity:</span>
                <div className="flex items-center gap-3 border border-border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-muted-foreground hover:text-foreground"
                    data-testid="button-decrease-qty"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-foreground font-medium min-w-[24px] text-center" data-testid="text-quantity">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-muted-foreground hover:text-foreground"
                    data-testid="button-increase-qty"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-muted-foreground text-sm">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-primary h-12 text-base font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(217,169,12,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group"
                data-testid="button-add-to-cart"
              >
                Add to Cart - ${(parseFloat(product.price) * quantity).toFixed(2)}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-6 text-xs font-medium text-muted-foreground mt-4">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-emerald-500" />
                  Free 2-Day Shipping
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  2-Year Warranty
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 space-y-24">
          {specs && Object.keys(specs).length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-8" data-testid="text-specs-title">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(specs).map(([key, value]) => {
                  const Icon = specIcons[key] || Shield;
                  return (
                    <div key={key} className="bg-card p-6 rounded-md border border-border flex flex-col gap-4 group hover:border-primary/50 transition-colors" data-testid={`spec-${key.toLowerCase().replace(/\s/g, "-")}`}>
                      <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider mb-1">{key}</p>
                        <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {whatsInBox.length > 0 && (
            <section className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold text-foreground mb-6" data-testid="text-whats-in-box">What's in the Box</h3>
                <ul className="space-y-4">
                  {whatsInBox.map((item, i) => (
                    <li key={i} className="flex items-center gap-4 p-4 rounded-md bg-card border border-border">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-1/2 relative">
                <div className="relative z-10 aspect-square bg-card rounded-2xl overflow-hidden border border-border">
                  <img
                    alt="What's in the box"
                    className="w-full h-full object-cover"
                    src="/images/whats-in-box.png"
                  />
                </div>
              </div>
            </section>
          )}

          <section className="max-w-3xl mx-auto w-full">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center" data-testid="text-faq-title">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="nozzle" className="bg-card rounded-md border border-border px-6">
                <AccordionTrigger className="text-foreground text-base font-medium hover:no-underline" data-testid="accordion-nozzle">
                  How often should I change the nozzle?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We recommend replacing the nozzle every 3 months for optimal hygiene and performance. The JetClean Pro comes with 4 nozzles, providing a year's supply out of the box.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sensitive" className="bg-card rounded-md border border-border px-6">
                <AccordionTrigger className="text-foreground text-base font-medium hover:no-underline" data-testid="accordion-sensitive">
                  Is it safe for sensitive gums?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Absolutely. The device features a 'Soft' mode specifically designed for sensitive gums or first-time users. You can gradually increase intensity as your gums become healthier.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="mouthwash" className="bg-card rounded-md border border-border px-6">
                <AccordionTrigger className="text-foreground text-base font-medium hover:no-underline" data-testid="accordion-mouthwash">
                  Can I use mouthwash in the reservoir?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, you can add a small amount of mouthwash mixed with water to the reservoir for an extra fresh feeling. We recommend a 1:1 ratio of mouthwash to water.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="warranty" className="bg-card rounded-md border border-border px-6">
                <AccordionTrigger className="text-foreground text-base font-medium hover:no-underline" data-testid="accordion-warranty">
                  What does the warranty cover?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  All Novaatoz devices come with a 2-year limited warranty covering manufacturing defects and motor issues. This does not cover physical damage from drops or misuse.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {productReviews.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-8" data-testid="text-reviews-title">Customer Reviews</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productReviews.map((review) => (
                  <div key={review.id} className="rounded-md border border-border bg-card p-6" data-testid={`review-${review.id}`}>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`h-4 w-4 ${i < review.rating ? "text-amber-400" : "text-muted"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <h4 className="text-foreground font-semibold mb-2">{review.title}</h4>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{review.body}</p>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                        {review.customerName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium">{review.customerName}</p>
                        {review.verified && <p className="text-emerald-400 text-xs">Verified Purchase</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
