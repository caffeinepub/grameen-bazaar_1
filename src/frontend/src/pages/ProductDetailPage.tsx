import { StarRating } from "@/components/shared/StarRating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  formatDate,
  formatPrice,
  formatPriceFull,
  generateId,
} from "@/utils/format";
import { Link, useParams } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChevronLeft,
  MapPin,
  Package,
  ShoppingCart,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const { lang, t } = useLanguage();
  const { addToCart, items } = useCart();
  const { products, vendors, reviews, addReview, user } = useApp();

  const product = products.find((p) => p.id === id);
  const vendor = product
    ? vendors.find((v) => v.id === product.vendorId)
    : null;
  const productReviews = reviews.filter((r) => r.productId === id);

  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!product) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="product-detail.error_state"
      >
        <div className="text-5xl mb-4">📦</div>
        <h2 className="font-display text-2xl font-bold mb-2">
          Product not found
        </h2>
        <Link to="/products" search={{ category: undefined }}>
          <Button variant="outline" className="gap-2 mt-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const name = lang === "hi" ? product.nameHi : product.nameEn;
  const description =
    lang === "hi" ? product.descriptionHi : product.descriptionEn;
  const inCart = items.some((i) => i.product.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${name} added to cart!`);
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmittingReview(true);
    await new Promise((r) => setTimeout(r, 500));
    addReview({
      id: generateId("rev"),
      productId: product.id,
      buyerId: user?.id ?? "guest",
      buyerName: user?.name ?? "Guest User",
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString(),
    });
    setReviewRating(0);
    setReviewComment("");
    setSubmittingReview(false);
    toast.success("Review submitted successfully!");
  };

  const avgRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) /
        productReviews.length
      : product.rating;

  return (
    <main className="min-h-screen" data-ocid="product-detail.page">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            search={{ category: undefined }}
            className="hover:text-foreground transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-muted">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🛒
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
                {name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={avgRating} size="md" />
                <span className="text-sm text-muted-foreground">
                  {avgRating.toFixed(1)} (
                  {productReviews.length || product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-primary">
                {formatPriceFull(product.price)}
              </span>
              <span className="text-muted-foreground">/{product.unit}</span>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>

            <Separator />

            {/* Vendor */}
            {vendor && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg shrink-0">
                  🏪
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm">
                      {lang === "hi" ? vendor.shopNameHi : vendor.shopNameEn}
                    </span>
                    {vendor.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {product.village}, {product.district}, {product.state}
                  </div>
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span
                className={
                  product.stock > 0
                    ? "text-green-600 font-medium"
                    : "text-destructive font-medium"
                }
              >
                {product.stock > 0
                  ? `${product.stock} ${t.product_stock}`
                  : t.products_out_of_stock}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="px-3 py-2 text-sm hover:bg-muted transition-colors disabled:opacity-50"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    data-ocid="product.quantity-dec.button"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-sm font-medium border-x border-border min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-2 text-sm hover:bg-muted transition-colors disabled:opacity-50"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    disabled={quantity >= product.stock}
                    data-ocid="product.quantity-inc.button"
                  >
                    +
                  </button>
                </div>

                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={inCart}
                  data-ocid="product.add-cart.primary_button"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {inCart ? t.product_in_cart : t.product_add_cart}
                </Button>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              {lang === "hi"
                ? `₹${((product.price * quantity) / 100).toFixed(2)} कुल`
                : `Total: ${formatPrice(product.price * quantity)}`}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <section className="mt-14" data-ocid="reviews.section">
          <h2 className="font-display text-2xl font-bold mb-6">
            {t.product_reviews} ({productReviews.length})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {productReviews.length === 0 ? (
                <div
                  className="text-center py-10 text-muted-foreground"
                  data-ocid="reviews.empty_state"
                >
                  <div className="text-4xl mb-3">💬</div>
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                productReviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl border border-border bg-card"
                    data-ocid={`review.item.${idx + 1}`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {review.buyerName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-semibold text-sm">
                            {review.buyerName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <StarRating
                          rating={review.rating}
                          size="sm"
                          className="mt-1 mb-2"
                        />
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Write Review */}
            <div
              className="space-y-4 p-5 rounded-xl border border-border bg-card"
              data-ocid="review.form.panel"
            >
              <h3 className="font-semibold text-base">
                {t.product_write_review}
              </h3>

              <div className="space-y-1.5">
                <Label className="text-sm">{t.product_your_rating}</Label>
                <StarRating
                  rating={reviewRating}
                  size="lg"
                  interactive
                  onRate={setReviewRating}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">{t.product_comment}</Label>
                <Textarea
                  placeholder={
                    lang === "hi"
                      ? "अपना अनुभव साझा करें..."
                      : "Share your experience..."
                  }
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  data-ocid="review.comment.textarea"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSubmitReview}
                disabled={submittingReview || reviewRating === 0}
                data-ocid="review.submit.submit_button"
              >
                {submittingReview ? t.loading : t.product_submit_review}
              </Button>

              {!user && (
                <p className="text-xs text-muted-foreground text-center">
                  <Link to="/login" className="text-primary hover:underline">
                    Login
                  </Link>{" "}
                  to submit a review
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
