import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import type { Product, Order } from "@shared/schema";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Droplets, Bell, HelpCircle, Search, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

function AdminSidebar({ active }: { active: string }) {
  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-[hsl(220,40%,8%)] border-r border-[hsl(218,35%,17%)] flex-shrink-0" data-testid="admin-sidebar">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(220,91%,55%)] to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,106,244,0.3)]">
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-bold tracking-tight">Novaatoz</h1>
              <p className="text-[hsl(215,30%,65%)] text-xs font-medium tracking-wide">ADMIN CONSOLE</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active === item.href
                    ? "bg-[hsl(220,91%,55%)] text-white shadow-[0_0_15px_rgba(37,106,244,0.4)]"
                    : "text-[hsl(215,30%,65%)] hover:bg-[hsl(218,35%,17%)] hover:text-white"
                }`}
                data-testid={`link-admin-${item.label.toLowerCase()}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-[hsl(220,91%,55%)]/20 text-[hsl(220,91%,55%)] text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-[hsl(218,35%,17%)] pt-4">
          <div className="flex items-center gap-3 px-3 py-3 rounded-md bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)]">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">JD</div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-white text-xs font-semibold truncate">Jane Doe</span>
              <span className="text-[hsl(215,30%,65%)] text-[10px] truncate">Admin</span>
            </div>
            <Link href="/" className="ml-auto text-[hsl(215,30%,65%)] hover:text-white" data-testid="button-admin-logout">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AdminHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between border-b border-[hsl(218,35%,17%)] bg-[hsl(220,40%,8%)]/95 backdrop-blur-md px-6 py-4 sticky top-0 z-10" data-testid="admin-header">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-5 w-5 text-[hsl(220,91%,55%)]" />
        <h2 className="text-white text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(215,30%,65%)]" />
          <input
            className="w-64 pl-10 pr-3 py-2 border border-[hsl(218,35%,17%)] rounded-md bg-[hsl(220,38%,10%)] text-white placeholder-[hsl(215,30%,65%)] focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)] text-sm"
            placeholder="Search orders, products..."
            type="text"
            data-testid="input-admin-search"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-md hover:bg-[hsl(218,35%,17%)] text-[hsl(215,30%,65%)] hover:text-white transition-colors" data-testid="button-notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-[hsl(220,40%,8%)]" />
          </button>
          <button className="p-2 rounded-md hover:bg-[hsl(218,35%,17%)] text-[hsl(215,30%,65%)] hover:text-white transition-colors" data-testid="button-help">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export { AdminSidebar, AdminHeader };

export default function AdminDashboard() {
  const { data: products } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: orders } = useQuery<Order[]>({ queryKey: ["/api/orders"] });

  const totalRevenue = orders?.reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;
  const totalOrders = orders?.length || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const lowStockProducts = products?.filter((p) => p.stock < 20) || [];

  const kpis = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}`, change: "+12%", up: true, icon: "payments" },
    { label: "Orders", value: totalOrders.toLocaleString(), change: "+5%", up: true, icon: "shopping_bag" },
    { label: "Avg. Order Value", value: `$${avgOrderValue.toFixed(2)}`, change: "-2%", up: false, icon: "price_check" },
    { label: "Conversion Rate", value: "3.2%", change: "+0.4%", up: true, icon: "ads_click" },
  ];

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="flex h-screen w-full bg-[hsl(220,50%,4%)] overflow-hidden">
      <AdminSidebar active="/admin" />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader title="Dashboard Overview" />
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
              <div key={i} className="bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)] rounded-md p-5 hover:border-[hsl(220,91%,55%)]/50 transition-colors group relative overflow-visible" data-testid={`kpi-${i}`}>
                <div className="flex flex-col gap-1 relative z-10">
                  <p className="text-[hsl(215,30%,65%)] text-sm font-medium">{kpi.label}</p>
                  <h3 className="text-white text-2xl font-bold tracking-tight">{kpi.value}</h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`${kpi.up ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"} text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1`}>
                      {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {kpi.change}
                    </span>
                    <span className="text-[hsl(218,25%,40%)] text-xs">vs last month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)] rounded-md p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div>
                  <h3 className="text-white text-base font-semibold">Sales Performance</h3>
                  <p className="text-[hsl(218,25%,40%)] text-xs mt-1">Daily revenue over the last 30 days</p>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] text-[hsl(215,30%,65%)] text-xs hover:text-white hover:border-[hsl(220,91%,55%)]/50 transition-all" data-testid="button-chart-period">
                  Last 30 Days
                </button>
              </div>
              <div className="flex-1 relative min-h-[250px] w-full">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 250">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(220,91%,55%)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(220,91%,55%)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line stroke="hsl(218,35%,17%)" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50" />
                  <line stroke="hsl(218,35%,17%)" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100" />
                  <line stroke="hsl(218,35%,17%)" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150" />
                  <line stroke="hsl(218,35%,17%)" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="200" y2="200" />
                  <path d="M0,200 C50,180 100,210 150,160 C200,110 250,140 300,120 C350,100 400,110 450,80 C500,50 550,90 600,60 C650,30 700,70 750,40 L800,20 L800,250 L0,250 Z" fill="url(#chartGradient)" />
                  <path d="M0,200 C50,180 100,210 150,160 C200,110 250,140 300,120 C350,100 400,110 450,80 C500,50 550,90 600,60 C650,30 700,70 750,40 L800,20" fill="none" stroke="hsl(220,91%,55%)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {lowStockProducts.length > 0 && (
                <div className="bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)] rounded-md p-5 relative overflow-visible" data-testid="card-low-stock">
                  <div className="flex justify-between items-start mb-3 gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-amber-500 mb-1">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="text-sm font-bold uppercase tracking-wider">Low Stock</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-2">
                        <span className="text-white text-sm truncate">{p.name}</span>
                        <span className="text-amber-400 text-sm font-bold whitespace-nowrap">{p.stock} left</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)] rounded-md p-5 flex-1" data-testid="card-top-products">
                <h3 className="text-white text-sm font-semibold mb-4">Top Products</h3>
                <div className="space-y-3">
                  {products?.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-[hsl(218,35%,17%)] flex-shrink-0">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{p.name}</p>
                        <p className="text-[hsl(215,30%,65%)] text-xs">${p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)] rounded-md p-6" data-testid="card-recent-orders">
            <h3 className="text-white text-base font-semibold mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[hsl(218,35%,17%)]">
                    <th className="pb-3 text-[hsl(215,30%,65%)] text-xs font-medium uppercase tracking-wider">Order</th>
                    <th className="pb-3 text-[hsl(215,30%,65%)] text-xs font-medium uppercase tracking-wider">Customer</th>
                    <th className="pb-3 text-[hsl(215,30%,65%)] text-xs font-medium uppercase tracking-wider">Total</th>
                    <th className="pb-3 text-[hsl(215,30%,65%)] text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-[hsl(215,30%,65%)] text-xs font-medium uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(218,35%,17%)]/50">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 text-white text-sm font-medium">#{order.orderNumber}</td>
                      <td className="py-3 text-[hsl(215,30%,65%)] text-sm">{order.customerName}</td>
                      <td className="py-3 text-white text-sm font-medium">${order.total}</td>
                      <td className="py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          order.status === "paid" ? "bg-emerald-500/10 text-emerald-400" :
                          order.status === "shipped" ? "bg-blue-500/10 text-blue-400" :
                          order.status === "delivered" ? "bg-violet-500/10 text-violet-400" :
                          order.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                          "bg-red-500/10 text-red-400"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-[hsl(215,30%,65%)] text-sm">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[hsl(215,30%,65%)] text-sm">No orders yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
