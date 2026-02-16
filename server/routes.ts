import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertProductSchema, insertOrderSchema, insertReviewSchema, insertSubscriberSchema, insertContactSubmissionSchema } from "../shared/schema.js";
import {
  getProductColorVariantsSettingKey,
  parseProductColorVariants,
  parseProductColorVariantsSettingKey,
  sanitizeProductColorVariants,
  type ProductColorVariant,
} from "../shared/color-variants.js";
import { randomUUID } from "crypto";
import multer from "multer";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

function requireAdmin(req: any, res: any, next: any) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}


async function getProductColorVariantsMap(): Promise<Map<number, ProductColorVariant[]>> {
  const settings = await storage.getSettings();
  const variantsMap = new Map<number, ProductColorVariant[]>();

  for (const setting of settings) {
    const productId = parseProductColorVariantsSettingKey(setting.key);
    if (productId !== null) {
      variantsMap.set(productId, parseProductColorVariants(setting.value));
    }
  }

  return variantsMap;
}

async function getProductColorVariants(productId: number): Promise<ProductColorVariant[]> {
  const setting = await storage.getSetting(getProductColorVariantsSettingKey(productId));
  return parseProductColorVariants(setting?.value);
}

async function saveProductColorVariants(productId: number, variants: ProductColorVariant[]): Promise<void> {
  await storage.upsertSetting(getProductColorVariantsSettingKey(productId), JSON.stringify(variants));
}

type PayPalMode = "sandbox" | "live";

async function getPayPalConfig() {
  const [paypalEnabledSetting, paypalClientIdSetting, paypalClientSecretSetting, paypalModeSetting] = await Promise.all([
    storage.getSetting("paypalEnabled"),
    storage.getSetting("paypalClientId"),
    storage.getSetting("paypalClientSecret"),
    storage.getSetting("paypalMode"),
  ]);

  // Env vars take priority over database settings for security
  const clientId = process.env.PAYPAL_CLIENT_ID || paypalClientIdSetting?.value || "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || paypalClientSecretSetting?.value || "";
  const rawMode = (process.env.PAYPAL_MODE || paypalModeSetting?.value || "sandbox").toLowerCase();
  const mode: PayPalMode = rawMode === "live" ? "live" : "sandbox";
  // PayPal is enabled if env vars are set OR database setting is true
  const paypalEnabled = Boolean(clientId && clientSecret) || paypalEnabledSetting?.value === "true";

  return { paypalEnabled, clientId, clientSecret, mode };
}

