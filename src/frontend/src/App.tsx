import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/contexts/AppContext";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { GroceryPage } from "@/pages/GroceryPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { SignupPage } from "@/pages/SignupPage";
import { VendorApplyPage } from "@/pages/VendorApplyPage";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";
import { BuyerDashboard } from "@/pages/dashboard/BuyerDashboard";
import { VendorDashboard } from "@/pages/dashboard/VendorDashboard";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  ),
});

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$id",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

const buyerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/buyer",
  component: BuyerDashboard,
});

const vendorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/vendor",
  component: VendorDashboard,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/admin",
  component: AdminDashboard,
});

const vendorApplyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendor-apply",
  component: VendorApplyPage,
});

const groceryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/grocery",
  component: GroceryPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  loginRoute,
  signupRoute,
  buyerDashboardRoute,
  vendorDashboardRoute,
  adminDashboardRoute,
  vendorApplyRoute,
  groceryRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AppProvider>
    </LanguageProvider>
  );
}
