import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CATEGORIES, INDIAN_STATES } from "@/data/mockData";
import type { Vendor } from "@/data/types";
import { generateId } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, ChevronRight, Loader2, Store } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function VendorApplyPage() {
  const { lang } = useLanguage();
  const { user, vendors, setVendors } = useApp();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    shopNameEn: "",
    shopNameHi: "",
    description: "",
    category: "Vegetables",
    district: "",
    state: "",
    phone: user?.phone ?? "",
  });

  const setField =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shopNameEn || !form.district || !form.state || !form.phone) {
      toast.error(
        lang === "hi"
          ? "कृपया सभी आवश्यक फ़ील्ड भरें"
          : "Please fill in all required fields",
      );
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    const newVendor: Vendor = {
      id: generateId("v"),
      shopNameEn: form.shopNameEn,
      shopNameHi: form.shopNameHi || form.shopNameEn,
      description: form.description,
      phone: form.phone,
      state: form.state,
      district: form.district,
      village: "",
      isApproved: false,
      isVerified: false,
      status: "pending",
    };

    setVendors([...vendors, newVendor]);
    setLoading(false);
    setSubmitted(true);
    toast.success(
      lang === "hi"
        ? "आवेदन सफलतापूर्वक जमा हुआ!"
        : "Application submitted successfully!",
    );
  };

  if (submitted) {
    return (
      <main
        className="min-h-screen flex items-center justify-center py-12 px-4"
        data-ocid="vendor-apply.success.section"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto space-y-5"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            <BadgeCheck className="w-16 h-16 text-primary mx-auto" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold">
            {lang === "hi" ? "आवेदन जमा हो गया!" : "Application Submitted!"}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {lang === "hi"
              ? "हमारी टीम 24-48 घंटे के भीतर आपके आवेदन की समीक्षा करेगी। अनुमोदन के बाद आप उत्पाद जोड़ सकते हैं।"
              : "Our team will review your application within 24-48 hours. Once approved, you can start listing products."}
          </p>
          <div className="p-4 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">
              {lang === "hi" ? "आवेदन स्थिति" : "Application Status"}
            </p>
            <p className="text-amber-600 font-medium">
              ⏳ {lang === "hi" ? "समीक्षा प्रतीक्षित" : "Pending Review"}
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link to="/" data-ocid="vendor-apply.home.primary_button">
              <Button className="w-full gap-2">
                {lang === "hi" ? "होम पर जाएँ" : "Go to Home"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link
              to="/products"
              search={{ category: undefined }}
              data-ocid="vendor-apply.browse.secondary_button"
            >
              <Button variant="outline" className="w-full">
                {lang === "hi" ? "उत्पाद देखें" : "Browse Products"}
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10 px-4" data-ocid="vendor-apply.page">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Store className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold">
              {lang === "hi" ? "विक्रेता आवेदन" : "Vendor Application"}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {lang === "hi"
                ? "ग्रामीण बाज़ार पर अपनी दुकान खोलें और हज़ारों ग्राहकों तक पहुँचें"
                : "Open your shop on Grameen Bazaar and reach thousands of customers"}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 rounded-2xl border border-border bg-card shadow-sm"
          >
            {/* Shop Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="shopNameEn">
                  {lang === "hi"
                    ? "दुकान का नाम (अंग्रेजी)"
                    : "Shop Name (English)"}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="shopNameEn"
                  value={form.shopNameEn}
                  onChange={setField("shopNameEn")}
                  placeholder="e.g. Ramesh's Farm Fresh"
                  data-ocid="vendor-apply.shop-name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="shopNameHi">
                  {lang === "hi" ? "दुकान का नाम (हिंदी)" : "Shop Name (Hindi)"}
                </Label>
                <Input
                  id="shopNameHi"
                  value={form.shopNameHi}
                  onChange={setField("shopNameHi")}
                  placeholder="e.g. रमेश की ताज़ी सब्जियाँ"
                  data-ocid="vendor-apply.shop-name-hi.input"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">
                {lang === "hi" ? "दुकान का विवरण" : "Shop Description"}
              </Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={setField("description")}
                rows={3}
                placeholder={
                  lang === "hi"
                    ? "अपनी दुकान के बारे में बताएं..."
                    : "Tell us about your shop, what you sell..."
                }
                data-ocid="vendor-apply.description.textarea"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label>
                {lang === "hi" ? "मुख्य श्रेणी" : "Primary Category"}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger data-ocid="vendor-apply.category.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.emoji} {lang === "hi" ? cat.nameHi : cat.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="state">
                  {lang === "hi" ? "राज्य" : "State"}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.state}
                  onValueChange={(v) => setForm((p) => ({ ...p, state: v }))}
                >
                  <SelectTrigger data-ocid="vendor-apply.state.select">
                    <SelectValue
                      placeholder={lang === "hi" ? "राज्य चुनें" : "Select state"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="district">
                  {lang === "hi" ? "जिला" : "District"}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="district"
                  value={form.district}
                  onChange={setField("district")}
                  placeholder={lang === "hi" ? "जिला" : "e.g. Varanasi"}
                  data-ocid="vendor-apply.district.input"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone">
                {lang === "hi" ? "फ़ोन नंबर" : "Phone Number"}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={setField("phone")}
                placeholder="+91 98765 43210"
                data-ocid="vendor-apply.phone.input"
              />
            </div>

            {/* Benefits */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <p className="text-sm font-semibold text-primary">
                {lang === "hi" ? "विक्रेता लाभ" : "Vendor Benefits"}
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {(lang === "hi"
                  ? [
                      "✅ पहले 3 महीने शून्य कमीशन",
                      "✅ ऑनलाइन और COD भुगतान",
                      "✅ 10,000+ ग्राहकों तक पहुँच",
                      "✅ हिंदी में सहायता",
                    ]
                  : [
                      "✅ Zero commission for first 3 months",
                      "✅ Online & COD payment support",
                      "✅ Reach 10,000+ customers",
                      "✅ Support in Hindi & English",
                    ]
                ).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={loading}
              data-ocid="vendor.apply_submit_button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === "hi" ? "जमा हो रहा है..." : "Submitting..."}
                </>
              ) : (
                <>
                  {lang === "hi" ? "आवेदन जमा करें" : "Submit Application"}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            {lang === "hi" ? "पहले से विक्रेता हैं? " : "Already a vendor? "}
            <Link
              to="/login"
              className="text-primary hover:underline"
              data-ocid="vendor-apply.login.link"
            >
              {lang === "hi" ? "यहाँ लॉगिन करें" : "Login here"}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
