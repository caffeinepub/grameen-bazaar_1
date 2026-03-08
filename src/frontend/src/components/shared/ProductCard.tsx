import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Product } from "@/data/types";
import { formatPrice } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { StarRating } from "./StarRating";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { lang, t } = useLanguage();
  const { addToCart, items } = useCart();
  const { vendors } = useApp();

  const vendor = vendors.find((v) => v.id === product.vendorId);
  const name = lang === "hi" ? product.nameHi : product.nameEn;
  const inCart = items.some((i) => i.product.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${name} added to cart!`, { duration: 2000 });
  };

  return (
    <Card
      className="product-card-hover overflow-hidden border-border/60 h-full flex flex-col"
      data-ocid={`product.item.${index}`}
    >
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="block flex-1"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-muted">
              🛒
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <span className="text-sm font-semibold text-muted-foreground">
                {t.products_out_of_stock}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-3 flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 flex-1">
              {name}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {product.district}, {product.state}
            </span>
          </div>

          {vendor && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="truncate">
                {t.products_by}{" "}
                {lang === "hi" ? vendor.shopNameHi : vendor.shopNameEn}
              </span>
              {vendor.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} size="sm" />
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-1">
            <div>
              <span className="font-bold text-primary text-base">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-muted-foreground">
                /{product.unit}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>
        </CardContent>
      </Link>

      <div className="px-3 pb-3">
        <Button
          size="sm"
          className="w-full gap-1.5"
          disabled={product.stock === 0 || inCart}
          onClick={handleAddToCart}
          data-ocid={`product.primary_button.${index}`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {inCart ? t.product_in_cart : t.products_add_cart}
        </Button>
      </div>
    </Card>
  );
}
