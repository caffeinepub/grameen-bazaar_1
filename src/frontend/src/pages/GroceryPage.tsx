import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Product } from "@/data/types";
import { formatPrice } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

// ─── Subcategory definition ──────────────────────────────────────────────────

interface Subcategory {
  id: string;
  labelEn: string;
  labelHi: string;
  match: (name: string) => boolean;
}

const SUBCATEGORIES: Subcategory[] = [
  {
    id: "all",
    labelEn: "All",
    labelHi: "सभी",
    match: () => true,
  },
  {
    id: "staples",
    labelEn: "Staples",
    labelHi: "मुख्य सामान",
    match: (name) => /atta|dal|sugar|khand|salt/i.test(name),
  },
  {
    id: "oils",
    labelEn: "Oils & Ghee",
    labelHi: "तेल व घी",
    match: (name) => /oil|ghee/i.test(name),
  },
  {
    id: "beverages",
    labelEn: "Beverages",
    labelHi: "पेय",
    match: (name) => /tea|coffee|chai/i.test(name),
  },
  {
    id: "personalcare",
    labelEn: "Personal Care",
    labelHi: "व्यक्तिगत देखभाल",
    match: (name) => /soap|shampoo|neem|tulsi/i.test(name),
  },
];

// ─── Quantity stepper / quick-add button ─────────────────────────────────────

interface QuickAddProps {
  product: Product;
  index: number;
}

