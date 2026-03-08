import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type Role = "buyer" | "vendor";

export function SignupPage() {
  const { lang, t } = useLanguage();
  const { setUser } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("buyer");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    setUser({
      id: `user_${Date.now()}`,
      name,
      phone: "",
      email,
      role,
      vendorId: role === "vendor" ? "v1" : undefined,
    });

    setLoading(false);
    toast.success("Account created successfully!");
    navigate({
      to: role === "vendor" ? "/dashboard/vendor" : "/dashboard/buyer",
    });
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center py-12 px-4"
      data-ocid="signup.page"
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
          <h1 className="font-display text-2xl font-bold">{t.auth_signup}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {lang === "hi" ? "ग्रामीण बाज़ार से जुड़ें" : "Join Grameen Bazaar"}
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-md space-y-5">
          {/* Role Selector */}
          <div className="space-y-2">
            <Label className="text-sm">{t.auth_select_role}</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["buyer", "vendor"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    role === r
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/40 text-muted-foreground",
                  )}
                  data-ocid={`signup.role-${r}.toggle`}
                >
                  <span className="text-2xl">{r === "buyer" ? "🛍️" : "🏪"}</span>
                  <span className="text-xs font-semibold">
                    {r === "buyer" ? t.auth_role_buyer : t.auth_role_vendor}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">{t.auth_name}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Sharma"
                autoComplete="name"
                data-ocid="signup.name.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">{t.auth_email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                autoComplete="email"
                data-ocid="signup.email.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{t.auth_password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                data-ocid="signup.password.input"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-ocid="signup.submit.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t.loading}
                </>
              ) : (
                t.auth_signup
              )}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">{t.auth_or}</span>
            <Separator className="flex-1" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {t.auth_already_account}{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
              data-ocid="signup.login.link"
            >
              {t.auth_login}
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
