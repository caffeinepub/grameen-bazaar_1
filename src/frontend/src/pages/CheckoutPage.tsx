import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { INDIAN_STATES } from "@/data/mockData";
import type { Order } from "@/data/types";
import { formatPriceFull, generateId } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type PaymentMethod = "Online" | "COD";

export function CheckoutPage() {
  const { lang, t } = useLanguage();
  const { items, total, clearCart } = useCart();
  const { user, addOrder } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    address: "",
    city: "",
    state: user?.state ?? "",
    pincode: "",
  });

  const setField =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handlePlaceOrder = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      toast.error("Please fill in all delivery details");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    if (paymentMethod === "Online") {
      // Simulate Stripe redirect
      await new Promise((r) => setTimeout(r, 1500));
      toast.info(
        "Stripe payment integration ready — placing order directly for demo.",
      );
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }

    const order: Order = {
      id: generateId("ord"),
      buyerId: user?.id ?? "guest",
      buyerName: form.name,
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
        name: lang === "hi" ? i.product.nameHi : i.product.nameEn,
      })),
      total,
      status: "Pending",
      paymentMethod,
      createdAt: new Date().toISOString(),
      address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
    };

    addOrder(order);
    clearCart();
    setLoading(false);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <main
        className="min-h-screen flex items-center justify-center py-12"
        data-ocid="checkout.success.section"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4 space-y-5"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold">
            {t.checkout_success_title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {t.checkout_success_msg}
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/dashboard/buyer"
              data-ocid="checkout.view-orders.primary_button"
            >
              <Button className="w-full">{t.checkout_view_orders}</Button>
            </Link>
            <Link
              to="/products"
              search={{ category: undefined }}
              data-ocid="checkout.continue-shopping.button"
            >
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t.cart_continue_shopping}
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8" data-ocid="checkout.page">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/cart" data-ocid="checkout.back.link">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="font-display text-3xl font-bold">
            {t.checkout_title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <section
              className="p-5 rounded-xl border border-border bg-card space-y-4"
              data-ocid="checkout.address.section"
            >
              <h2 className="font-semibold text-base">
                {t.checkout_delivery_address}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{t.checkout_full_name}</Label>
                  <Input
                    value={form.name}
                    onChange={setField("name")}
                    placeholder="Priya Sharma"
                    data-ocid="checkout.name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.checkout_phone}</Label>
                  <Input
                    value={form.phone}
                    onChange={setField("phone")}
                    placeholder="+91 98765 43210"
                    data-ocid="checkout.phone.input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{t.checkout_address}</Label>
                <Input
                  value={form.address}
                  onChange={setField("address")}
                  placeholder="House No, Street, Area"
                  data-ocid="checkout.address.input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>{t.checkout_city}</Label>
                  <Input
                    value={form.city}
                    onChange={setField("city")}
                    placeholder="Varanasi"
                    data-ocid="checkout.city.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.checkout_state}</Label>
                  <Select
                    value={form.state}
                    onValueChange={(v) => setForm((p) => ({ ...p, state: v }))}
                  >
                    <SelectTrigger data-ocid="checkout.state.select">
                      <SelectValue placeholder={t.checkout_state} />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t.checkout_pincode}</Label>
                  <Input
                    value={form.pincode}
                    onChange={setField("pincode")}
                    placeholder="221001"
                    maxLength={6}
                    data-ocid="checkout.pincode.input"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section
              className="p-5 rounded-xl border border-border bg-card space-y-4"
              data-ocid="checkout.payment.section"
            >
              <h2 className="font-semibold text-base">
                {t.checkout_payment_method}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === "COD"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  data-ocid="checkout.cod.toggle"
                >
                  <Banknote
                    className={`w-6 h-6 ${paymentMethod === "COD" ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <div>
                    <p className="font-medium text-sm">{t.checkout_pay_cod}</p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "hi" ? "डिलीवरी पर नकद" : "Pay when delivered"}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("Online")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === "Online"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  data-ocid="checkout.online.toggle"
                >
                  <CreditCard
                    className={`w-6 h-6 ${paymentMethod === "Online" ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {t.checkout_pay_online}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "hi"
                        ? "कार्ड / UPI / नेट बैंकिंग"
                        : "Card / UPI / Net Banking"}
                    </p>
                  </div>
                </button>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div>
            <div
              className="p-5 rounded-xl border border-border bg-card sticky top-24 space-y-4"
              data-ocid="checkout.summary.card"
            >
              <h2 className="font-semibold text-base">
                {t.checkout_order_summary}
              </h2>

              <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
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

              <Separator />

              <div className="flex justify-between font-bold">
                <span>{t.checkout_total}</span>
                <span className="text-primary">{formatPriceFull(total)}</span>
              </div>

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
                data-ocid="checkout.place-order.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.loading}
                  </>
                ) : (
                  t.checkout_place_order
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
