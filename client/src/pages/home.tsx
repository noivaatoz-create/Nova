import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Droplets, Waves, VolumeX, ShieldCheck, CheckCircle, XCircle, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import type { Product, Review } from "@shared/schema";

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36" data-testid="section-hero">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary w-fit" data-testid="badge-new-release">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              New JetClean Pro Released
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-foreground">
                Oral Care
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Experience the precision of the JetClean Pro. Clinical-grade hygiene in a cyber-minimalist shell designed for the modern bathroom.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/shop">
                <button className="flex items-center justify-center rounded-md bg-primary h-12 px-8 text-base font-bold text-primary-foreground transition-all hover:scale-[1.02] shadow-[0_0_20px_hsl(var(--primary)/0.4)]" data-testid="button-shop-hero">
                  Shop the Future
                </button>
              </Link>
              <Link href="/product/jetclean-pro">
                <button className="flex items-center justify-center rounded-md border border-border bg-card/50 h-12 px-8 text-base font-medium text-foreground transition-all hover:bg-card hover:border-primary/50" data-testid="button-watch-demo">
                  View Details
                </button>
              </Link>
            </div>
          </div>
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="absolute w-[400px] h-[400px] border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute w-[500px] h-[500px] border border-border/10 rounded-full" />
            <div className="relative z-10 w-full max-w-md aspect-[3/4] rounded-2xl bg-gradient-to-b from-muted to-card p-1 shadow-2xl ring-1 ring-border/20">
              <div className="h-full w-full rounded-xl bg-card overflow-hidden relative">
                <img
                  alt="Novaatoz JetClean Pro Water Flosser"
                  className="h-full w-full object-cover opacity-90"
                  src="/images/hero-product.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex justify-between items-end gap-4">
                    <div>
                      <p className="text-primary text-sm font-bold tracking-widest uppercase">Series X</p>
                      <h3 className="text-white text-2xl font-bold">JetClean Pro</h3>
                    </div>
                    <Link href="/product/jetclean-pro">
                      <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer" data-testid="button-hero-product-link">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuePropsSection() {
  const features = [
    { icon: Waves, title: "Hyper-Pulse Tech", desc: "1200 pulses per minute for deep cleaning between teeth where brushing misses." },
    { icon: VolumeX, title: "Whisper Quiet", desc: "Operates at less than 50db. Keep your morning routine silent and peaceful." },
    { icon: Droplets, title: "Waterproof IPX7", desc: "Fully submersible and shower ready design. Built for real life usage." },
  ];

  return (
    <section className="py-24 bg-background relative" data-testid="section-value-props">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:flex md:items-end md:justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Why Novaatoz?</h2>
            <p className="text-muted-foreground text-lg">Advanced engineering for a superior clean. We've stripped away the unnecessary to focus on pure performance.</p>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-1 text-primary font-medium mt-4 md:mt-0" data-testid="link-full-specs">
            View full specs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="group relative overflow-visible rounded-md border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg" data-testid={`card-feature-${i}`}>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const galleryImages = [
  "/gallery/ezgif-frame-001_1770676967743.jpg",
  "/gallery/gallery-021.png",
  "/gallery/gallery-042.png",
  "/gallery/gallery-023.png",
  "/gallery/gallery-043.png",
  "/gallery/ezgif-frame-015_1770676967744.jpg",
  "/gallery/gallery-044.png",
  "/gallery/gallery-026.png",
  "/gallery/gallery-045.png",
  "/gallery/gallery-034.png",
  "/gallery/gallery-022.png",
  "/gallery/gallery-028.png",
  "/gallery/gallery-041.png",
  "/gallery/ezgif-frame-020_1770676967744.jpg",
  "/gallery/gallery-046.png",
  "/gallery/gallery-024.png",
  "/gallery/gallery-033.png",
  "/gallery/gallery-047.png",
  "/gallery/gallery-038.png",
  "/gallery/gallery-040.png",
];

function GalleryMarqueeSection() {
  const row1 = galleryImages.slice(0, 10);
  const row2 = galleryImages.slice(10, 20);

  return (
    <section className="py-20 bg-section-alt border-t border-border/50 overflow-hidden" data-testid="section-gallery">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Designed for Perfection</h2>
          <p className="text-muted-foreground text-lg">Every angle, every detail - crafted with precision engineering and premium materials.</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex animate-marquee-left">
          {[...row1, ...row1, ...row1].map((src, i) => (
            <div key={i} className="flex-shrink-0 w-[300px] h-[200px] mx-2 rounded-md overflow-hidden border border-border/50">
              <img src={src} alt={`Product showcase ${(i % 10) + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="flex animate-marquee-right">
          {[...row2, ...row2, ...row2].map((src, i) => (
            <div key={i} className="flex-shrink-0 w-[300px] h-[200px] mx-2 rounded-md overflow-hidden border border-border/50">
              <img src={src} alt={`Product showcase ${(i % 10) + 11}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProductsSection() {
  const { data: products, isLoading } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { addItem } = useCartStore();

  return (
    <section className="py-24 border-t border-border/50 bg-section-alt" data-testid="section-featured-products">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Featured Products</h2>
          <Link href="/shop" className="text-primary font-medium hidden sm:flex items-center gap-1" data-testid="link-view-all-products">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="w-full overflow-x-auto pb-8 px-4 sm:px-6 lg:px-8" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-6 mx-auto max-w-7xl min-w-max">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[320px] rounded-md border border-border bg-card overflow-hidden">
                  <div className="aspect-[4/5] bg-muted animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                    <div className="h-3 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))
            : products?.filter(p => p.isFeatured)?.map((product) => (
                <div key={product.id} className="flex w-[320px] flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30 group" data-testid={`card-product-${product.id}`}>
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-[4/5] w-full bg-muted overflow-hidden cursor-pointer">
                      <img
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                        src={product.image}
                      />
                      {product.badge && (
                        <div className={`absolute top-3 left-3 rounded-md px-2 py-1 text-xs font-bold text-white uppercase tracking-wider ${
                          product.badge === "Flagship" ? "bg-primary" :
                          product.badge === "Best Seller" ? "bg-emerald-500" :
                          product.badge === "Family" ? "bg-violet-500" :
                          "bg-amber-500"
                        }`} data-testid={`badge-${product.slug}`}>
                          {product.badge}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                      <span className="text-primary font-bold">${product.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{product.shortDescription}</p>
                    <div className="flex gap-2">
                      <Link href={`/product/${product.slug}`} className="flex-1">
                        <button className="w-full rounded-md bg-foreground/5 py-2 text-sm font-semibold text-foreground hover:bg-foreground/10 transition-colors border border-border" data-testid={`button-view-${product.slug}`}>
                          View Details
                        </button>
                      </Link>
                      <button
                        onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
                        className="rounded-md bg-primary py-2 px-4 text-sm font-semibold text-primary-foreground transition-colors"
                        data-testid={`button-add-cart-${product.slug}`}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const rows = [
    { feature: "Plaque Removal Effectiveness", nova: "99.9%", novaExtra: null, floss: "~60%", flossExtra: null, novaGood: true, flossGood: false },
    { feature: "Gum Health Improvement", nova: null, novaExtra: "Clinically Proven", floss: null, flossExtra: "Often causes bleeding", novaGood: true, flossGood: false },
    { feature: "Time Required", nova: "60 Seconds", novaExtra: null, floss: "3-5 Minutes", flossExtra: null, novaGood: true, flossGood: false },
    { feature: "Braces & Implant Friendly", nova: null, novaExtra: null, floss: null, flossExtra: null, novaGood: true, flossGood: false },
    { feature: "Tech Integration", nova: null, novaExtra: "Smart Pressure Sensor", floss: null, flossExtra: null, novaGood: true, flossGood: false },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden" data-testid="section-comparison">
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Novaatoz vs. The Past</h2>
          <p className="text-muted-foreground">Why settle for string when you can have a stream? See how we stack up against traditional methods.</p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border bg-card/60 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="p-6 text-sm font-medium text-muted-foreground w-1/3">Feature</th>
                  <th className="p-6 text-lg font-bold text-primary w-1/3 text-center bg-primary/5">
                    <div className="flex flex-col items-center gap-1">
                      <Droplets className="h-6 w-6" />
                      <span>Novaatoz</span>
                    </div>
                  </th>
                  <th className="p-6 text-lg font-bold text-slate-400 w-1/3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Minus className="h-6 w-6" />
                      <span>String Floss</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td className="p-6 text-foreground font-medium">{row.feature}</td>
                    <td className="p-6 text-center bg-primary/5">
                      {row.nova ? (
                        <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-sm font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                          {row.nova}
                        </span>
                      ) : row.novaGood ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                          {row.novaExtra && <span className="block text-xs text-muted-foreground mt-1">{row.novaExtra}</span>}
                        </>
                      ) : null}
                    </td>
                    <td className="p-6 text-center text-muted-foreground">
                      {row.floss ? (
                        <span>{row.floss}</span>
                      ) : row.flossGood === false ? (
                        <>
                          <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                          {row.flossExtra && <span className="block text-xs text-muted-foreground mt-1">{row.flossExtra}</span>}
                        </>
                      ) : (
                        <Minus className="h-5 w-5 text-slate-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewsPreviewSection() {
  const { data: reviews } = useQuery<Review[]>({ queryKey: ["/api/reviews"] });
  const displayReviews = reviews?.slice(0, 3) || [];

  return (
    <section className="py-24 bg-section-alt border-t border-border/50" data-testid="section-reviews-preview">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">Real reviews from real customers who made the switch.</p>
          </div>
          <Link href="/reviews" className="hidden md:flex items-center gap-1 text-primary font-medium" data-testid="link-all-reviews">
            All Reviews <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((review) => (
            <div key={review.id} className="rounded-md border border-border bg-card p-6" data-testid={`card-review-${review.id}`}>
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
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden" data-testid="section-cta">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">Ready to Transform Your Routine?</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Join thousands who've already upgraded their oral care. Free shipping on orders over $75. 1-year warranty on all devices.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/shop">
            <button className="rounded-md bg-primary h-12 px-8 text-base font-bold text-primary-foreground transition-all hover:scale-[1.02] shadow-[0_0_20px_hsl(var(--primary)/0.4)]" data-testid="button-shop-cta">
              Shop Now
            </button>
          </Link>
          <Link href="/about">
            <button className="rounded-md border border-border bg-card/50 h-12 px-8 text-base font-medium text-foreground transition-all hover:bg-card hover:border-primary/50" data-testid="button-learn-more-cta">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ValuePropsSection />
      <GalleryMarqueeSection />
      <FeaturedProductsSection />
      <ComparisonSection />
      <ReviewsPreviewSection />
      <CTASection />
    </div>
  );
}
