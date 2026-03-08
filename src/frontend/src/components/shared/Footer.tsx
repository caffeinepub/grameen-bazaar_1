import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "@tanstack/react-router";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-sidebar text-sidebar-foreground mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
                GB
              </div>
              <span className="font-display font-bold text-lg">
                {lang === "hi" ? "ग्रामीण बाज़ार" : "Grameen Bazaar"}
              </span>
            </div>
            <p className="text-sm text-sidebar-foreground/70 max-w-xs">
              {lang === "hi"
                ? "ग्रामीण और टियर-3 भारत के लिए हाइपरलोकल मार्केटप्लेस। गाँव से सीधे आपके घर तक।"
                : "Hyperlocal marketplace for rural and Tier-3 India. Direct from village to your home."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wide opacity-70">
              {lang === "hi" ? "त्वरित लिंक" : "Quick Links"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-sidebar-primary transition-colors"
                >
                  {lang === "hi" ? "होम" : "Home"}
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: undefined }}
                  className="hover:text-sidebar-primary transition-colors"
                >
                  {lang === "hi" ? "उत्पाद" : "Products"}
                </Link>
              </li>
              <li>
                <Link
                  to="/vendor-apply"
                  className="hover:text-sidebar-primary transition-colors"
                >
                  {lang === "hi" ? "विक्रेता बनें" : "Become a Vendor"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wide opacity-70">
              {lang === "hi" ? "संपर्क" : "Contact"}
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {lang === "hi" ? "भारत भर में" : "Pan India"}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                +91 1800 123 4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                help@grameenbazaar.in
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sidebar-foreground/60">
          <p>
            © {year}. Built with{" "}
            <Heart className="inline w-3 h-3 text-red-400 fill-red-400" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sidebar-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p>
            {lang === "hi"
              ? "ग्रामीण भारत को डिजिटल बनाना"
              : "Empowering Rural India through Digital Commerce"}
          </p>
        </div>
      </div>
    </footer>
  );
}
