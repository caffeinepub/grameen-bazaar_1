import type React from "react";
import { createContext, useContext, useState } from "react";
import { ORDERS, PRODUCTS, REVIEWS, VENDORS } from "../data/mockData";
import type { Order, Product, Review, UserProfile } from "../data/types";
import type { Vendor } from "../data/types";

interface AppContextType {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  orders: Order[];
  setOrders: (o: Order[]) => void;
  reviews: Review[];
  setReviews: (r: Review[]) => void;
  vendors: Vendor[];
  setVendors: (v: Vendor[]) => void;
  addOrder: (o: Order) => void;
  addReview: (r: Review) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (productId: string) => void;
  approveVendor: (vendorId: string) => void;
  suspendVendor: (vendorId: string) => void;
  rejectVendor: (vendorId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [vendors, setVendors] = useState<Vendor[]>(VENDORS);

  const addOrder = (o: Order) => setOrders((prev) => [o, ...prev]);

  const addReview = (r: Review) => setReviews((prev) => [...prev, r]);

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  };

  const addProduct = (p: Product) => setProducts((prev) => [p, ...prev]);

  const updateProduct = (p: Product) => {
    setProducts((prev) =>
      prev.map((existing) => (existing.id === p.id ? p : existing)),
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const approveVendor = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, isApproved: true, status: "approved" as const }
          : v,
      ),
    );
  };

  const suspendVendor = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, isApproved: false, status: "suspended" as const }
          : v,
      ),
    );
  };

  const rejectVendor = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, isApproved: false, status: "suspended" as const }
          : v,
      ),
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        products,
        setProducts,
        orders,
        setOrders,
        reviews,
        setReviews,
        vendors,
        setVendors,
        addOrder,
        addReview,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        approveVendor,
        suspendVendor,
        rejectVendor,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
