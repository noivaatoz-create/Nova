import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navigation } from "@/components/navigation";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import HomePage from "@/pages/home";
import ShopPage from "@/pages/shop";
import ProductDetailPage from "@/pages/product-detail";
import CheckoutPage from "@/pages/checkout";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import FAQPage from "@/pages/faq";
import ReviewsPage from "@/pages/reviews";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminOrders from "@/pages/admin/orders";
import AdminSettings from "@/pages/admin/settings";

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[hsl(220,40%,7%)]">
      <Navigation />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => <CustomerLayout><HomePage /></CustomerLayout>}
      </Route>
      <Route path="/shop">
        {() => <CustomerLayout><ShopPage /></CustomerLayout>}
      </Route>
      <Route path="/product/:slug">
        {() => <CustomerLayout><ProductDetailPage /></CustomerLayout>}
      </Route>
      <Route path="/checkout">
        {() => <CustomerLayout><CheckoutPage /></CustomerLayout>}
      </Route>
      <Route path="/about">
        {() => <CustomerLayout><AboutPage /></CustomerLayout>}
      </Route>
      <Route path="/contact">
        {() => <CustomerLayout><ContactPage /></CustomerLayout>}
      </Route>
      <Route path="/faq">
        {() => <CustomerLayout><FAQPage /></CustomerLayout>}
      </Route>
      <Route path="/reviews">
        {() => <CustomerLayout><ReviewsPage /></CustomerLayout>}
      </Route>
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route>
        {() => <CustomerLayout><NotFound /></CustomerLayout>}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