function QuickAdd({ product, index }: QuickAddProps) {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.nameEn} added to cart!`, { duration: 1800 });
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, qty + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty <= 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, qty - 1);
    }
  };

  if (product.stock === 0) {
    return (
      <span className="text-xs text-muted-foreground font-medium">
        Out of stock
      </span>
    );
  }

  if (qty > 0) {
    return (
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-1 bg-primary rounded-full"
      >
        <button
          type="button"
          onClick={handleDecrease}
          className="w-7 h-7 flex items-center justify-center text-primary-foreground hover:bg-primary/80 rounded-full transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-primary-foreground font-bold text-sm min-w-[1.25rem] text-center">
          {qty}
        </span>
        <button
          type="button"
          onClick={handleIncrease}
          className="w-7 h-7 flex items-center justify-center text-primary-foreground hover:bg-primary/80 rounded-full transition-colors"
          aria-label="Increase quantity"
          data-ocid={`grocery.product.add_button.${index}`}
        >
          <Plus className="w-3 h-3" />
        </button>
      </motion.div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
      aria-label="Add to cart"
      data-ocid={`grocery.product.add_button.${index}`}
    >
      <Plus className="w-4 h-4" />
    </button>
  );
}

// ─── Compact grocery product card ────────────────────────────────────────────

interface GroceryCardProps {
  product: Product;
  index: number;
}

function GroceryCard({ product, index }: GroceryCardProps) {
  const { lang } = useLanguage();
  const name = lang === "hi" ? product.nameHi : product.nameEn;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative bg-card rounded-2xl border border-border/60 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      data-ocid={`grocery.product.card.${index}`}
    >
      <Link to="/products/$id" params={{ id: product.id }} className="block">
        {/* Product image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              🛒
            </div>
          )}

          {/* Fast delivery chip */}
          {product.stock > 0 && (
            <div className="absolute top-2 left-2">
              <span className="flex items-center gap-1 bg-teal-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                <Zap className="w-2.5 h-2.5" />
                {lang === "hi" ? "जल्दी" : "Fast"}
              </span>
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">
                {lang === "hi" ? "स्टॉक खत्म" : "Out of Stock"}
              </span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-3">
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground mb-1">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-primary text-base">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-muted-foreground ml-0.5">
                /{product.unit}
              </span>
            </div>
            {/* Quick add — stopPropagation is handled inside QuickAdd handlers */}
            <QuickAdd product={product} index={index} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Products grid for a given subcategory ───────────────────────────────────

interface GroceryGridProps {
  products: Product[];
  emptyLabel: string;
}

function GroceryGrid({ products, emptyLabel }: GroceryGridProps) {
  if (products.length === 0) {
    return (
      <div
        className="py-16 text-center text-muted-foreground"
        data-ocid="grocery.empty_state"
      >
        <div className="text-5xl mb-3">🛒</div>
        <p className="text-sm">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      <AnimatePresence mode="popLayout">
        {products.map((p, i) => (
          <GroceryCard key={p.id} product={p} index={i + 1} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Main GroceryPage ─────────────────────────────────────────────────────────

export function GroceryPage() {
  const { lang } = useLanguage();
  const { products } = useApp();
  const { itemCount } = useCart();

  const groceryProducts = products.filter((p) => p.category === "Grocery");

  const getFilteredProducts = (subId: string): Product[] => {
    const sub = SUBCATEGORIES.find((s) => s.id === subId);
    if (!sub || sub.id === "all") return groceryProducts;
    return groceryProducts.filter((p) => sub.match(p.nameEn));
  };

  return (
    <main className="min-h-screen bg-background" data-ocid="grocery.page">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/grocery-hero-banner.dim_1200x400.jpg"
            alt="Grocery essentials from your kirana store"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/85 via-teal-800/70 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl"
          >
            {/* Fast delivery badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-1.5 bg-teal-400/25 border border-teal-300/40 backdrop-blur-sm rounded-full px-3 py-1 text-teal-100 text-xs font-semibold mb-3"
            >
              <Zap className="w-3.5 h-3.5 text-teal-300" />
              {lang === "hi" ? "जल्दी डिलीवरी" : "Fast Delivery"}
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-2">
              {lang === "hi" ? "किराना सामान" : "Grocery Essentials"}
            </h1>
            <p className="text-teal-100/85 text-base md:text-lg leading-relaxed mb-6">
              {lang === "hi"
                ? "आपके पड़ोस की किराना दुकान से ताज़ा"
                : "Fresh from your neighbourhood kirana store"}
            </p>

            <div className="flex items-center gap-3">
              {itemCount > 0 && (
                <Link to="/cart" data-ocid="grocery.cart.link">
                  <Button
                    size="sm"
                    className="gap-2 bg-white text-teal-800 hover:bg-white/90 font-semibold shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {lang === "hi"
                      ? `कार्ट देखें (${itemCount})`
                      : `View Cart (${itemCount})`}
                  </Button>
                </Link>
              )}
              <Badge
                variant="secondary"
                className="bg-teal-700/50 text-teal-100 border-teal-600/40 text-xs"
              >
                {groceryProducts.length} {lang === "hi" ? "उत्पाद" : "products"}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Subcategory Tabs + Product Grid ── */}
      <section className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all">
          <div className="overflow-x-auto pb-1 -mx-4 px-4">
            <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 gap-1 h-auto p-1 bg-muted rounded-xl mb-6">
              {SUBCATEGORIES.map((sub) => (
                <TabsTrigger
                  key={sub.id}
                  value={sub.id}
                  className="rounded-lg px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  data-ocid="grocery.tab"
                >
                  {lang === "hi" ? sub.labelHi : sub.labelEn}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {SUBCATEGORIES.map((sub) => (
            <TabsContent key={sub.id} value={sub.id} className="mt-0">
              <GroceryGrid
                products={getFilteredProducts(sub.id)}
                emptyLabel={
                  lang === "hi"
                    ? "इस श्रेणी में कोई उत्पाद नहीं"
                    : "No products in this category"
                }
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* ── Floating cart bar (appears when items in cart) ── */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <Link to="/cart" data-ocid="grocery.cart.link">
              <div className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-2xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                <ShoppingCart className="w-4 h-4" />
                <span>
                  {lang === "hi"
                    ? `${itemCount} आइटम — चेकआउट करें`
                    : `${itemCount} item${itemCount !== 1 ? "s" : ""} — Checkout`}
                </span>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
