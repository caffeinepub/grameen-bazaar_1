export interface Product {
  id: string;
  nameEn: string;
  nameHi: string;
  descriptionEn: string;
  descriptionHi: string;
  price: number; // in paise
  unit: string;
  category: string;
  stock: number;
  vendorId: string;
  state: string;
  district: string;
  village: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
}

export interface Vendor {
  id: string;
  shopNameEn: string;
  shopNameHi: string;
  description: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  isApproved: boolean;
  isVerified: boolean;
  status: "pending" | "approved" | "suspended";
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  items: { productId: string; quantity: number; price: number; name: string }[];
  total: number;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: "Online" | "COD";
  createdAt: string;
  address: string;
}

export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: "buyer" | "vendor" | "admin";
  state?: string;
  district?: string;
  village?: string;
  vendorId?: string;
}
