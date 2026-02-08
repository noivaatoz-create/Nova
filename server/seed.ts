import { db } from "./db";
import { products, reviews, orders } from "@shared/schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  const existingProducts = await db.select().from(products);
  if (existingProducts.length > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  const productData = [
    {
      name: "JetClean Pro",
      slug: "jetclean-pro",
      shortDescription: "Our flagship countertop water flosser with 10 pressure settings and smart sensor technology.",
      longDescription: "The JetClean Pro is the culmination of 3 years of R&D. Featuring our proprietary Hyper-Pulse engine delivering 1200 pulses per minute, 10 adjustable pressure settings, and a 600ml reservoir that lasts a full 90 seconds of continuous use. The smart pressure sensor warns you if you're pressing too hard, protecting sensitive gums while ensuring a thorough clean. IPX7 waterproof rating means it's fully shower-safe.",
      price: "89.99",
      compareAtPrice: "119.99",
      category: "Best Sellers",
      badge: "Flagship",
      image: "/images/jetclean-pro.png",
      stock: 150,
      specs: { "Pressure": "10-100 PSI", "Battery Life": "14 Days", "Tank Capacity": "600ml", "Modes": "10 Settings", "Weight": "350g", "Protection": "IPX7" },
      features: ["1200 pulses/min Hyper-Pulse engine", "Smart pressure sensor with LED feedback", "10 adjustable pressure settings", "600ml detachable reservoir", "IPX7 waterproof - shower safe", "USB-C fast charging", "Under 50db whisper-quiet operation"],
      whatsInBox: ["JetClean Pro Unit", "4x Replacement Nozzles", "USB-C Charging Cable", "Travel Pouch", "Quick Start Guide"],
    },
    {
      name: "TravelPulse Mini",
      slug: "travelpulse-mini",
      shortDescription: "Ultra-portable water flosser that fits in your pocket. Perfect for on-the-go oral care.",
      longDescription: "Don't let travel compromise your oral hygiene. The TravelPulse Mini packs our signature pulse technology into a device the size of an electric toothbrush. With a retractable nozzle, 200ml built-in reservoir, and 3 pressure modes, it delivers clinical-grade cleaning wherever life takes you. The telescoping design collapses to just 6 inches, fitting easily in any carry-on or gym bag.",
      price: "49.99",
      compareAtPrice: "69.99",
      category: "Portable",
      badge: "Best Seller",
      image: "/images/travelpulse-mini.png",
      stock: 200,
      specs: { "Pressure": "3 Modes", "Battery Life": "30 Days", "Tank Capacity": "200ml", "Modes": "3 Settings", "Weight": "180g", "Protection": "IPX6" },
      features: ["Telescoping design - collapses to 6 inches", "200ml built-in reservoir", "3 pressure modes (Soft, Normal, Pulse)", "30-day battery life on single charge", "Retractable nozzle for hygienic storage", "IPX6 water resistance"],
      whatsInBox: ["TravelPulse Mini Unit", "2x Replacement Nozzles", "USB-C Cable", "Travel Case"],
    },
    {
      name: "FamilyTank XL",
      slug: "familytank-xl",
      shortDescription: "Large-capacity countertop unit designed for the whole family with color-coded nozzles.",
      longDescription: "The FamilyTank XL is built for households that take oral health seriously. With a massive 1000ml reservoir that provides 2+ minutes of continuous use, 7 pressure levels, and 6 color-coded nozzles, every family member gets a personalized experience. The anti-slip base and extra-long cord make it perfect for any bathroom setup. Features our Hyper-Pulse Pro engine with gentle and deep-clean modes.",
      price: "129.99",
      category: "Family",
      badge: "Family",
      image: "/images/familytank-xl.png",
      stock: 80,
      specs: { "Pressure": "7 Levels", "Battery Life": "Corded", "Tank Capacity": "1000ml", "Modes": "7 Settings", "Weight": "680g", "Protection": "IPX5" },
      features: ["1000ml extra-large reservoir", "7 pressure levels including gentle mode", "6 color-coded nozzles included", "Anti-slip rubberized base", "Built-in nozzle storage compartment", "360-degree rotating nozzle tip"],
      whatsInBox: ["FamilyTank XL Unit", "6x Color-Coded Nozzles", "Power Adapter", "Nozzle Storage Dock", "User Manual"],
    },
    {
      name: "OrthoClean Tip Pack",
      slug: "orthoclean-tip-pack",
      shortDescription: "Specialized orthodontic nozzle tips for braces, bridges, and implants. Pack of 6.",
      longDescription: "Designed in collaboration with orthodontists, the OrthoClean tips feature a tapered design that slides easily under wires and around brackets. The precision tip creates a focused stream that dislodges food particles and plaque from the hardest-to-reach spots around braces, bridges, and dental implants. Compatible with all Novaatoz devices.",
      price: "19.99",
      category: "Accessories",
      badge: null,
      image: "/images/orthoclean-tips.png",
      stock: 300,
      specs: { "Quantity": "6 Tips", "Material": "Medical-Grade ABS", "Compatibility": "All Novaatoz Devices" },
      features: ["Tapered orthodontic design", "Medical-grade ABS plastic", "Color-coded for easy identification", "Compatible with all Novaatoz models", "BPA-free and FDA registered"],
      whatsInBox: ["6x OrthoClean Orthodontic Tips", "Storage Case"],
    },
    {
      name: "AquaFresh Tablets",
      slug: "aquafresh-tablets",
      shortDescription: "Effervescent cleaning tablets for your water flosser reservoir. Mint-infused. 30-day supply.",
      longDescription: "Keep your Novaatoz device sparkling clean and your mouth extra fresh with AquaFresh Tablets. Simply drop one tablet into your reservoir before filling with water. The effervescent formula dissolves in seconds, releasing a gentle mint-infused antibacterial solution that cleans your teeth while sanitizing your device's internal tubing. Each box contains a 30-day supply.",
      price: "14.99",
      category: "Accessories",
      badge: null,
      image: "/images/aquafresh-tablets.png",
      stock: 500,
      specs: { "Quantity": "30 Tablets", "Flavor": "Cool Mint", "Duration": "30-Day Supply" },
      features: ["Antibacterial cleaning formula", "Dissolves in seconds", "Cleans device while you floss", "Natural mint flavor", "Vegan and cruelty-free"],
      whatsInBox: ["30x AquaFresh Cleaning Tablets", "Usage Guide"],
    },
    {
      name: "NovaDock Charging Station",
      slug: "novadock-charging-station",
      shortDescription: "Premium wireless charging dock with UV-C sanitizer for your Novaatoz water flosser.",
      longDescription: "Elevate your bathroom counter with the NovaDock. This premium charging station wirelessly charges your JetClean Pro or TravelPulse Mini while simultaneously UV-C sanitizing the nozzle tips. The built-in UV-C LED kills 99.9% of bacteria in just 10 minutes. The sleek aluminum construction with ambient LED ring complements any bathroom aesthetic.",
      price: "39.99",
      category: "Accessories",
      badge: null,
      image: "/images/novadock.png",
      stock: 12,
      specs: { "Charging": "Wireless Qi", "UV-C": "99.9% Sanitization", "Material": "Aluminum Alloy", "Compatibility": "JetClean Pro, TravelPulse Mini" },
      features: ["Wireless Qi charging", "UV-C nozzle sanitization", "Premium aluminum construction", "Ambient LED status ring", "Compatible with JetClean Pro & TravelPulse Mini"],
      whatsInBox: ["NovaDock Station", "USB-C Power Cable", "Quick Start Guide"],
    },
  ];

  await db.insert(products).values(productData);
  console.log("Inserted products");

  const insertedProducts = await db.select().from(products);
  const jetClean = insertedProducts.find(p => p.slug === "jetclean-pro");
  const travelPulse = insertedProducts.find(p => p.slug === "travelpulse-mini");
  const familyTank = insertedProducts.find(p => p.slug === "familytank-xl");

  const reviewData = [
    { productId: jetClean!.id, customerName: "Sarah M.", rating: 5, title: "Game changer for my dental routine", body: "I've been using the JetClean Pro for 3 months and my dentist noticed a significant improvement in my gum health. The pressure settings are perfect - I started on 3 and now use 6 daily. Worth every penny.", verified: true },
    { productId: jetClean!.id, customerName: "David K.", rating: 5, title: "Quieter than expected", body: "I was skeptical about the 'whisper quiet' claim but it really is impressively silent. My old waterpik sounded like a jet engine in comparison. The USB-C charging is a nice modern touch too.", verified: true },
    { productId: jetClean!.id, customerName: "Lisa R.", rating: 4, title: "Great product, minor learning curve", body: "Took me a couple days to get the technique right without splashing water everywhere, but once I got the hang of it, amazing results. My teeth feel cleaner than ever.", verified: true },
    { productId: travelPulse!.id, customerName: "James W.", rating: 5, title: "Perfect travel companion", body: "I travel 3 weeks a month for work and this little device has been incredible. Battery lasts forever and it fits perfectly in my toiletry bag. No more skipping flossing on the road.", verified: true },
    { productId: travelPulse!.id, customerName: "Amy C.", rating: 5, title: "Surprisingly powerful for its size", body: "Don't let the small size fool you - this packs a real punch. I use it at the gym after lunch and it works just as well as my countertop unit at home.", verified: true },
    { productId: familyTank!.id, customerName: "Michael B.", rating: 5, title: "The whole family loves it", body: "Bought this for our family of 4. The color-coded nozzles are genius - no more arguing about whose is whose. The large tank means I don't have to refill mid-session.", verified: true },
    { productId: familyTank!.id, customerName: "Jennifer L.", rating: 4, title: "Excellent for braces", body: "My teenager has braces and this has been a lifesaver. The gentle mode is perfect for sensitive gums around the brackets. Only wish it was cordless, but the reservoir size makes up for it.", verified: true },
    { productId: jetClean!.id, customerName: "Robert T.", rating: 5, title: "Dentist recommended, I agree", body: "My hygienist specifically recommended a Novaatoz water flosser. After using it for 6 weeks, I can see why. My gum pockets have improved and no more bleeding during cleanings.", verified: true },
    { productId: travelPulse!.id, customerName: "Emma S.", rating: 4, title: "Love the design", body: "The telescoping design is so clever. It collapses down to nothing in my purse. The reservoir is small but enough for one thorough session. I bought a second one for my gym bag.", verified: true },
    { productId: jetClean!.id, customerName: "Chris P.", rating: 5, title: "Best investment in health", body: "I put off buying a water flosser for years. Now I can't believe I waited so long. The JetClean Pro feels premium and the results speak for themselves. My teeth have never felt cleaner.", verified: true },
  ];

  await db.insert(reviews).values(reviewData);
  console.log("Inserted reviews");

  const sampleOrders = [
    {
      orderNumber: "NVZ-SAMPLE-001",
      customerName: "Alex Johnson",
      customerEmail: "alex.j@example.com",
      shippingAddress: "123 Oak Street, San Francisco, CA 94102, US",
      items: [{ productId: jetClean!.id, name: "JetClean Pro", price: "89.99", quantity: 1, image: "/images/jetclean-pro.png" }],
      subtotal: "89.99",
      shipping: "0.00",
      tax: "7.20",
      total: "97.19",
      status: "delivered",
      paymentProvider: "stripe",
    },
    {
      orderNumber: "NVZ-SAMPLE-002",
      customerName: "Maria Garcia",
      customerEmail: "maria.g@example.com",
      shippingAddress: "456 Pine Ave, New York, NY 10001, US",
      items: [
        { productId: travelPulse!.id, name: "TravelPulse Mini", price: "49.99", quantity: 2, image: "/images/travelpulse-mini.png" },
        { productId: insertedProducts.find(p => p.slug === "aquafresh-tablets")!.id, name: "AquaFresh Tablets", price: "14.99", quantity: 1, image: "/images/aquafresh-tablets.png" },
      ],
      subtotal: "114.97",
      shipping: "0.00",
      tax: "9.20",
      total: "124.17",
      status: "shipped",
      paymentProvider: "paypal",
    },
    {
      orderNumber: "NVZ-SAMPLE-003",
      customerName: "James Wilson",
      customerEmail: "james.w@example.com",
      shippingAddress: "789 Maple Dr, Austin, TX 78701, US",
      items: [{ productId: familyTank!.id, name: "FamilyTank XL", price: "129.99", quantity: 1, image: "/images/familytank-xl.png" }],
      subtotal: "129.99",
      shipping: "0.00",
      tax: "10.40",
      total: "140.39",
      status: "paid",
      paymentProvider: "stripe",
    },
    {
      orderNumber: "NVZ-SAMPLE-004",
      customerName: "Sophie Chen",
      customerEmail: "sophie.c@example.com",
      shippingAddress: "321 Cedar Blvd, Seattle, WA 98101, US",
      items: [
        { productId: jetClean!.id, name: "JetClean Pro", price: "89.99", quantity: 1, image: "/images/jetclean-pro.png" },
        { productId: insertedProducts.find(p => p.slug === "novadock-charging-station")!.id, name: "NovaDock Charging Station", price: "39.99", quantity: 1, image: "/images/novadock.png" },
      ],
      subtotal: "129.98",
      shipping: "0.00",
      tax: "10.40",
      total: "140.38",
      status: "pending",
      paymentProvider: "stripe",
    },
  ];

  await db.insert(orders).values(sampleOrders);
  console.log("Inserted sample orders");

  console.log("Seeding complete!");
}

seed().catch(console.error).then(() => process.exit(0));
