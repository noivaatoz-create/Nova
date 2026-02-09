import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminSidebar, AdminHeader } from "./dashboard";
import type { Order } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Eye, Package, Truck } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminOrders() {
  const { data: orders, isLoading } = useQuery<Order[]>({ queryKey: ["/api/orders"] });
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Order Updated" });
    },
  });

  const statusOptions = ["pending", "paid", "packed", "shipped", "delivered", "refunded"];

  return (
    <div className="flex h-screen w-full bg-[hsl(220,18%,11%)] overflow-hidden">
      <AdminSidebar active="/admin/orders" />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader title="Orders" />
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="text-white text-lg font-semibold">{orders?.length || 0} Orders</h3>
          </div>

          <div className="bg-[hsl(220,18%,18%)] border border-[hsl(218,18%,25%)] rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[hsl(218,18%,25%)]">
                    <th className="p-4 text-[hsl(215,20%,60%)] text-xs font-medium uppercase tracking-wider">Order #</th>
                    <th className="p-4 text-[hsl(215,20%,60%)] text-xs font-medium uppercase tracking-wider">Customer</th>
                    <th className="p-4 text-[hsl(215,20%,60%)] text-xs font-medium uppercase tracking-wider">Items</th>
                    <th className="p-4 text-[hsl(215,20%,60%)] text-xs font-medium uppercase tracking-wider">Total</th>
                    <th className="p-4 text-[hsl(215,20%,60%)] text-xs font-medium uppercase tracking-wider">Payment</th>
                    <th className="p-4 text-[hsl(215,20%,60%)] text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="p-4 text-[hsl(215,20%,60%)] text-xs font-medium uppercase tracking-wider">Date</th>
                    <th className="p-4 text-[hsl(215,20%,60%)] text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(218,18%,25%)]/50">
                  {orders?.map((order) => {
                    const items = order.items as Array<any>;
                    return (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors" data-testid={`row-order-${order.id}`}>
                        <td className="p-4 text-white text-sm font-medium">#{order.orderNumber}</td>
                        <td className="p-4">
                          <div>
                            <p className="text-white text-sm">{order.customerName}</p>
                            <p className="text-[hsl(215,20%,60%)] text-xs">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="p-4 text-[hsl(215,20%,60%)] text-sm">{items.length} item(s)</td>
                        <td className="p-4 text-white text-sm font-medium">${order.total}</td>
                        <td className="p-4">
                          <span className="text-[hsl(215,20%,60%)] text-xs uppercase">{order.paymentProvider || "N/A"}</span>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
                            className={`text-xs font-semibold px-2 py-1 rounded border-0 focus:ring-1 focus:ring-[hsl(38,92%,50%)] cursor-pointer ${
                              order.status === "paid" ? "bg-emerald-500/10 text-emerald-400" :
                              order.status === "shipped" ? "bg-blue-500/10 text-blue-400" :
                              order.status === "delivered" ? "bg-violet-500/10 text-violet-400" :
                              order.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                              order.status === "packed" ? "bg-cyan-500/10 text-cyan-400" :
                              "bg-red-500/10 text-red-400"
                            }`}
                            data-testid={`select-status-${order.id}`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4 text-[hsl(215,20%,60%)] text-sm">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-md hover:bg-[hsl(218,18%,25%)] text-[hsl(215,20%,60%)] hover:text-white transition-colors"
                            data-testid={`button-view-order-${order.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {(!orders || orders.length === 0) && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <Package className="h-12 w-12 text-[hsl(215,20%,60%)]/30 mx-auto mb-3" />
                        <p className="text-[hsl(215,20%,60%)]">No orders yet</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="bg-[hsl(220,20%,14%)] border-[hsl(218,18%,25%)] text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Order #{selectedOrder?.orderNumber}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[hsl(215,20%,60%)] text-xs mb-1">Customer</p>
                    <p className="text-white text-sm font-medium">{selectedOrder.customerName}</p>
                    <p className="text-[hsl(215,20%,60%)] text-xs">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-[hsl(215,20%,60%)] text-xs mb-1">Shipping Address</p>
                    <p className="text-white text-sm">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>
                <div className="border-t border-[hsl(218,18%,25%)] pt-4">
                  <p className="text-[hsl(215,20%,60%)] text-xs mb-3">Items</p>
                  <div className="space-y-2">
                    {(selectedOrder.items as Array<any>).map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-[hsl(218,18%,25%)]">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{item.name}</p>
                          <p className="text-[hsl(215,20%,60%)] text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-white text-sm">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[hsl(218,18%,25%)] pt-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(215,20%,60%)]">Subtotal</span>
                    <span className="text-white">${selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(215,20%,60%)]">Shipping</span>
                    <span className="text-white">${selectedOrder.shipping}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(215,20%,60%)]">Tax</span>
                    <span className="text-white">${selectedOrder.tax}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-[hsl(218,18%,25%)]">
                    <span>Total</span>
                    <span>${selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
