import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate, formatPriceFull } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Package, ShoppingBag, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function BuyerDashboard() {
  const { lang, t } = useLanguage();
  const { user, setUser, orders } = useApp();

  const buyerOrders = orders.filter(
    (o) => o.buyerId === (user?.id ?? "buyer1"),
  );

  const [profileName, setProfileName] = useState(user?.name ?? "");
  const [profilePhone, setProfilePhone] = useState(user?.phone ?? "");
  const [profileState, setProfileState] = useState(user?.state ?? "");

  const handleSaveProfile = () => {
    if (user) {
      setUser({
        ...user,
        name: profileName,
        phone: profilePhone,
        state: profileState,
      });
      toast.success("Profile updated!");
    }
  };

  return (
    <main className="min-h-screen py-8" data-ocid="buyer-dashboard.page">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">
              {lang === "hi"
                ? `नमस्ते, ${user?.name ?? "Guest"}!`
                : `Hello, ${user?.name ?? "Guest"}!`}
            </h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="orders"
              className="gap-2"
              data-ocid="buyer-dashboard.orders.tab"
            >
              <Package className="w-4 h-4" />
              {t.buyer_orders}
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="gap-2"
              data-ocid="buyer-dashboard.profile.tab"
            >
              <User className="w-4 h-4" />
              {t.buyer_profile}
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <h2 className="font-semibold text-base">{t.buyer_order_history}</h2>

            {buyerOrders.length === 0 ? (
              <div
                className="text-center py-16 space-y-3"
                data-ocid="buyer-dashboard.orders.empty_state"
              >
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">{t.buyer_no_orders}</p>
                <Link to="/products" search={{ category: undefined }}>
                  <Button size="sm" className="gap-2 mt-2">
                    {t.hero_browse_products}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {buyerOrders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl border border-border bg-card"
                    data-ocid={`buyer-dashboard.order.item.${idx + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            #{order.id}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                        <div className="text-sm space-y-0.5">
                          {order.items.map((item) => (
                            <p
                              key={item.productId}
                              className="text-muted-foreground"
                            >
                              {item.name} × {item.quantity}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-primary">
                          {formatPriceFull(order.total)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.paymentMethod === "COD"
                            ? "Cash on Delivery"
                            : "Online Payment"}
                        </p>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <p className="text-xs text-muted-foreground">
                      {order.address}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <h2 className="font-semibold">{t.buyer_profile}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{t.auth_name}</Label>
                  <Input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    data-ocid="buyer-dashboard.profile-name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.checkout_phone}</Label>
                  <Input
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    data-ocid="buyer-dashboard.profile-phone.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.auth_email}</Label>
                  <Input
                    value={user?.email ?? ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.filter_state}</Label>
                  <Input
                    value={profileState}
                    onChange={(e) => setProfileState(e.target.value)}
                    data-ocid="buyer-dashboard.profile-state.input"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                className="gap-2"
                data-ocid="buyer-dashboard.profile.save_button"
              >
                {t.save_changes}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
