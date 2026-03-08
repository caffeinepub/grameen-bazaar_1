import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Order } from "@/data/types";
import { formatDate, formatPriceFull } from "@/utils/format";
import {
  BadgeCheck,
  Ban,
  ChevronDown,
  ClipboardList,
  Package,
  RefreshCw,
  ShoppingBag,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const STATUS_OPTIONS: Order["status"][] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export function AdminDashboard() {
  const { lang, t } = useLanguage();
  const {
    vendors,
    products,
    orders,
    approveVendor,
    suspendVendor,
    rejectVendor,
    updateOrderStatus,
  } = useApp();

  const pendingVendors = vendors.filter((v) => v.status === "pending");
  const approvedVendors = vendors.filter((v) => v.status === "approved");
  const suspendedVendors = vendors.filter((v) => v.status === "suspended");

  const stats = [
    {
      label: lang === "hi" ? "कुल विक्रेता" : "Total Vendors",
      value: vendors.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: lang === "hi" ? "कुल उत्पाद" : "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-green-50 text-green-600",
    },
    {
      label: lang === "hi" ? "कुल ऑर्डर" : "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <main className="min-h-screen py-8" data-ocid="admin-dashboard.page">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-display text-2xl font-bold mb-6">
          {lang === "hi" ? "एडमिन पैनल" : "Admin Panel"}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 rounded-xl border border-border bg-card flex items-center gap-4"
              data-ocid="admin-dashboard.stat.card"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="vendors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="vendors"
              className="gap-2 text-xs sm:text-sm"
              data-ocid="admin-dashboard.vendors.tab"
            >
              <Users className="w-4 h-4" />
              {t.admin_vendors}
              {pendingVendors.length > 0 && (
                <span className="ml-1.5 text-xs bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5 font-semibold">
                  {pendingVendors.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="gap-2 text-xs sm:text-sm"
              data-ocid="admin-dashboard.orders.tab"
            >
              <ShoppingBag className="w-4 h-4" />
              {t.admin_all_orders}
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="gap-2 text-xs sm:text-sm"
              data-ocid="admin-dashboard.products.tab"
            >
              <Package className="w-4 h-4" />
              {t.admin_products}
            </TabsTrigger>
          </TabsList>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-4">
            <h2 className="font-semibold">{t.admin_vendors}</h2>
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="pending"
                  className="gap-1.5 text-xs sm:text-sm"
                  data-ocid="admin-dashboard.pending-vendors.tab"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  {lang === "hi" ? "प्रतीक्षारत" : "Pending"}
                  {pendingVendors.length > 0 && (
                    <span className="ml-1 text-xs bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5 font-semibold">
                      {pendingVendors.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="gap-1.5 text-xs sm:text-sm"
                  data-ocid="admin-dashboard.approved-vendors.tab"
                >
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {lang === "hi" ? "स्वीकृत" : "Approved"}
                </TabsTrigger>
                <TabsTrigger
                  value="suspended"
                  className="gap-1.5 text-xs sm:text-sm"
                  data-ocid="admin-dashboard.suspended-vendors.tab"
                >
                  <Ban className="w-3.5 h-3.5" />
                  {lang === "hi" ? "निलंबित" : "Suspended"}
                </TabsTrigger>
              </TabsList>

              {/* Pending Sub-tab */}
              <TabsContent value="pending" className="space-y-3">
                {pendingVendors.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card"
                    data-ocid="admin-dashboard.pending-vendors.empty_state"
                  >
                    <ClipboardList className="w-10 h-10 text-muted-foreground/40 mb-3" />
                    <p className="font-semibold text-sm">
                      {lang === "hi"
                        ? "कोई लंबित आवेदन नहीं"
                        : "No pending applications"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lang === "hi"
                        ? "नए विक्रेता आवेदन यहाँ दिखेंगे"
                        : "New vendor applications will appear here"}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border overflow-hidden bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-amber-50/50">
                          <TableHead>
                            {lang === "hi" ? "दुकान" : "Shop"}
                          </TableHead>
                          <TableHead>
                            {lang === "hi" ? "क्षेत्र" : "Region"}
                          </TableHead>
                          <TableHead>
                            {lang === "hi" ? "फ़ोन" : "Phone"}
                          </TableHead>
                          <TableHead>
                            {lang === "hi" ? "कार्रवाई" : "Actions"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingVendors.map((vendor, idx) => (
                          <TableRow
                            key={vendor.id}
                            data-ocid={`admin-dashboard.vendor.row.${idx + 1}`}
                          >
                            <TableCell>
                              <div>
                                <p className="font-semibold text-sm">
                                  {lang === "hi"
                                    ? vendor.shopNameHi
                                    : vendor.shopNameEn}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {lang === "hi"
                                    ? vendor.shopNameEn
                                    : vendor.shopNameHi}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {vendor.district}, {vendor.state}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {vendor.phone}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs gap-1 text-green-600 border-green-300 hover:bg-green-50"
                                  onClick={() => {
                                    approveVendor(vendor.id);
                                    toast.success(
                                      lang === "hi"
                                        ? "विक्रेता स्वीकृत!"
                                        : "Vendor approved!",
                                    );
                                  }}
                                  data-ocid={`admin-dashboard.vendor.approve_button.${idx + 1}`}
                                >
                                  <BadgeCheck className="w-3 h-3" />
                                  {lang === "hi" ? "स्वीकृत करें" : "Approve"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                                  onClick={() => {
                                    rejectVendor(vendor.id);
                                    toast.success(
                                      lang === "hi"
                                        ? "आवेदन अस्वीकृत।"
                                        : "Application rejected.",
                                    );
                                  }}
                                  data-ocid={`admin-dashboard.vendor.reject_button.${idx + 1}`}
                                >
                                  <Ban className="w-3 h-3" />
                                  {lang === "hi" ? "अस्वीकार" : "Reject"}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Approved Sub-tab */}
              <TabsContent value="approved" className="space-y-3">
                <div className="rounded-xl border border-border overflow-hidden bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>{lang === "hi" ? "दुकान" : "Shop"}</TableHead>
                        <TableHead>
                          {lang === "hi" ? "क्षेत्र" : "Region"}
                        </TableHead>
                        <TableHead>
                          {lang === "hi" ? "स्थिति" : "Status"}
                        </TableHead>
                        <TableHead>
                          {lang === "hi" ? "कार्रवाई" : "Actions"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedVendors.map((vendor, idx) => (
                        <TableRow
                          key={vendor.id}
                          data-ocid={`admin-dashboard.vendor.row.${idx + 1}`}
                        >
                          <TableCell>
                            <div>
                              <p className="font-semibold text-sm">
                                {lang === "hi"
                                  ? vendor.shopNameHi
                                  : vendor.shopNameEn}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {vendor.phone}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {vendor.district}, {vendor.state}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                {lang === "hi" ? "स्वीकृत" : "Approved"}
                              </Badge>
                              {vendor.isVerified && (
                                <BadgeCheck className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                              onClick={() => {
                                suspendVendor(vendor.id);
                                toast.success(
                                  `${vendor.shopNameEn} suspended.`,
                                );
                              }}
                              data-ocid={`admin-dashboard.vendor.delete_button.${idx + 1}`}
                            >
                              <Ban className="w-3 h-3" />
                              {t.admin_suspend}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Suspended Sub-tab */}
              <TabsContent value="suspended" className="space-y-3">
                {suspendedVendors.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card">
                    <Ban className="w-10 h-10 text-muted-foreground/40 mb-3" />
                    <p className="font-semibold text-sm">
                      {lang === "hi"
                        ? "कोई निलंबित विक्रेता नहीं"
                        : "No suspended vendors"}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border overflow-hidden bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>
                            {lang === "hi" ? "दुकान" : "Shop"}
                          </TableHead>
                          <TableHead>
                            {lang === "hi" ? "क्षेत्र" : "Region"}
                          </TableHead>
                          <TableHead>
                            {lang === "hi" ? "स्थिति" : "Status"}
                          </TableHead>
                          <TableHead>
                            {lang === "hi" ? "कार्रवाई" : "Actions"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {suspendedVendors.map((vendor, idx) => (
                          <TableRow
                            key={vendor.id}
                            data-ocid={`admin-dashboard.vendor.row.${idx + 1}`}
                          >
                            <TableCell>
                              <div>
                                <p className="font-semibold text-sm">
                                  {lang === "hi"
                                    ? vendor.shopNameHi
                                    : vendor.shopNameEn}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {vendor.phone}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {vendor.district}, {vendor.state}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700 border-red-200"
                              >
                                {lang === "hi" ? "निलंबित" : "Suspended"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1 text-green-600 border-green-300 hover:bg-green-50"
                                onClick={() => {
                                  approveVendor(vendor.id);
                                  toast.success(
                                    lang === "hi"
                                      ? "विक्रेता पुनः सक्रिय!"
                                      : `${vendor.shopNameEn} reactivated!`,
                                  );
                                }}
                                data-ocid={`admin-dashboard.vendor.reactivate_button.${idx + 1}`}
                              >
                                <RefreshCw className="w-3 h-3" />
                                {lang === "hi" ? "पुनः सक्रिय" : "Re-activate"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <h2 className="font-semibold">
              {t.admin_all_orders} ({orders.length})
            </h2>
            <div
              className="rounded-xl border border-border overflow-hidden bg-card"
              data-ocid="admin-dashboard.orders.table"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Order ID</TableHead>
                    <TableHead>{lang === "hi" ? "खरीदार" : "Buyer"}</TableHead>
                    <TableHead>{lang === "hi" ? "कुल" : "Total"}</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>{lang === "hi" ? "भुगतान" : "Payment"}</TableHead>
                    <TableHead>{lang === "hi" ? "तारीख" : "Date"}</TableHead>
                    <TableHead>{lang === "hi" ? "अपडेट" : "Update"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, idx) => (
                    <TableRow
                      key={order.id}
                      data-ocid={`admin-dashboard.order.row.${idx + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {order.id.slice(0, 10)}...
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.buyerName}
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        {formatPriceFull(order.total)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {order.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(v) => {
                            updateOrderStatus(order.id, v as Order["status"]);
                            toast.success("Status updated");
                          }}
                        >
                          <SelectTrigger
                            className="h-7 w-28 text-xs"
                            data-ocid={`admin-dashboard.order-status.select.${idx + 1}`}
                          >
                            <SelectValue />
                            <ChevronDown className="w-3 h-3 opacity-50" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <h2 className="font-semibold">
              {t.admin_products} ({products.length})
            </h2>
            <div
              className="rounded-xl border border-border overflow-hidden bg-card"
              data-ocid="admin-dashboard.products.table"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{lang === "hi" ? "उत्पाद" : "Product"}</TableHead>
                    <TableHead>{lang === "hi" ? "श्रेणी" : "Category"}</TableHead>
                    <TableHead>{lang === "hi" ? "मूल्य" : "Price"}</TableHead>
                    <TableHead>{lang === "hi" ? "स्टॉक" : "Stock"}</TableHead>
                    <TableHead>{lang === "hi" ? "राज्य" : "State"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, idx) => (
                    <TableRow
                      key={product.id}
                      data-ocid={`admin-dashboard.product.row.${idx + 1}`}
                    >
                      <TableCell>
                        <p className="font-semibold text-sm">
                          {lang === "hi" ? product.nameHi : product.nameEn}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        {formatPriceFull(product.price)}/{product.unit}
                      </TableCell>
                      <TableCell className="text-sm">
                        <span
                          className={
                            product.stock > 10
                              ? "text-green-600"
                              : "text-amber-600"
                          }
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {product.state}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