function getPayPalApiBase(mode: PayPalMode): string {
  return mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken(clientId: string, clientSecret: string, mode: PayPalMode): Promise<string> {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${getPayPalApiBase(mode)}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PayPal auth failed: ${text}`);
  }

  const data = await response.json();
  return data.access_token as string;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/admin/login", (req, res) => {
    try {
      const { username, password } = req.body;
      const adminUser = process.env.ADMIN_USERNAME;
      const adminPass = process.env.ADMIN_PASSWORD;
      if (!adminUser || !adminPass) {
        return res.status(503).json({ error: "Admin credentials not configured" });
      }
      if (username === adminUser && password === adminPass) {
        if (req.session) {
          req.session.isAdmin = true;
        }
        return res.json({ success: true });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/admin/session", (req, res) => {
    res.json({ isAdmin: req.session?.isAdmin === true });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session = null;
    res.json({ success: true });
  });

  app.post("/api/upload", requireAdmin, upload.single("image"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return res.status(503).json({ error: "Upload not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY." });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const ext = path.extname(req.file.originalname);
    const name = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;

    const { error } = await supabase.storage
      .from("uploads")
      .upload(name, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }

    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(name);
    res.json({ url: urlData.publicUrl });
  });

  app.get("/api/paypal/config", async (_req, res) => {
    const { paypalEnabled, clientId, mode } = await getPayPalConfig();
    res.json({
      enabled: paypalEnabled && Boolean(clientId),
      clientId,
      mode,
    });
  });

  app.post("/api/paypal/create-order", async (req, res) => {
    const { amount, currency } = req.body as { amount?: string; currency?: string };
    const numericAmount = Number.parseFloat(amount || "");
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const { paypalEnabled, clientId, clientSecret, mode } = await getPayPalConfig();
    if (!paypalEnabled) {
      return res.status(400).json({ error: "PayPal is disabled" });
    }
    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "PayPal credentials are not configured" });
    }

    try {
      const accessToken = await getPayPalAccessToken(clientId, clientSecret, mode);
      const response = await fetch(`${getPayPalApiBase(mode)}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: (currency || "USD").toUpperCase(),
                value: numericAmount.toFixed(2),
              },
            },
          ],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        return res.status(500).json({ error: `PayPal create order failed: ${text}` });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "PayPal create order failed" });
    }
  });

  app.post("/api/paypal/capture-order", async (req, res) => {
    const { orderId } = req.body as { orderId?: string };
    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    const { paypalEnabled, clientId, clientSecret, mode } = await getPayPalConfig();
    if (!paypalEnabled) {
      return res.status(400).json({ error: "PayPal is disabled" });
    }
    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "PayPal credentials are not configured" });
    }

    try {
      const accessToken = await getPayPalAccessToken(clientId, clientSecret, mode);
      const response = await fetch(`${getPayPalApiBase(mode)}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        return res.status(500).json({ error: `PayPal capture failed: ${text}` });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "PayPal capture failed" });
    }
  });

  app.get("/api/products", async (_req, res) => {
    const [products, variantsMap] = await Promise.all([
      storage.getProducts(),
      getProductColorVariantsMap(),
    ]);

    const response = products.map((product) => ({
      ...product,
      colorVariants: variantsMap.get(product.id) ?? [],
    }));
    res.json(response);
  });

  app.get("/api/products/:slug", async (req, res) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const colorVariants = await getProductColorVariants(product.id);
    res.json({ ...product, colorVariants });
  });

  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const parsed = insertProductSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

      const colorVariants = sanitizeProductColorVariants(req.body?.colorVariants);
      const product = await storage.createProduct(parsed.data);
      await saveProductColorVariants(product.id, colorVariants);

      res.status(201).json({ ...product, colorVariants });
    } catch (err) {
      console.error("Failed to create product:", err);
      res.status(500).json({ error: "Failed to save product" });
    }
  });

  app.patch("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

      const updateData = { ...(req.body as Record<string, unknown>) };
      const hasColorVariants = Object.prototype.hasOwnProperty.call(updateData, "colorVariants");
      delete updateData.colorVariants;

      const product = await storage.updateProduct(id, updateData as any);
      if (!product) return res.status(404).json({ error: "Product not found" });

      let colorVariants = await getProductColorVariants(id);
      if (hasColorVariants) {
        colorVariants = sanitizeProductColorVariants(req.body?.colorVariants);
        await saveProductColorVariants(id, colorVariants);
      }

      res.json({ ...product, colorVariants });
    } catch (err) {
      console.error("Failed to update product:", err);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await storage.deleteProduct(id);
    await saveProductColorVariants(id, []);
    res.status(204).send();
  });

  app.get("/api/orders", requireAdmin, async (_req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.post("/api/orders", async (req, res) => {
    const orderNumber = `NVZ-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`;
    const orderData = { ...req.body, orderNumber };
    const parsed = insertOrderSchema.safeParse(orderData);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const order = await storage.createOrder(parsed.data);

    // Simulate sending an email invoice
    console.log(`[EMAIL] Sending invoice for order ${order.orderNumber} to ${order.customerEmail}`);
    console.log(`[EMAIL] Details: ${order.items.length} items, Total: ${order.total}`);

    res.status(201).json(order);
  });

  app.patch("/api/orders/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const order = await storage.updateOrder(id, req.body);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });

  app.get("/api/reviews", async (_req, res) => {
    const reviews = await storage.getReviews();
    res.json(reviews);
  });

  app.post("/api/reviews", async (req, res) => {
    const parsed = insertReviewSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const review = await storage.createReview(parsed.data);
    res.status(201).json(review);
  });

  app.post("/api/subscribers", async (req, res) => {
    const parsed = insertSubscriberSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    try {
      const subscriber = await storage.createSubscriber(parsed.data);
      res.status(201).json(subscriber);
    } catch (error: any) {
      if (error.message?.includes("unique")) {
        return res.status(409).json({ error: "Already subscribed" });
      }
      throw error;
    }
  });

  app.get("/api/settings", async (_req, res) => {
    const settings = await storage.getSettings();
    const settingsObj: Record<string, string> = {};
    for (const s of settings) {
      settingsObj[s.key] = s.value;
    }
    res.json(settingsObj);
  });

  app.patch("/api/settings", requireAdmin, async (req, res) => {
    const updates = req.body as Record<string, string>;
    for (const [key, value] of Object.entries(updates)) {
      if (typeof key === "string" && typeof value === "string") {
        await storage.upsertSetting(key, value);
      }
    }
    const settings = await storage.getSettings();
    const settingsObj: Record<string, string> = {};
    for (const s of settings) {
      settingsObj[s.key] = s.value;
    }
    res.json(settingsObj);
  });

  app.delete("/api/orders", requireAdmin, async (_req, res) => {
    await storage.deleteAllOrders();
    res.status(204).send();
  });

  app.post("/api/contact", async (req, res) => {
    const parsed = insertContactSubmissionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const submission = await storage.createContactSubmission(parsed.data);
    res.status(201).json(submission);
  });

  app.get("/api/contact", requireAdmin, async (_req, res) => {
    const submissions = await storage.getContactSubmissions();
    res.json(submissions);
  });

  app.patch("/api/contact/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const submission = await storage.updateContactSubmission(id, req.body);
    if (!submission) return res.status(404).json({ error: "Submission not found" });
    res.json(submission);
  });

  app.delete("/api/contact/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await storage.deleteContactSubmission(id);
    res.status(204).send();
  });

  app.get("/api/track/:orderNumber", async (req, res) => {
    const order = await storage.getOrderByOrderNumber(req.params.orderNumber);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({
      orderNumber: order.orderNumber,
      status: order.status,
      items: order.items,
      total: order.total,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
    });
  });

  return httpServer;
}
