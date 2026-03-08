import type React from "react";
import { createContext, useContext, useState } from "react";

type Language = "en" | "hi";

interface Translations {
  // Navigation
  nav_home: string;
  nav_products: string;
  nav_cart: string;
  nav_login: string;
  nav_signup: string;
  nav_logout: string;
  nav_buyer_dashboard: string;
  nav_vendor_dashboard: string;
  nav_admin_dashboard: string;
  nav_profile: string;

  // Hero
  hero_tagline: string;
  hero_subtitle: string;
  hero_browse_products: string;
  hero_become_vendor: string;

  // Categories
  categories_title: string;
  cat_vegetables: string;
  cat_grains: string;
  cat_dairy: string;
  cat_fruits: string;
  cat_spices: string;
  cat_handicrafts: string;
  cat_clothing: string;
  cat_all: string;

  // Products
  products_title: string;
  products_filter: string;
  products_sort: string;
  products_search: string;
  products_add_cart: string;
  products_out_of_stock: string;
  products_by: string;
  products_empty: string;
  sort_price_low: string;
  sort_price_high: string;
  sort_newest: string;
  sort_rating: string;
  filter_category: string;
  filter_state: string;
  filter_district: string;
  filter_price_range: string;
  filter_clear: string;

  // Product Detail
  product_add_cart: string;
  product_quantity: string;
  product_stock: string;
  product_vendor: string;
  product_region: string;
  product_rating: string;
  product_reviews: string;
  product_write_review: string;
  product_your_rating: string;
  product_comment: string;
  product_submit_review: string;
  product_in_cart: string;

  // Cart
  cart_title: string;
  cart_empty: string;
  cart_subtotal: string;
  cart_checkout: string;
  cart_remove: string;
  cart_quantity: string;
  cart_continue_shopping: string;
  cart_items: string;

  // Checkout
  checkout_title: string;
  checkout_delivery_address: string;
  checkout_payment_method: string;
  checkout_pay_online: string;
  checkout_pay_cod: string;
  checkout_place_order: string;
  checkout_full_name: string;
  checkout_phone: string;
  checkout_address: string;
  checkout_city: string;
  checkout_state: string;
  checkout_pincode: string;
  checkout_order_summary: string;
  checkout_total: string;
  checkout_success_title: string;
  checkout_success_msg: string;
  checkout_view_orders: string;

  // Dashboard - Buyer
  buyer_orders: string;
  buyer_profile: string;
  buyer_order_history: string;
  buyer_no_orders: string;

  // Dashboard - Vendor
  vendor_products: string;
  vendor_orders: string;
  vendor_add_product: string;
  vendor_edit_product: string;
  vendor_delete_product: string;
  vendor_product_name: string;
  vendor_price: string;
  vendor_stock: string;
  vendor_category: string;
  vendor_description: string;
  vendor_save: string;
  vendor_cancel: string;
  vendor_incoming_orders: string;
  vendor_update_status: string;

  // Dashboard - Admin
  admin_users: string;
  admin_orders: string;
  admin_products: string;
  admin_approve: string;
  admin_suspend: string;
  admin_vendors: string;
  admin_all_orders: string;

  // Status
  status_pending: string;
  status_confirmed: string;
  status_shipped: string;
  status_delivered: string;
  status_cancelled: string;

  // Auth
  auth_login: string;
  auth_signup: string;
  auth_email: string;
  auth_password: string;
  auth_name: string;
  auth_role_buyer: string;
  auth_role_vendor: string;
  auth_select_role: string;
  auth_already_account: string;
  auth_no_account: string;
  auth_or: string;
  auth_login_ii: string;

  // General
  verified: string;
  view_all: string;
  loading: string;
  error: string;
  save_changes: string;
  rupees_symbol: string;
}

