import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminSidebar, AdminHeader } from "./dashboard";
import type { Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminProducts() {
  const { data: products, isLoading } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { toast } = useToast();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", shortDescription: "", longDescription: "", price: "", category: "Best Sellers", badge: "", image: "", stock: "100",
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editProduct) {
        return apiRequest("PATCH", `/api/products/${editProduct.id}`, data);
      }
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: editProduct ? "Product Updated" : "Product Created" });
      setShowForm(false);
      setEditProduct(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product Deleted" });
    },
  });

  const resetForm = () => {
    setForm({ name: "", slug: "", shortDescription: "", longDescription: "", price: "", category: "Best Sellers", badge: "", image: "", stock: "100" });
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name, slug: p.slug, shortDescription: p.shortDescription, longDescription: p.longDescription,
      price: p.price, category: p.category, badge: p.badge || "", image: p.image, stock: String(p.stock),
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stockNum = parseInt(form.stock);
    if (isNaN(stockNum) || stockNum < 0) return;
    saveMutation.mutate({
      ...form,
      stock: stockNum,
      badge: form.badge || null,
      images: [],
      features: [],
      whatsInBox: [],
    });
  };

  return (
    <div className="flex h-screen w-full bg-[hsl(220,50%,4%)] overflow-hidden">
      <AdminSidebar active="/admin/products" />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader title="Products" />
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-white text-lg font-semibold">{products?.length || 0} Products</h3>
            </div>
            <button
              onClick={() => { resetForm(); setEditProduct(null); setShowForm(true); }}
              className="flex items-center gap-2 rounded-md bg-[hsl(220,91%,55%)] px-4 py-2 text-sm font-semibold text-white hover:bg-[hsl(220,91%,45%)] transition-colors"
              data-testid="button-add-product"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>

          <div className="bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)] rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[hsl(218,35%,17%)]">
                    <th className="p-4 text-[hsl(215,30%,65%)] text-xs font-medium uppercase tracking-wider">Product</th>
                    <th className="p-4 text-[hsl(215,30%,65%)] text-xs font-medium uppercase tracking-wider">Category</th>
                    <th className="p-4 text-[hsl(215,30%,65%)] text-xs font-medium uppercase tracking-wider">Price</th>
                    <th className="p-4 text-[hsl(215,30%,65%)] text-xs font-medium uppercase tracking-wider">Stock</th>
                    <th className="p-4 text-[hsl(215,30%,65%)] text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="p-4 text-[hsl(215,30%,65%)] text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(218,35%,17%)]/50">
                  {products?.map((product) => (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors" data-testid={`row-product-${product.id}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-[hsl(218,35%,17%)] flex-shrink-0">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{product.name}</p>
                            <p className="text-[hsl(215,30%,65%)] text-xs">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[hsl(215,30%,65%)] text-sm">{product.category}</td>
                      <td className="p-4 text-white text-sm font-medium">${product.price}</td>
                      <td className="p-4">
                        <span className={`text-sm font-medium ${product.stock < 20 ? "text-amber-400" : "text-emerald-400"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${product.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(product)} className="p-1.5 rounded-md hover:bg-[hsl(218,35%,17%)] text-[hsl(215,30%,65%)] hover:text-white transition-colors" data-testid={`button-edit-${product.id}`}>
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteMutation.mutate(product.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-[hsl(215,30%,65%)] hover:text-red-400 transition-colors" data-testid={`button-delete-${product.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="bg-[hsl(220,40%,7%)] border-[hsl(218,35%,17%)] text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)]" data-testid="input-product-name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Slug</label>
                  <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)]" data-testid="input-product-slug" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Short Description</label>
                <input type="text" required value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)]" data-testid="input-product-short-desc" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Long Description</label>
                <textarea required value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} rows={3}
                  className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)] resize-none" data-testid="input-product-long-desc" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Price</label>
                  <input type="text" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)]" data-testid="input-product-price" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)]" data-testid="select-product-category">
                    <option value="Best Sellers">Best Sellers</option>
                    <option value="Portable">Portable</option>
                    <option value="Family">Family</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Stock</label>
                  <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)]" data-testid="input-product-stock" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Image URL</label>
                  <input type="text" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)]" data-testid="input-product-image" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Badge</label>
                  <input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,38%,10%)] px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)]" placeholder="e.g. Flagship, Best Seller" data-testid="input-product-badge" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saveMutation.isPending}
                  className="flex-1 rounded-md bg-[hsl(220,91%,55%)] py-2.5 text-sm font-bold text-white hover:bg-[hsl(220,91%,45%)] disabled:opacity-50 transition-colors"
                  data-testid="button-save-product">
                  {saveMutation.isPending ? "Saving..." : "Save Product"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 rounded-md border border-[hsl(218,35%,17%)] py-2.5 text-sm font-medium text-[hsl(215,30%,65%)] hover:text-white transition-colors"
                  data-testid="button-cancel-product">
                  Cancel
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
