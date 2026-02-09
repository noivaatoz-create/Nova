import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();
  const { data: settings } = useQuery<Record<string, string>>({ queryKey: ["/api/settings"] });
  const total = getTotal();
  const itemCount = getItemCount();
  const freeShippingThreshold = parseFloat(settings?.freeShippingThreshold || "75");
  const shippingFlatRate = parseFloat(settings?.shippingFlatRate || "9.99");
  const remaining = freeShippingThreshold - total;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="bg-[hsl(220,20%,14%)] border-[hsl(218,18%,25%)] w-full sm:max-w-md flex flex-col" data-testid="cart-drawer">
        <SheetHeader className="pb-4 border-b border-[hsl(218,18%,25%)]">
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[hsl(38,92%,50%)]" />
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center" data-testid="text-empty-cart">
            <ShoppingBag className="h-16 w-16 text-[hsl(215,20%,60%)]/30" />
            <div>
              <p className="text-white font-semibold text-lg">Your cart is empty</p>
              <p className="text-[hsl(215,20%,60%)] text-sm mt-1">Add some products to get started</p>
            </div>
            <Link href="/shop" onClick={() => setIsOpen(false)}>
              <Button className="bg-[hsl(38,92%,50%)] text-white no-default-hover-elevate no-default-active-elevate hover:bg-[hsl(38,92%,40%)]" data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {remaining > 0 && (
              <div className="mt-4 rounded-md bg-[hsl(38,92%,50%)]/10 border border-[hsl(38,92%,50%)]/20 p-3 text-sm" data-testid="text-free-shipping-progress">
                <p className="text-[hsl(38,92%,50%)]">
                  Add <span className="font-bold">${remaining.toFixed(2)}</span> more for free shipping!
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-[hsl(218,18%,25%)]">
                  <div
                    className="h-full rounded-full bg-[hsl(38,92%,50%)] transition-all duration-500"
                    style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-md border border-[hsl(218,18%,25%)] bg-[hsl(220,18%,18%)] p-3" data-testid={`cart-item-${item.id}`}>
                  <div className="h-20 w-20 rounded-md overflow-hidden bg-[hsl(218,18%,25%)] flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[hsl(215,20%,60%)] hover:text-white flex-shrink-0"
                        data-testid={`button-remove-${item.id}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border border-[hsl(218,18%,25%)] rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-[hsl(215,20%,60%)] hover:text-white"
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-white text-sm font-medium min-w-[20px] text-center" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-[hsl(215,20%,60%)] hover:text-white"
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-[hsl(38,92%,50%)] font-bold text-sm" data-testid={`text-item-price-${item.id}`}>
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-[hsl(218,18%,25%)] space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(215,20%,60%)]">Subtotal</span>
                <span className="text-white font-semibold" data-testid="text-subtotal">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(215,20%,60%)]">Shipping</span>
                <span className="text-white font-semibold" data-testid="text-shipping">
                  {total >= freeShippingThreshold ? (
                    <span className="text-emerald-400">Free</span>
                  ) : (
                    `$${shippingFlatRate.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-[hsl(218,18%,25%)]">
                <span className="text-white font-bold">Total</span>
                <span className="text-white font-bold" data-testid="text-cart-total">
                  ${(total + (total >= freeShippingThreshold ? 0 : shippingFlatRate)).toFixed(2)}
                </span>
              </div>
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                <Button
                  className="w-full bg-[hsl(38,92%,50%)] text-white font-bold mt-2 no-default-hover-elevate no-default-active-elevate hover:bg-[hsl(38,92%,40%)] hover:shadow-[0_0_20px_rgba(217,169,12,0.4)]"
                  data-testid="button-checkout"
                >
                  Checkout <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/shop" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-[hsl(218,18%,25%)] text-[hsl(215,20%,60%)] mt-2"
                  data-testid="button-continue-shopping-drawer"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