const EN: Translations = {
  nav_home: "Home",
  nav_products: "Products",
  nav_cart: "Cart",
  nav_login: "Login",
  nav_signup: "Sign Up",
  nav_logout: "Logout",
  nav_buyer_dashboard: "My Orders",
  nav_vendor_dashboard: "Vendor Dashboard",
  nav_admin_dashboard: "Admin Panel",
  nav_profile: "Profile",

  hero_tagline: "Grameen Bazaar",
  hero_subtitle: "Your Local Market, Online. Direct from Village to Your Home.",
  hero_browse_products: "Browse Products",
  hero_become_vendor: "Become a Vendor",

  categories_title: "Shop by Category",
  cat_vegetables: "Vegetables",
  cat_grains: "Grains & Pulses",
  cat_dairy: "Dairy",
  cat_fruits: "Fruits",
  cat_spices: "Spices",
  cat_handicrafts: "Handicrafts",
  cat_clothing: "Clothing",
  cat_all: "All Products",

  products_title: "All Products",
  products_filter: "Filter",
  products_sort: "Sort by",
  products_search: "Search products...",
  products_add_cart: "Add to Cart",
  products_out_of_stock: "Out of Stock",
  products_by: "by",
  products_empty: "No products found. Try adjusting your filters.",
  sort_price_low: "Price: Low to High",
  sort_price_high: "Price: High to Low",
  sort_newest: "Newest First",
  sort_rating: "Highest Rated",
  filter_category: "Category",
  filter_state: "State",
  filter_district: "District",
  filter_price_range: "Price Range",
  filter_clear: "Clear Filters",

  product_add_cart: "Add to Cart",
  product_quantity: "Quantity",
  product_stock: "In Stock",
  product_vendor: "Sold by",
  product_region: "Region",
  product_rating: "Rating",
  product_reviews: "Reviews",
  product_write_review: "Write a Review",
  product_your_rating: "Your Rating",
  product_comment: "Your Review",
  product_submit_review: "Submit Review",
  product_in_cart: "In Cart",

  cart_title: "Shopping Cart",
  cart_empty: "Your cart is empty",
  cart_subtotal: "Subtotal",
  cart_checkout: "Proceed to Checkout",
  cart_remove: "Remove",
  cart_quantity: "Qty",
  cart_continue_shopping: "Continue Shopping",
  cart_items: "items",

  checkout_title: "Checkout",
  checkout_delivery_address: "Delivery Address",
  checkout_payment_method: "Payment Method",
  checkout_pay_online: "Pay Online (Stripe)",
  checkout_pay_cod: "Cash on Delivery",
  checkout_place_order: "Place Order",
  checkout_full_name: "Full Name",
  checkout_phone: "Phone Number",
  checkout_address: "Address",
  checkout_city: "City / Town",
  checkout_state: "State",
  checkout_pincode: "PIN Code",
  checkout_order_summary: "Order Summary",
  checkout_total: "Total",
  checkout_success_title: "Order Placed!",
  checkout_success_msg:
    "Your order has been placed successfully. You'll receive a confirmation shortly.",
  checkout_view_orders: "View My Orders",

  buyer_orders: "Orders",
  buyer_profile: "Profile",
  buyer_order_history: "Order History",
  buyer_no_orders: "No orders yet. Start shopping!",

  vendor_products: "My Products",
  vendor_orders: "Incoming Orders",
  vendor_add_product: "Add Product",
  vendor_edit_product: "Edit Product",
  vendor_delete_product: "Delete",
  vendor_product_name: "Product Name",
  vendor_price: "Price (in paise)",
  vendor_stock: "Stock",
  vendor_category: "Category",
  vendor_description: "Description",
  vendor_save: "Save Product",
  vendor_cancel: "Cancel",
  vendor_incoming_orders: "Incoming Orders",
  vendor_update_status: "Update Status",

  admin_users: "Users",
  admin_orders: "Orders",
  admin_products: "Products",
  admin_approve: "Approve",
  admin_suspend: "Suspend",
  admin_vendors: "Vendor Management",
  admin_all_orders: "All Orders",

  status_pending: "Pending",
  status_confirmed: "Confirmed",
  status_shipped: "Shipped",
  status_delivered: "Delivered",
  status_cancelled: "Cancelled",

  auth_login: "Login",
  auth_signup: "Sign Up",
  auth_email: "Email",
  auth_password: "Password",
  auth_name: "Full Name",
  auth_role_buyer: "Buyer",
  auth_role_vendor: "Vendor / Seller",
  auth_select_role: "I want to join as",
  auth_already_account: "Already have an account?",
  auth_no_account: "Don't have an account?",
  auth_or: "or",
  auth_login_ii: "Login with Internet Identity",

  verified: "Verified",
  view_all: "View All",
  loading: "Loading...",
  error: "Something went wrong",
  save_changes: "Save Changes",
  rupees_symbol: "₹",
};

