import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { itemCount } = useCart();
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate({ to: "/" });
    setMobileOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "vendor") return "/dashboard/vendor";
    return "/dashboard/buyer";
  };

  const getDashboardLabel = () => {
    if (!user) return "";
    if (user.role === "admin") return t.nav_admin_dashboard;
    if (user.role === "vendor") return t.nav_vendor_dashboard;
    return t.nav_buyer_dashboard;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            data-ocid="nav.home_link"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
              GB
            </div>
            <span className="font-display font-bold text-lg text-foreground hidden sm:block">
              {lang === "hi" ? "ग्रामीण बाज़ार" : "Grameen Bazaar"}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-6 flex-1">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
              activeProps={{ className: "text-primary bg-primary/10" }}
              data-ocid="nav.home.link"
            >
              {t.nav_home}
            </Link>
            <Link
              to="/products"
              search={{ category: undefined }}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
              activeProps={{ className: "text-primary bg-primary/10" }}
              data-ocid="nav.shop_link"
            >
              {t.nav_products}
            </Link>
            <Link
              to="/grocery"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
              activeProps={{ className: "text-primary bg-primary/10" }}
              data-ocid="nav.grocery.link"
            >
              {lang === "hi" ? "किराना" : "Grocery"}
            </Link>
            <Link
              to="/vendor-apply"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
              activeProps={{ className: "text-primary bg-primary/10" }}
              data-ocid="nav.sell_link"
            >
              {lang === "hi" ? "बेचें" : "Sell"}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Language Toggle */}
            <div className="flex items-center rounded-full border border-border p-0.5 bg-muted text-xs font-medium">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={cn(
                  "px-2.5 py-1 rounded-full transition-all",
                  lang === "en"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid="nav.lang_toggle"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("hi")}
                className={cn(
                  "px-2.5 py-1 rounded-full transition-all",
                  lang === "hi"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid="nav.lang-hi.toggle"
              >
                हि
              </button>
            </div>

            {/* Cart */}
            <Link to="/cart" data-ocid="nav.cart.link">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    data-ocid="nav.user.dropdown_menu"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center gap-2 cursor-pointer"
                      data-ocid="nav.dashboard.link"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {getDashboardLabel()}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-2 text-destructive focus:text-destructive"
                    data-ocid="nav.logout.button"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.nav_logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" data-ocid="nav.login_button">
                  <Button variant="ghost" size="sm">
                    {t.nav_login}
                  </Button>
                </Link>
                <Link to="/signup" data-ocid="nav.signup.link">
                  <Button size="sm">{t.nav_signup}</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.mobile-menu.button"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
              onClick={() => setMobileOpen(false)}
              data-ocid="mobile.home.link"
            >
              {t.nav_home}
            </Link>
            <Link
              to="/products"
              search={{ category: undefined }}
              className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
              onClick={() => setMobileOpen(false)}
              data-ocid="mobile.products.link"
            >
              {t.nav_products}
            </Link>
            <Link
              to="/grocery"
              className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
              onClick={() => setMobileOpen(false)}
              data-ocid="mobile.grocery.link"
            >
              {lang === "hi" ? "किराना" : "Grocery"}
            </Link>
            <Link
              to="/vendor-apply"
              className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
              onClick={() => setMobileOpen(false)}
              data-ocid="mobile.sell.link"
            >
              {lang === "hi" ? "बेचें" : "Sell"}
            </Link>
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="mobile.dashboard.link"
                >
                  {getDashboardLabel()}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md"
                  data-ocid="mobile.logout.button"
                >
                  {t.nav_logout}
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2 px-3">
                <Link
                  to="/login"
                  className="flex-1"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.login_button"
                >
                  <Button variant="outline" className="w-full" size="sm">
                    {t.nav_login}
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  className="flex-1"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="mobile.signup.link"
                >
                  <Button className="w-full" size="sm">
                    {t.nav_signup}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
