import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function LoginPage() {
  const { lang, t } = useLanguage();
  const { setUser } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    // Simulate different user roles based on email
    let role: "buyer" | "vendor" | "admin" = "buyer";
    if (email.includes("vendor")) role = "vendor";
    if (email.includes("admin")) role = "admin";

    setUser({
      id: "user1",
      name: email.split("@")[0].replace(/[._]/g, " "),
      phone: "+91 98765 43210",
      email,
      role,
      state: "Uttar Pradesh",
      district: "Varanasi",
      vendorId: role === "vendor" ? "v1" : undefined,
    });

    setLoading(false);
    toast.success("Welcome back!");
    navigate({
      to:
        role === "admin"
          ? "/dashboard/admin"
          : role === "vendor"
            ? "/dashboard/vendor"
            : "/dashboard/buyer",
    });
  };

  const handleIILogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setUser({
      id: "ii_user",
      name: "Internet Identity User",
      phone: "",
      email: "user@ii.icp",
      role: "buyer",
    });
    setLoading(false);
    toast.success("Logged in with Internet Identity!");
    navigate({ to: "/dashboard/buyer" });
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center py-12 px-4"
      data-ocid="login.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg mx-auto mb-3">
            GB
          </div>
          <h1 className="font-display text-2xl font-bold">{t.auth_login}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {lang === "hi"
              ? "ग्रामीण बाज़ार में स्वागत है"
              : "Welcome back to Grameen Bazaar"}
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-md space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t.auth_email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="priya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                data-ocid="login.email.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{t.auth_password}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                data-ocid="login.password.input"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-ocid="login.submit.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t.loading}
                </>
              ) : (
                t.auth_login
              )}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">{t.auth_or}</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full gap-2 text-xs"
            onClick={handleIILogin}
            disabled={loading}
            data-ocid="login.ii.button"
          >
            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[8px] font-bold">
              II
            </div>
            {t.auth_login_ii}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t.auth_no_account}{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline font-medium"
              data-ocid="login.signup.link"
            >
              {t.auth_signup}
            </Link>
          </p>

          <div className="text-xs text-muted-foreground/60 text-center space-y-0.5">
            <p>Demo: use "vendor@" or "admin@" prefix for different roles</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
