import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPriceFull } from "@/utils/format";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function CartPage() {
  const { lang, t } = useLanguage();
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        data-ocid="cart.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
          data-ocid="cart.empty_state"
        >
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="font-display text-2xl font-bold">{t.cart_empty}</h2>
          <p className="text-muted-foreground">
            {lang === "hi"
              ? "खरीदारी शुरू करें और अपने पसंदीदा उत्पाद जोड़ें।"
              : "Start shopping and add your favourite products."}
          </p>
          <Link
            to="/products"
            search={{ category: undefined }}
            data-ocid="cart.continue-shopping.button"
          >
            <Button className="gap-2 mt-2">
              <ArrowLeft className="w-4 h-4" />
              {t.cart_continue_shopping}
            </Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8" data-ocid="cart.page">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold mb-2">{t.cart_title}</h1>
        <p className="text-muted-foreground mb-6">
          {itemCount} {t.cart_items}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item, idx) => {
                const name =
                  lang === "hi" ? item.product.nameHi : item.product.nameEn;
                return (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4 p-4 rounded-xl border border-border bg-card"
                    data-ocid={`cart.item.${idx + 1}`}
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🛒
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {item.product.district}, {item.product.state}
                      </p>
                      <p className="text-primary font-bold mt-1">
                        {formatPriceFull(item.product.price)}/
                        {item.product.unit}
                      </p>

                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-border rounded-lg overflow-hidden text-sm">
                          <button
                            type="button"
                            className="px-2.5 py-1 hover:bg-muted transition-colors disabled:opacity-50"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            data-ocid={`cart.qty-dec.button.${idx + 1}`}
                          >
                            −
                          </button>
                          <span className="px-3 py-1 border-x border-border min-w-[2.5rem] text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="px-2.5 py-1 hover:bg-muted transition-colors disabled:opacity-50"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock}
                            data-ocid={`cart.qty-inc.button.${idx + 1}`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors"
                          onClick={() => removeFromCart(item.product.id)}
                          data-ocid={`cart.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {t.cart_remove}
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right shrink-0">
                      <span className="font-bold text-base">
                        {formatPriceFull(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <Link
              to="/products"
              search={{ category: undefined }}
              data-ocid="cart.continue-shopping.link"
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.cart_continue_shopping}
              </Button>
            </Link>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div
              className="p-5 rounded-xl border border-border bg-card sticky top-24"
              data-ocid="cart.summary.card"
            >
              <h2 className="font-semibold text-lg mb-4">
                {lang === "hi" ? "ऑर्डर सारांश" : "Order Summary"}
              </h2>

              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-muted-foreground"
                  >
                    <span className="truncate flex-1 mr-2">
                      {lang === "hi"
                        ? item.product.nameHi
                        : item.product.nameEn}{" "}
                      × {item.quantity}
                    </span>
                    <span className="shrink-0">
                      {formatPriceFull(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-base">
                <span>{t.cart_subtotal}</span>
                <span className="text-primary">{formatPriceFull(total)}</span>
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                {lang === "hi"
                  ? "डिलीवरी शुल्क चेकआउट पर जोड़ा जाएगा"
                  : "Delivery charges added at checkout"}
              </p>

              <Button
                className="w-full mt-4 gap-2"
                size="lg"
                onClick={() => navigate({ to: "/checkout" })}
                data-ocid="cart.checkout.primary_button"
              >
                {t.cart_checkout}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
