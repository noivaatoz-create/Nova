import { Link } from "wouter";
import { SiX, SiInstagram, SiFacebook, SiYoutube, SiTiktok, SiLinkedin } from "react-icons/si";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: settings } = useQuery<Record<string, string>>({ queryKey: ["/api/settings"] });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/subscribers", { email });
      toast({ title: "Subscribed!", description: "You'll receive our latest updates." });
      setEmail("");
    } catch (error: any) {
      if (error.message?.includes("409")) {
        toast({ title: "Already subscribed", description: "This email is already on our list." });
      } else {
        toast({ title: "Error", description: "Failed to subscribe. Please try again.", variant: "destructive" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-border bg-section-alt pt-16 pb-8" data-testid="footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              {settings?.showLogoIcon !== "false" && <img src="/images/novaatoz-logo.png" alt="Novaatoz" className="h-9 w-9 object-contain brightness-0 invert" />}
              <span className="text-xl font-bold tracking-tight text-foreground">{settings?.logoText || "NOVAATOZ"}</span>
            </div>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              Redefining the daily ritual. Novaatoz combines cutting-edge hydro-technology with minimalist design to bring dental-grade care into your home.
            </p>
            {settings?.showFooterSocial !== "false" && (() => {
              const hasAnySocialLinks = settings?.socialFacebook || settings?.socialInstagram || settings?.socialTwitter || settings?.socialYoutube || settings?.socialTiktok || settings?.socialLinkedin;
              return (
                <div className="flex gap-4">
                  {(settings?.socialTwitter || !hasAnySocialLinks) && (
                    <a href={settings?.socialTwitter || "#"} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-twitter">
                      <SiX className="h-5 w-5" />
                    </a>
                  )}
                  {(settings?.socialInstagram || !hasAnySocialLinks) && (
                    <a href={settings?.socialInstagram || "#"} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-instagram">
                      <SiInstagram className="h-5 w-5" />
                    </a>
                  )}
                  {(settings?.socialFacebook || !hasAnySocialLinks) && (
                    <a href={settings?.socialFacebook || "#"} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-facebook">
                      <SiFacebook className="h-5 w-5" />
                    </a>
                  )}
                  {(settings?.socialYoutube || !hasAnySocialLinks) && (
                    <a href={settings?.socialYoutube || "#"} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-youtube">
                      <SiYoutube className="h-5 w-5" />
                    </a>
                  )}
                  {(settings?.socialTiktok || !hasAnySocialLinks) && (
                    <a href={settings?.socialTiktok || "#"} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-tiktok">
                      <SiTiktok className="h-5 w-5" />
                    </a>
                  )}
                  {(settings?.socialLinkedin || !hasAnySocialLinks) && (
                    <a href={settings?.socialLinkedin || "#"} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-linkedin">
                      <SiLinkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              );
            })()}
          </div>
          {settings?.showFooterNewsletter !== "false" && (
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Stay in the loop</h3>
              <p className="text-muted-foreground mb-4">Join our newsletter for exclusive drops and oral health tips.</p>
              <form className="flex gap-2 max-w-md" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-foreground shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-ring text-sm leading-6"
                  data-testid="input-newsletter-email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors"
                  data-testid="button-subscribe"
                >
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>

        {settings?.showFooterLinks !== "false" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-12">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Products</h3>
              <ul className="space-y-3">
                <li><Link href="/product/jetclean-pro" className="text-sm text-muted-foreground hover:text-foreground transition-colors">JetClean Pro</Link></li>
                <li><Link href="/product/travelpulse-mini" className="text-sm text-muted-foreground hover:text-foreground transition-colors">TravelPulse Mini</Link></li>
                <li><Link href="/product/familytank-xl" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FamilyTank XL</Link></li>
                <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link href="/shipping-returns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/track-order" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Track Order</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        )}

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">{settings?.copyrightText || "\u00A9 2025 Novaatoz Inc. All rights reserved."}</p>
          <Link href="/admin/login" className="text-xs text-muted-foreground hover:text-primary transition-colors" data-testid="link-admin">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
