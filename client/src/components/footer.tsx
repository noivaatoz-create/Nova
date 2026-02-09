import { Link } from "wouter";
import { SiX, SiInstagram, SiFacebook, SiYoutube } from "react-icons/si";
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
    <footer className="border-t border-[hsl(218,35%,17%)] bg-[hsl(220,50%,4%)] pt-16 pb-8" data-testid="footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              {settings?.showLogoIcon !== "false" && <img src="/images/novaatoz-logo.png" alt="Novaatoz" className="h-9 w-9 object-contain brightness-0 invert" />}
              <span className="text-xl font-bold tracking-tight text-white">{settings?.logoText || "NOVAATOZ"}</span>
            </div>
            <p className="text-[hsl(215,30%,65%)] max-w-md mb-8 leading-relaxed">
              Redefining the daily ritual. Novaatoz combines cutting-edge hydro-technology with minimalist design to bring dental-grade care into your home.
            </p>
            {settings?.showFooterSocial !== "false" && (
              <div className="flex gap-4">
                <a href="#" className="text-[hsl(215,30%,65%)] hover:text-white transition-colors" data-testid="link-twitter">
                  <SiX className="h-5 w-5" />
                </a>
                <a href="#" className="text-[hsl(215,30%,65%)] hover:text-white transition-colors" data-testid="link-instagram">
                  <SiInstagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-[hsl(215,30%,65%)] hover:text-white transition-colors" data-testid="link-facebook">
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-[hsl(215,30%,65%)] hover:text-white transition-colors" data-testid="link-youtube">
                  <SiYoutube className="h-5 w-5" />
                </a>
              </div>
            )}
          </div>
          {settings?.showFooterNewsletter !== "false" && (
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Stay in the loop</h3>
              <p className="text-[hsl(215,30%,65%)] mb-4">Join our newsletter for exclusive drops and oral health tips.</p>
              <form className="flex gap-2 max-w-md" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-[hsl(38,92%,50%)] text-sm leading-6"
                  data-testid="input-newsletter-email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-[hsl(38,92%,50%)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[hsl(38,92%,40%)] transition-colors"
                  data-testid="button-subscribe"
                >
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>

        {settings?.showFooterLinks !== "false" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[hsl(218,35%,17%)] pt-12">
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Products</h3>
              <ul className="space-y-3">
                <li><Link href="/product/jetclean-pro" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">JetClean Pro</Link></li>
                <li><Link href="/product/travelpulse-mini" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">TravelPulse Mini</Link></li>
                <li><Link href="/product/familytank-xl" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">FamilyTank XL</Link></li>
                <li><Link href="/shop" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/reviews" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">Reviews</Link></li>
                <li><Link href="/contact" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/faq" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/shipping-returns" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/track-order" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">Track Order</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy-policy" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-[hsl(215,30%,65%)] hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        )}

        <div className="border-t border-[hsl(218,35%,17%)] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[hsl(215,30%,65%)]">{settings?.copyrightText || "\u00A9 2025 Novaatoz Inc. All rights reserved."}</p>
          <Link href="/admin/login" className="text-xs text-[hsl(215,30%,45%)] hover:text-[hsl(38,92%,50%)] transition-colors" data-testid="link-admin">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