const HI: Translations = {
  nav_home: "होम",
  nav_products: "उत्पाद",
  nav_cart: "कार्ट",
  nav_login: "लॉगिन",
  nav_signup: "साइन अप",
  nav_logout: "लॉगआउट",
  nav_buyer_dashboard: "मेरे ऑर्डर",
  nav_vendor_dashboard: "विक्रेता डैशबोर्ड",
  nav_admin_dashboard: "एडमिन पैनल",
  nav_profile: "प्रोफ़ाइल",

  hero_tagline: "ग्रामीण बाज़ार",
  hero_subtitle: "आपका स्थानीय बाज़ार, ऑनलाइन। गाँव से सीधे आपके घर तक।",
  hero_browse_products: "उत्पाद देखें",
  hero_become_vendor: "विक्रेता बनें",

  categories_title: "श्रेणी के अनुसार खरीदें",
  cat_vegetables: "सब्जियाँ",
  cat_grains: "अनाज व दालें",
  cat_dairy: "डेयरी",
  cat_fruits: "फल",
  cat_spices: "मसाले",
  cat_handicrafts: "हस्तशिल्प",
  cat_clothing: "वस्त्र",
  cat_all: "सभी उत्पाद",

  products_title: "सभी उत्पाद",
  products_filter: "फ़िल्टर",
  products_sort: "क्रमबद्ध करें",
  products_search: "उत्पाद खोजें...",
  products_add_cart: "कार्ट में जोड़ें",
  products_out_of_stock: "स्टॉक में नहीं",
  products_by: "द्वारा",
  products_empty: "कोई उत्पाद नहीं मिला। फ़िल्टर बदलकर देखें।",
  sort_price_low: "मूल्य: कम से अधिक",
  sort_price_high: "मूल्य: अधिक से कम",
  sort_newest: "नवीनतम पहले",
  sort_rating: "सर्वोच्च रेटिंग",
  filter_category: "श्रेणी",
  filter_state: "राज्य",
  filter_district: "जिला",
  filter_price_range: "मूल्य सीमा",
  filter_clear: "फ़िल्टर हटाएँ",

  product_add_cart: "कार्ट में जोड़ें",
  product_quantity: "मात्रा",
  product_stock: "स्टॉक में",
  product_vendor: "विक्रेता",
  product_region: "क्षेत्र",
  product_rating: "रेटिंग",
  product_reviews: "समीक्षाएँ",
  product_write_review: "समीक्षा लिखें",
  product_your_rating: "आपकी रेटिंग",
  product_comment: "आपकी समीक्षा",
  product_submit_review: "समीक्षा दें",
  product_in_cart: "कार्ट में है",

  cart_title: "शॉपिंग कार्ट",
  cart_empty: "आपका कार्ट खाली है",
  cart_subtotal: "उप-योग",
  cart_checkout: "चेकआउट करें",
  cart_remove: "हटाएँ",
  cart_quantity: "मात्रा",
  cart_continue_shopping: "खरीदारी जारी रखें",
  cart_items: "आइटम",

  checkout_title: "चेकआउट",
  checkout_delivery_address: "डिलीवरी पता",
  checkout_payment_method: "भुगतान का तरीका",
  checkout_pay_online: "ऑनलाइन भुगतान (Stripe)",
  checkout_pay_cod: "कैश ऑन डिलीवरी",
  checkout_place_order: "ऑर्डर दें",
  checkout_full_name: "पूरा नाम",
  checkout_phone: "फ़ोन नंबर",
  checkout_address: "पता",
  checkout_city: "शहर / कस्बा",
  checkout_state: "राज्य",
  checkout_pincode: "पिन कोड",
  checkout_order_summary: "ऑर्डर सारांश",
  checkout_total: "कुल",
  checkout_success_title: "ऑर्डर हो गया!",
  checkout_success_msg: "आपका ऑर्डर सफलतापूर्वक दे दिया गया है। जल्द ही पुष्टि मिलेगी।",
  checkout_view_orders: "मेरे ऑर्डर देखें",

  buyer_orders: "ऑर्डर",
  buyer_profile: "प्रोफ़ाइल",
  buyer_order_history: "ऑर्डर इतिहास",
  buyer_no_orders: "अभी कोई ऑर्डर नहीं। खरीदारी शुरू करें!",

  vendor_products: "मेरे उत्पाद",
  vendor_orders: "आने वाले ऑर्डर",
  vendor_add_product: "उत्पाद जोड़ें",
  vendor_edit_product: "उत्पाद संपादित करें",
  vendor_delete_product: "हटाएँ",
  vendor_product_name: "उत्पाद का नाम",
  vendor_price: "मूल्य (पैसे में)",
  vendor_stock: "स्टॉक",
  vendor_category: "श्रेणी",
  vendor_description: "विवरण",
  vendor_save: "उत्पाद सहेजें",
  vendor_cancel: "रद्द करें",
  vendor_incoming_orders: "आने वाले ऑर्डर",
  vendor_update_status: "स्थिति अपडेट करें",

  admin_users: "उपयोगकर्ता",
  admin_orders: "ऑर्डर",
  admin_products: "उत्पाद",
  admin_approve: "स्वीकृत करें",
  admin_suspend: "निलंबित करें",
  admin_vendors: "विक्रेता प्रबंधन",
  admin_all_orders: "सभी ऑर्डर",

  status_pending: "प्रतीक्षित",
  status_confirmed: "पुष्टि हुई",
  status_shipped: "भेजा गया",
  status_delivered: "डिलीवर हुआ",
  status_cancelled: "रद्द हुआ",

  auth_login: "लॉगिन",
  auth_signup: "साइन अप",
  auth_email: "ईमेल",
  auth_password: "पासवर्ड",
  auth_name: "पूरा नाम",
  auth_role_buyer: "खरीदार",
  auth_role_vendor: "विक्रेता",
  auth_select_role: "मैं इस रूप में शामिल होना चाहता हूँ",
  auth_already_account: "पहले से खाता है?",
  auth_no_account: "खाता नहीं है?",
  auth_or: "या",
  auth_login_ii: "इंटरनेट पहचान से लॉगिन",

  verified: "सत्यापित",
  view_all: "सभी देखें",
  loading: "लोड हो रहा है...",
  error: "कुछ गलत हो गया",
  save_changes: "बदलाव सहेजें",
  rupees_symbol: "₹",
};

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const t = lang === "en" ? EN : HI;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
