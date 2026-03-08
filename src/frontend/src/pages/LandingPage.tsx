import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CATEGORIES } from "@/data/mockData";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  ShoppingBasket,
  Star,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function LandingPage() {
  const { lang, t } = useLanguage();
  const { products } = useApp();
  const navigate = useNavigate();

  const featuredProducts = products.slice(0, 6);

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden min-h-[520px] flex items-center"
        data-ocid="hero.section"
      >
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-grameen-bazaar.dim_1200x600.jpg"
            alt="Grameen Bazaar marketplace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-sm font-medium mb-4"
            >
              <Leaf className="w-4 h-4" />
              {lang === "hi" ? "भारत का अपना बाज़ार" : "India's Own Marketplace"}
            </motion.div>

            <h1 className="font-display text-5xl sm:text-6xl font-bold text-white leading-tight mb-2">
              {lang === "hi" ? "ग्रामीण बाज़ार" : "Grameen Bazaar"}
            </h1>

            <p className="text-xl text-white/90 mb-2 font-medium">
              {lang === "hi" ? "ग्रामीण बाज़ार" : ""}
            </p>

            <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-lg">
              {t.hero_subtitle}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold gap-2 shadow-lg"
                onClick={() =>
                  navigate({ to: "/products", search: { category: undefined } })
                }
                data-ocid="hero.browse.primary_button"
              >
                {t.hero_browse_products}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Link to="/grocery" data-ocid="hero.grocery.secondary_button">
                <Button
                  size="lg"
                  className="bg-teal-500 hover:bg-teal-400 text-white font-semibold gap-2 shadow-lg border-0"
                >
                  <ShoppingBasket className="w-4 h-4" />
                  {lang === "hi" ? "किराना खरीदें" : "Shop Groceries"}
                </Button>
              </Link>
              <Link to="/vendor-apply" data-ocid="hero.vendor.secondary_button">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/60 text-white hover:bg-white/20 bg-transparent font-semibold gap-2"
                >
                  {t.hero_become_vendor}
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 mt-10 text-white/80">
              <div className="flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {lang === "hi" ? "सत्यापित विक्रेता" : "Verified Vendors"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Truck className="w-4 h-4" />
                <span>
                  {lang === "hi" ? "कैश ऑन डिलीवरी" : "Cash on Delivery"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4" />
                <span>
                  {lang === "hi" ? "सीधे किसान से" : "Direct from Farmers"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 bg-background" data-ocid="categories.section">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold text-foreground">
                {t.categories_title}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {lang === "hi"
                  ? "हर ज़रूरत के लिए कुछ न कुछ"
                  : "Something for every need"}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {CATEGORIES.map((cat) => (
                <motion.div key={cat.id} variants={itemVariants}>
                  <Link
                    to="/products"
                    search={{ category: cat.id }}
                    className="group block text-center"
                    data-ocid={`category.${cat.id.toLowerCase()}.link`}
                  >
                    <div
                      className={`category-card-hover rounded-xl border p-4 flex flex-col items-center gap-2 ${cat.color} hover:shadow-md`}
                    >
                      <span className="text-3xl">{cat.emoji}</span>
                      <span className="text-xs font-semibold leading-tight text-center">
                        {lang === "hi" ? cat.nameHi : cat.nameEn}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14 bg-muted/30" data-ocid="featured.section">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">
                  {lang === "hi" ? "विशेष उत्पाद" : "Featured Products"}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {lang === "hi"
                    ? "ताज़े और जैविक, सीधे किसान से"
                    : "Fresh, organic, direct from the farm"}
                </p>
              </div>
              <Link
                to="/products"
                search={{ category: undefined }}
                data-ocid="featured.view-all.link"
              >
                <Button variant="outline" size="sm" className="gap-1.5">
                  {t.view_all}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProducts.map((product, idx) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} index={idx + 1} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Become a Vendor CTA */}
      <section
        className="py-14 bg-sidebar text-sidebar-foreground"
        data-ocid="vendor-cta.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold mb-3">
              {lang === "hi"
                ? "अपना व्यापार ऑनलाइन लाएँ"
                : "Bring Your Business Online"}
            </h2>
            <p className="text-sidebar-foreground/70 mb-6 text-base leading-relaxed">
              {lang === "hi"
                ? "हज़ारों खरीदारों तक पहुँचें। अपने उत्पाद ऑनलाइन बेचें और अपनी आमदनी बढ़ाएँ।"
                : "Reach thousands of buyers. Sell your products online and grow your income with Grameen Bazaar."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/vendor-apply"
                data-ocid="cta.vendor-signup.primary_button"
              >
                <Button size="lg" className="gap-2">
                  {t.hero_become_vendor}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">
              {[
                {
                  en: "Zero Commission",
                  hi: "शून्य कमीशन",
                  icon: "💰",
                  en_sub: "First 3 months",
                  hi_sub: "पहले 3 महीने",
                },
                {
                  en: "Easy Setup",
                  hi: "आसान शुरुआत",
                  icon: "⚡",
                  en_sub: "List in minutes",
                  hi_sub: "मिनटों में शुरू",
                },
                {
                  en: "Secure Payments",
                  hi: "सुरक्षित भुगतान",
                  icon: "🔒",
                  en_sub: "UPI & Cards",
                  hi_sub: "UPI और कार्ड",
                },
              ].map((item) => (
                <div key={item.en} className="text-center space-y-1">
                  <div className="text-3xl">{item.icon}</div>
                  <p className="font-semibold text-sm">
                    {lang === "hi" ? item.hi : item.en}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60">
                    {lang === "hi" ? item.hi_sub : item.en_sub}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
