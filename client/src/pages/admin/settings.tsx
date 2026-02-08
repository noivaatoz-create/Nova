import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminSidebar, AdminHeader } from "./dashboard";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Save, CreditCard, Store, Mail } from "lucide-react";
import { SiStripe, SiPaypal } from "react-icons/si";

interface SettingsForm {
  stripeEnabled: string;
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalEnabled: string;
  paypalEmail: string;
  codEnabled: string;
  storeName: string;
  currency: string;
  taxRate: string;
  freeShippingThreshold: string;
  shippingFlatRate: string;
  orderPrefix: string;
  supportEmail: string;
  supportPhone: string;
  storeAddress: string;
}

const defaultForm: SettingsForm = {
  stripeEnabled: "false",
  stripePublicKey: "",
  stripeSecretKey: "",
  paypalEnabled: "false",
  paypalEmail: "",
  codEnabled: "false",
  storeName: "",
  currency: "USD",
  taxRate: "0",
  freeShippingThreshold: "0",
  shippingFlatRate: "0",
  orderPrefix: "",
  supportEmail: "",
  supportPhone: "",
  storeAddress: "",
};

function Toggle({ value, onToggle, testId }: { value: string; onToggle: () => void; testId: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value === "true" ? "bg-[hsl(220,91%,55%)]" : "bg-[hsl(218,35%,25%)]"
      }`}
      data-testid={testId}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        value === "true" ? "translate-x-6" : "translate-x-1"
      }`} />
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)] rounded-md p-6 space-y-4">
          <div className="h-6 w-48 bg-[hsl(218,35%,17%)] rounded animate-pulse" />
          <div className="space-y-3">
            <div className="h-10 w-full bg-[hsl(218,35%,17%)] rounded animate-pulse" />
            <div className="h-10 w-full bg-[hsl(218,35%,17%)] rounded animate-pulse" />
            <div className="h-10 w-2/3 bg-[hsl(218,35%,17%)] rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminSettings() {
  const { toast } = useToast();
  const [form, setForm] = useState<SettingsForm>(defaultForm);

  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      setForm({
        stripeEnabled: settings.stripeEnabled || "false",
        stripePublicKey: settings.stripePublicKey || "",
        stripeSecretKey: settings.stripeSecretKey || "",
        paypalEnabled: settings.paypalEnabled || "false",
        paypalEmail: settings.paypalEmail || "",
        codEnabled: settings.codEnabled || "false",
        storeName: settings.storeName || "",
        currency: settings.currency || "USD",
        taxRate: settings.taxRate ? String(parseFloat(settings.taxRate) * 100) : "0",
        freeShippingThreshold: settings.freeShippingThreshold || "0",
        shippingFlatRate: settings.shippingFlatRate || "0",
        orderPrefix: settings.orderPrefix || "",
        supportEmail: settings.supportEmail || "",
        supportPhone: settings.supportPhone || "",
        storeAddress: settings.storeAddress || "",
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      return apiRequest("PATCH", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Settings saved successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    },
  });

  const savePayment = () => {
    saveMutation.mutate({
      stripeEnabled: form.stripeEnabled,
      stripePublicKey: form.stripePublicKey,
      stripeSecretKey: form.stripeSecretKey,
      paypalEnabled: form.paypalEnabled,
      paypalEmail: form.paypalEmail,
      codEnabled: form.codEnabled,
    });
  };

  const saveStore = () => {
    saveMutation.mutate({
      storeName: form.storeName,
      currency: form.currency,
      taxRate: String(parseFloat(form.taxRate) / 100),
      freeShippingThreshold: form.freeShippingThreshold,
      shippingFlatRate: form.shippingFlatRate,
      orderPrefix: form.orderPrefix,
    });
  };

  const saveContact = () => {
    saveMutation.mutate({
      supportEmail: form.supportEmail,
      supportPhone: form.supportPhone,
      storeAddress: form.storeAddress,
    });
  };

  const inputClass = "w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,40%,7%)] px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)] placeholder-[hsl(215,30%,65%)]";
  const labelClass = "block text-sm font-medium text-[hsl(215,30%,65%)] mb-1.5";

  return (
    <div className="flex h-screen w-full bg-[hsl(220,50%,4%)] overflow-hidden">
      <AdminSidebar active="/admin/settings" />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader title="Settings" />
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <div className="bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)] rounded-md p-6" data-testid="card-payment-settings">
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-[hsl(220,91%,55%)]" />
                    <h3 className="text-white text-base font-semibold">Payment Settings</h3>
                  </div>
                  <button
                    onClick={savePayment}
                    disabled={saveMutation.isPending}
                    className="flex items-center gap-2 rounded-md bg-[hsl(220,91%,55%)] px-4 py-2 text-sm font-semibold text-white hover:bg-[hsl(220,91%,45%)] transition-colors disabled:opacity-50"
                    data-testid="button-save-payment"
                  >
                    <Save className="h-4 w-4" />
                    {saveMutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-[hsl(220,40%,7%)] border border-[hsl(218,35%,17%)]">
                    <div className="flex items-center gap-3">
                      <SiStripe className="h-5 w-5 text-[#635BFF]" />
                      <div>
                        <p className="text-white text-sm font-medium">Stripe</p>
                        <p className="text-[hsl(215,30%,65%)] text-xs">Accept credit card payments</p>
                      </div>
                    </div>
                    <Toggle
                      value={form.stripeEnabled}
                      onToggle={() => setForm({ ...form, stripeEnabled: form.stripeEnabled === "true" ? "false" : "true" })}
                      testId="toggle-stripe-enabled"
                    />
                  </div>

                  {form.stripeEnabled === "true" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-[hsl(218,35%,17%)] ml-2">
                      <div>
                        <label className={labelClass}>Stripe Public Key</label>
                        <input
                          type="text"
                          value={form.stripePublicKey}
                          onChange={(e) => setForm({ ...form, stripePublicKey: e.target.value })}
                          className={inputClass}
                          placeholder="pk_live_..."
                          data-testid="input-stripe-public-key"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Stripe Secret Key</label>
                        <input
                          type="password"
                          value={form.stripeSecretKey}
                          onChange={(e) => setForm({ ...form, stripeSecretKey: e.target.value })}
                          className={inputClass}
                          placeholder="sk_live_..."
                          data-testid="input-stripe-secret-key"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-[hsl(220,40%,7%)] border border-[hsl(218,35%,17%)]">
                    <div className="flex items-center gap-3">
                      <SiPaypal className="h-5 w-5 text-[#00457C]" />
                      <div>
                        <p className="text-white text-sm font-medium">PayPal</p>
                        <p className="text-[hsl(215,30%,65%)] text-xs">Accept PayPal payments</p>
                      </div>
                    </div>
                    <Toggle
                      value={form.paypalEnabled}
                      onToggle={() => setForm({ ...form, paypalEnabled: form.paypalEnabled === "true" ? "false" : "true" })}
                      testId="toggle-paypal-enabled"
                    />
                  </div>

                  {form.paypalEnabled === "true" && (
                    <div className="pl-4 border-l-2 border-[hsl(218,35%,17%)] ml-2">
                      <label className={labelClass}>PayPal Email</label>
                      <input
                        type="email"
                        value={form.paypalEmail}
                        onChange={(e) => setForm({ ...form, paypalEmail: e.target.value })}
                        className={inputClass}
                        placeholder="payments@example.com"
                        data-testid="input-paypal-email"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-[hsl(220,40%,7%)] border border-[hsl(218,35%,17%)]">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-white text-sm font-medium">Cash on Delivery</p>
                        <p className="text-[hsl(215,30%,65%)] text-xs">Allow payment upon delivery</p>
                      </div>
                    </div>
                    <Toggle
                      value={form.codEnabled}
                      onToggle={() => setForm({ ...form, codEnabled: form.codEnabled === "true" ? "false" : "true" })}
                      testId="toggle-cod-enabled"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)] rounded-md p-6" data-testid="card-store-settings">
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Store className="h-5 w-5 text-[hsl(220,91%,55%)]" />
                    <h3 className="text-white text-base font-semibold">Store Settings</h3>
                  </div>
                  <button
                    onClick={saveStore}
                    disabled={saveMutation.isPending}
                    className="flex items-center gap-2 rounded-md bg-[hsl(220,91%,55%)] px-4 py-2 text-sm font-semibold text-white hover:bg-[hsl(220,91%,45%)] transition-colors disabled:opacity-50"
                    data-testid="button-save-store"
                  >
                    <Save className="h-4 w-4" />
                    {saveMutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Store Name</label>
                    <input
                      type="text"
                      value={form.storeName}
                      onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                      className={inputClass}
                      placeholder="My Store"
                      data-testid="input-store-name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Currency</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className={inputClass}
                      data-testid="select-currency"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.taxRate}
                      onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
                      className={inputClass}
                      placeholder="8"
                      data-testid="input-tax-rate"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Free Shipping Threshold ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.freeShippingThreshold}
                      onChange={(e) => setForm({ ...form, freeShippingThreshold: e.target.value })}
                      className={inputClass}
                      placeholder="50"
                      data-testid="input-free-shipping-threshold"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Flat Rate Shipping ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.shippingFlatRate}
                      onChange={(e) => setForm({ ...form, shippingFlatRate: e.target.value })}
                      className={inputClass}
                      placeholder="5.99"
                      data-testid="input-shipping-flat-rate"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Order Number Prefix</label>
                    <input
                      type="text"
                      value={form.orderPrefix}
                      onChange={(e) => setForm({ ...form, orderPrefix: e.target.value })}
                      className={inputClass}
                      placeholder="ORD-"
                      data-testid="input-order-prefix"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)] rounded-md p-6" data-testid="card-contact-settings">
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[hsl(220,91%,55%)]" />
                    <h3 className="text-white text-base font-semibold">Contact Information</h3>
                  </div>
                  <button
                    onClick={saveContact}
                    disabled={saveMutation.isPending}
                    className="flex items-center gap-2 rounded-md bg-[hsl(220,91%,55%)] px-4 py-2 text-sm font-semibold text-white hover:bg-[hsl(220,91%,45%)] transition-colors disabled:opacity-50"
                    data-testid="button-save-contact"
                  >
                    <Save className="h-4 w-4" />
                    {saveMutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Support Email</label>
                    <input
                      type="email"
                      value={form.supportEmail}
                      onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                      className={inputClass}
                      placeholder="support@example.com"
                      data-testid="input-support-email"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Support Phone</label>
                    <input
                      type="tel"
                      value={form.supportPhone}
                      onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                      className={inputClass}
                      placeholder="+1 (555) 123-4567"
                      data-testid="input-support-phone"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Store Address</label>
                    <textarea
                      value={form.storeAddress}
                      onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
                      rows={3}
                      className={`${inputClass} resize-none`}
                      placeholder="123 Main St, City, State, ZIP"
                      data-testid="input-store-address"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}