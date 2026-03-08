import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CATEGORIES } from "@/data/mockData";
import type { Order, Product } from "@/data/types";
import { formatDate, formatPriceFull, generateId } from "@/utils/format";
import {
  ChevronRight,
  Loader2,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS: Order["status"][] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

type ProductFormData = {
  nameEn: string;
  nameHi: string;
  descriptionEn: string;
  descriptionHi: string;
  price: string;
  unit: string;
  category: string;
  stock: string;
};

const defaultForm: ProductFormData = {
  nameEn: "",
  nameHi: "",
  descriptionEn: "",
  descriptionHi: "",
  price: "",
  unit: "kg",
  category: "Vegetables",
  stock: "",
};

export function VendorDashboard() {
  const { lang, t } = useLanguage();
  const {
    user,
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    vendors,
  } = useApp();

  const vendorId = user?.vendorId ?? "v1";
  const vendor = vendors.find((v) => v.id === vendorId);
  const vendorProducts = products.filter((p) => p.vendorId === vendorId);
  const vendorOrders = orders.filter((o) =>
    o.items.some((i) => vendorProducts.find((p) => p.id === i.productId)),
  );

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  const [profileShopName, setProfileShopName] = useState(
    vendor ? (lang === "hi" ? vendor.shopNameHi : vendor.shopNameEn) : "",
  );
  const [profilePhone, setProfilePhone] = useState(vendor?.phone ?? "");

  const openAddDialog = () => {
    setEditingProduct(null);
    setForm(defaultForm);
    setProductDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setForm({
      nameEn: product.nameEn,
      nameHi: product.nameHi,
      descriptionEn: product.descriptionEn,
      descriptionHi: product.descriptionHi,
      price: String(product.price / 100),
      unit: product.unit,
      category: product.category,
      stock: String(product.stock),
    });
    setProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!form.nameEn || !form.price || !form.stock) {
      toast.error("Please fill in required fields");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        nameEn: form.nameEn,
        nameHi: form.nameHi || form.nameEn,
        descriptionEn: form.descriptionEn,
        descriptionHi: form.descriptionHi || form.descriptionEn,
        price: Math.round(Number.parseFloat(form.price) * 100),
        unit: form.unit,
        category: form.category,
        stock: Number.parseInt(form.stock, 10),
      });
      toast.success("Product updated!");
    } else {
      addProduct({
        id: generateId("prod"),
        nameEn: form.nameEn,
        nameHi: form.nameHi || form.nameEn,
        descriptionEn: form.descriptionEn,
        descriptionHi: form.descriptionHi || form.descriptionEn,
        price: Math.round(Number.parseFloat(form.price) * 100),
        unit: form.unit,
        category: form.category,
        stock: Number.parseInt(form.stock, 10),
        vendorId,
        state: vendor?.state ?? "Uttar Pradesh",
        district: vendor?.district ?? "Varanasi",
        village: vendor?.village ?? "",
        rating: 0,
        reviewCount: 0,
      });
      toast.success("Product added!");
    }

    setSaving(false);
    setProductDialogOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    toast.success("Product removed");
  };

  const handleStatusUpdate = (orderId: string, status: Order["status"]) => {
    updateOrderStatus(orderId, status);
    toast.success(`Order status updated to ${status}`);
  };

  return (
    <main className="min-h-screen py-8" data-ocid="vendor-dashboard.page">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
            🏪
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">
              {lang === "hi" ? "विक्रेता डैशबोर्ड" : "Vendor Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {vendor
                ? lang === "hi"
                  ? vendor.shopNameHi
                  : vendor.shopNameEn
                : user?.name}
            </p>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="products"
              className="gap-2 text-xs sm:text-sm"
              data-ocid="vendor-dashboard.products.tab"
            >
              <Package className="w-4 h-4" />
              {t.vendor_products}
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="gap-2 text-xs sm:text-sm"
              data-ocid="vendor-dashboard.orders.tab"
            >
              <ShoppingBag className="w-4 h-4" />
              {t.vendor_orders}
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="gap-2 text-xs sm:text-sm"
              data-ocid="vendor-dashboard.profile.tab"
            >
              <User className="w-4 h-4" />
              {t.buyer_profile}
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">
                {t.vendor_products} ({vendorProducts.length})
              </h2>
              <Button
                size="sm"
                className="gap-2"
                onClick={openAddDialog}
                data-ocid="vendor-dashboard.add-product.button"
              >
                <Plus className="w-4 h-4" />
                {t.vendor_add_product}
              </Button>
            </div>

            {vendorProducts.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="vendor-dashboard.products.empty_state"
              >
                <Package className="w-12 h-12 mx-auto mb-3" />
                <p>
                  {lang === "hi"
                    ? "अभी कोई उत्पाद नहीं। पहला उत्पाद जोड़ें!"
                    : "No products yet. Add your first product!"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {vendorProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                      data-ocid={`vendor-dashboard.product.item.${idx + 1}`}
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.nameEn}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            🛒
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {lang === "hi" ? product.nameHi : product.nameEn}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.category} · {product.stock}{" "}
                          {lang === "hi" ? "स्टॉक में" : "in stock"}
                        </p>
                        <p className="text-primary font-bold text-sm">
                          {formatPriceFull(product.price)}/{product.unit}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => openEditDialog(product)}
                          data-ocid={`vendor-dashboard.product.edit_button.${idx + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
                              data-ocid={`vendor-dashboard.product.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent data-ocid="vendor-dashboard.delete-product.dialog">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Product
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "
                                {product.nameEn}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel data-ocid="vendor-dashboard.delete-product.cancel_button">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                data-ocid="vendor-dashboard.delete-product.confirm_button"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <h2 className="font-semibold">
              {t.vendor_incoming_orders} ({vendorOrders.length})
            </h2>

            {vendorOrders.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="vendor-dashboard.orders.empty_state"
              >
                <ShoppingBag className="w-12 h-12 mx-auto mb-3" />
                <p>{lang === "hi" ? "अभी कोई ऑर्डर नहीं।" : "No orders yet."}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vendorOrders.map((order, idx) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-border bg-card space-y-3"
                    data-ocid={`vendor-dashboard.order.item.${idx + 1}`}
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">
                            #{order.id}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm font-medium">{order.buyerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <p className="font-bold text-primary">
                        {formatPriceFull(order.total)}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      {order.items.map((item) => (
                        <p key={item.productId}>
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {t.vendor_update_status}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {STATUS_OPTIONS.filter((s) => s !== order.status).map(
                          (status) => (
                            <Button
                              key={status}
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() =>
                                handleStatusUpdate(order.id, status)
                              }
                              data-ocid={`vendor-dashboard.order-status.button.${idx + 1}`}
                            >
                              {status}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <h2 className="font-semibold">
                {lang === "hi" ? "दुकान की जानकारी" : "Shop Information"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{lang === "hi" ? "दुकान का नाम" : "Shop Name"}</Label>
                  <Input
                    value={profileShopName}
                    onChange={(e) => setProfileShopName(e.target.value)}
                    data-ocid="vendor-dashboard.shop-name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.checkout_phone}</Label>
                  <Input
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    data-ocid="vendor-dashboard.phone.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.filter_state}</Label>
                  <Input
                    value={vendor?.state ?? ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.filter_district}</Label>
                  <Input
                    value={vendor?.district ?? ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <Button
                onClick={() => toast.success("Profile saved!")}
                className="gap-2"
                data-ocid="vendor-dashboard.profile.save_button"
              >
                {t.save_changes}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="vendor-dashboard.product-form.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? t.vendor_edit_product : t.vendor_add_product}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t.vendor_product_name} (English) *</Label>
                <Input
                  value={form.nameEn}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nameEn: e.target.value }))
                  }
                  placeholder="e.g. Fresh Tomatoes"
                  data-ocid="vendor-dashboard.product-name-en.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t.vendor_product_name} (हिंदी)</Label>
                <Input
                  value={form.nameHi}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nameHi: e.target.value }))
                  }
                  placeholder="e.g. ताज़े टमाटर"
                  data-ocid="vendor-dashboard.product-name-hi.input"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{t.vendor_description} (English)</Label>
              <Textarea
                value={form.descriptionEn}
                onChange={(e) =>
                  setForm((p) => ({ ...p, descriptionEn: e.target.value }))
                }
                rows={2}
                data-ocid="vendor-dashboard.product-desc.textarea"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>{t.vendor_price} (₹) *</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="e.g. 40"
                  data-ocid="vendor-dashboard.product-price.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Input
                  value={form.unit}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, unit: e.target.value }))
                  }
                  placeholder="kg, piece..."
                  data-ocid="vendor-dashboard.product-unit.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t.vendor_stock} *</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, stock: e.target.value }))
                  }
                  placeholder="e.g. 50"
                  data-ocid="vendor-dashboard.product-stock.input"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{t.vendor_category}</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger data-ocid="vendor-dashboard.product-category.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setProductDialogOpen(false)}
              className="gap-2"
              data-ocid="vendor-dashboard.product-form.cancel_button"
            >
              <X className="w-4 h-4" />
              {t.vendor_cancel}
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={saving}
              className="gap-2"
              data-ocid="vendor-dashboard.product-form.save_button"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {t.vendor_save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
