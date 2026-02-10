import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { setIsOpen, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const { data: settings } = useQuery<Record<string, string>>({ queryKey: ["/api/settings"] });

  const allLinks = [
    { href: "/shop", label: "Shop", key: "showNavShop" },
    { href: "/about", label: "About", key: "showNavAbout" },
    { href: "/faq", label: "FAQ", key: "showNavFaq" },
    { href: "/contact", label: "Contact", key: "showNavContact" },
    { href: "/reviews", label: "Reviews", key: "showNavReviews" },
  ];
  const navLinks = allLinks.filter(l => settings?.[l.key] !== "false");

  const logoText = settings?.logoText || "NOVAATOZ";
  const logoTextSize = settings?.logoSize === "small" ? "text-lg" : settings?.logoSize === "large" ? "text-2xl" : "text-xl";
  const logoImgSize = settings?.logoSize === "small" ? "h-7 w-7" : settings?.logoSize === "large" ? "h-11 w-11" : "h-9 w-9";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-xl" data-testid="nav-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          {settings?.showLogoIcon !== "false" && <img src="/images/novaatoz-logo.png" alt="Novaatoz" className={`${logoImgSize} object-contain dark:invert`} />}
          <span className={`${logoTextSize} font-bold tracking-tight text-foreground`}>{logoText}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                location === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`link-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground" data-testid="text-cart-count">
                {itemCount}
              </span>
            )}
          </button>

          <Link href="/shop">
            <Button
              className="hidden sm:flex"
              data-testid="button-buy-now"
            >
              Buy Now
            </Button>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden text-foreground p-2" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border w-[280px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-foreground">
                  {settings?.showLogoIcon !== "false" && <img src="/images/novaatoz-logo.png" alt="Novaatoz" className="h-7 w-7 object-contain dark:invert" />}
                  {logoText}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-base font-medium transition-colors py-2 ${
                      location === link.href
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`link-mobile-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/admin" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full mt-4" data-testid="link-mobile-admin">
                    Admin Panel
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
