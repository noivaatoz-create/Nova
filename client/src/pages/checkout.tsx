import { useCartStore } from "@/lib/cart-store";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Lock, CreditCard, ArrowLeft, Truck, ShieldCheck, Banknote } from "lucide-react";
import { SiStripe, SiPaypal } from "react-icons/si";

export default function CheckoutPage() {
  const { items, getTotal, clearCart, getItemCount } = useCartStore();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "cod">("stripe");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings } = useQuery<Record<string, string>>({ queryKey: ["/api/settings"] });

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const total = getTotal();
  const taxRate = parseFloat(settings?.taxRate || "0.08");
  const freeShippingThreshold = parseFloat(settings?.freeShippingThreshold || "75");
  const shippingFlatRate = parseFloat(settings?.shippingFlatRate || "9.99");
  const shipping = total >= freeShippingThreshold ? 0 : shippingFlatRate;
  const tax = total * taxRate;
  const grandTotal = total + shipping + tax;

  const stripeEnabled = settings?.stripeEnabled === "true";
  const paypalEnabled = settings?.paypalEnabled === "true";
  const codEnabled = settings?.codEnabled === "true";
  const noMethodsConfigured = !stripeEnabled && !paypalEnabled && !codEnabled;
  const showStripe = noMethodsConfigured || stripeEnabled;
  const showPaypal = noMethodsConfigured || paypalEnabled;
  const showCod = codEnabled;

  useEffect(() => {
    if (settings) {
      if (showStripe) setPaymentMethod("stripe");
      else if (showPaypal) setPaymentMethod("paypal");
      else if (showCod) setPaymentMethod("cod");
    }
  }, [settings, showStripe, showPaypal, showCod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: form.name,
        customerEmail: form.email,
        shippingAddress: `${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: total.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: grandTotal.toFixed(2),
        paymentProvider: paymentMethod,
        status: "pending",
      };

      await apiRequest("POST", "/api/orders", orderData);
      clearCart();
      toast({ title: "Order Placed!", description: "Thank you for your purchase. You'll receive a confirmation email shortly." });
      navigate("/");
    } catch (error) {
      toast({ title: "Error", description: "Failed to place order. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to proceed to checkout.</p>
          <Link href="/shop">
            <button className="rounded-md bg-primary px-6 py-2.5 text-primary-foreground font-semibold" data-testid="button-back-to-shop">
              Back to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors" data-testid="link-back-shop">
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8" data-testid="text-checkout-title">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-md border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-sm" placeholder="John Doe" data-testid="input-checkout-name" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-sm" placeholder="john@example.com" data-testid="input-checkout-email" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Address</label>
                    <input type="text" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-sm" placeholder="123 Main St" data-testid="input-checkout-address" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
                    <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-sm" placeholder="San Francisco" data-testid="input-checkout-city" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">State</label>
                      <input type="text" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-sm" placeholder="CA" data-testid="input-checkout-state" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">ZIP</label>
                      <input type="text" required value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-sm" placeholder="94102" data-testid="input-checkout-zip" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {showStripe && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("stripe")}
                      className={`flex items-center justify-center gap-3 p-4 rounded-md border transition-colors ${
                        paymentMethod === "stripe"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid="button-payment-stripe"
                    >
                      <SiStripe className="h-6 w-6 text-[#635BFF]" />
                      <span className="text-foreground font-medium">Stripe</span>
                    </button>
                  )}
                  {showPaypal && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`flex items-center justify-center gap-3 p-4 rounded-md border transition-colors ${
                        paymentMethod === "paypal"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid="button-payment-paypal"
                    >
                      <SiPaypal className="h-6 w-6 text-[#00457C]" />
                      <span className="text-foreground font-medium">PayPal</span>
                    </button>
                  )}
                  {showCod && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex items-center justify-center gap-3 p-4 rounded-md border transition-colors ${
                        paymentMethod === "cod"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid="button-payment-cod"
                    >
                      <Banknote className="h-6 w-6 text-emerald-400" />
                      <span className="text-foreground font-medium">Cash on Delivery</span>
                    </button>
                  )}
                </div>
                <p className="text-muted-foreground text-xs mt-4 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Payment processing will be connected after API keys are configured.
                </p>
              </div>
            </div>

            <div>
              <div className="rounded-md border border-border bg-card p-6 sticky top-24">
                <h2 className="text-lg font-bold text-foreground mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3" data-testid={`checkout-item-${item.id}`}>
                      <div className="h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-sm font-medium truncate">{item.name}</p>
                        <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-foreground text-sm font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">{shipping === 0 ? <span className="text-emerald-400">Free</span> : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground" data-testid="text-checkout-total">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 flex items-center justify-center gap-2 rounded-md bg-primary h-12 text-base font-bold text-primary-foreground transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] disabled:opacity-50"
                  data-testid="button-place-order"
                >
                  <Lock className="h-4 w-4" />
                  {isSubmitting ? "Processing..." : "Place Order"}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  Secure checkout powered by {paymentMethod === "stripe" ? "Stripe" : paymentMethod === "paypal" ? "PayPal" : "Cash on Delivery"}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
