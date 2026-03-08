import { ProductCard } from "@/components/shared/ProductCard";
import { Badge } from "@/components/ui/badge";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CATEGORIES, INDIAN_STATES } from "@/data/mockData";
import { formatPrice } from "@/utils/format";
import { useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

type SortOption = "newest" | "price_low" | "price_high" | "rating";

export function ProductsPage() {
  const { lang, t } = useLanguage();
  const { products } = useApp();
  const search = useSearch({ from: "/products" });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (search as { category?: string }).category ?? "all",
  );
  const [selectedState, setSelectedState] = useState<string>("all");
  const [districtQuery, setDistrictQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  const maxPrice = 300000;

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nameEn.toLowerCase().includes(q) ||
          p.nameHi.includes(q) ||
          p.descriptionEn.toLowerCase().includes(q),
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedState && selectedState !== "all") {
      result = result.filter((p) => p.state === selectedState);
    }

    if (districtQuery.trim()) {
      result = result.filter((p) =>
        p.district.toLowerCase().includes(districtQuery.toLowerCase()),
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedState,
    districtQuery,
    priceRange,
    sortBy,
  ]);

  const activeFilterCount = [
    selectedCategory !== "all",
    selectedState !== "all",
    districtQuery.trim() !== "",
    priceRange[0] > 0 || priceRange[1] < maxPrice,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedState("all");
    setDistrictQuery("");
    setPriceRange([0, maxPrice]);
  };

  const FilterPanel = () => (
    <div className="space-y-5 p-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          {t.filter_category}
        </Label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted"
            }`}
            data-ocid="filter.category.all.toggle"
          >
            {t.cat_all}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted"
              }`}
              data-ocid={`filter.category.${cat.id.toLowerCase()}.toggle`}
            >
              {cat.emoji} {lang === "hi" ? cat.nameHi : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          {t.filter_state}
        </Label>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger data-ocid="filter.state.select">
            <SelectValue placeholder={t.filter_state} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {lang === "hi" ? "सभी राज्य" : "All States"}
            </SelectItem>
            {INDIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          {t.filter_district}
        </Label>
        <Input
          placeholder={lang === "hi" ? "जिला खोजें..." : "Search district..."}
          value={districtQuery}
          onChange={(e) => setDistrictQuery(e.target.value)}
          data-ocid="filter.district.input"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          {t.filter_price_range}: {formatPrice(priceRange[0])} –{" "}
          {formatPrice(priceRange[1])}
        </Label>
        <Slider
          min={0}
          max={maxPrice}
          step={1000}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="mt-2"
          data-ocid="filter.price.toggle"
        />
      </div>

      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full gap-2"
          data-ocid="filter.clear.button"
        >
          <X className="w-3.5 h-3.5" />
          {t.filter_clear}
        </Button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen" data-ocid="products.page">
      {/* Header */}
      <div className="bg-muted/40 border-b border-border py-6">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold mb-4">
            {t.products_title}
          </h1>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t.products_search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-ocid="products.search_input"
              />
            </div>

            {/* Sort */}
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            >
              <SelectTrigger className="w-44" data-ocid="products.sort.select">
                <SelectValue placeholder={t.products_sort} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t.sort_newest}</SelectItem>
                <SelectItem value="price_low">{t.sort_price_low}</SelectItem>
                <SelectItem value="price_high">{t.sort_price_high}</SelectItem>
                <SelectItem value="rating">{t.sort_rating}</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter toggle (mobile) */}
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 lg:hidden relative"
                  data-ocid="products.filter.open_modal_button"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {t.products_filter}
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>{t.products_filter}</SheetTitle>
                </SheetHeader>
                <FilterPanel />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 border border-border rounded-xl bg-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {t.products_filter}
                </span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {filtered.length}{" "}
                {lang === "hi" ? "उत्पाद मिले" : "products found"}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="products.empty_state"
              >
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-muted-foreground text-lg">
                  {t.products_empty}
                </p>
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    {t.filter_clear}
                  </Button>
                )}
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filtered.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={idx + 1}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
