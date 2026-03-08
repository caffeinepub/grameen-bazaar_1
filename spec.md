# Grameen Bazaar

## Current State

A full-stack hyperlocal marketplace for rural & Tier-3 India with:
- Product browsing with category filters (Vegetables, Grains, Dairy, Fruits, Spices, Handicrafts, Clothing)
- Vendor and buyer dashboards, admin panel
- Cart, checkout with Stripe + COD
- Bilingual EN/Hindi toggle
- Vendor application form (VendorApplyPage)
- Regional filtering by state/district
- Ratings & reviews

## Requested Changes (Diff)

### Add
- **Grocery category** in CATEGORIES list (emoji 🛒, id "Grocery", EN "Grocery Essentials", HI "किराना सामान")
- **Grocery sample products**: atta, mustard oil, dal, sugar, salt, tea, soap, biscuits -- essential daily-use items mapped to the "Grocery" category with village vendors
- **Grocery dedicated page** (`/grocery`) -- quick-commerce style layout with subcategory tabs (Staples / Oils & Ghee / Beverages / Personal Care), product grid with quick-add to cart, "Deliver in 2 hrs" badge for in-stock items
- **Grocery link** in Navbar and LandingPage hero categories section
- **GroceryPage route** registered in App.tsx

### Modify
- `mockData.ts` -- add Grocery to CATEGORIES array and add 6-8 grocery products
- `App.tsx` -- register `/grocery` route
- `Navbar` -- add Grocery nav link
- `LandingPage` -- add Grocery category card in the categories showcase section

### Remove
- Nothing removed

## Implementation Plan

1. Add "Grocery" entry to CATEGORIES in `mockData.ts`
2. Add 6-8 grocery products (atta, mustard oil, toor dal, sugar, salt, tea, soap, biscuits) in PRODUCTS array in `mockData.ts`, with a new vendor ("Kirana General Store") or existing vendors
3. Create `src/pages/GroceryPage.tsx` -- subcategory tabs (Staples, Oils & Ghee, Beverages, Personal Care), product grid, quick-add button, "Fast Delivery" badge
4. Register `/grocery` route in `App.tsx` and import GroceryPage
5. Add Grocery link in Navbar component
6. Add Grocery category card in LandingPage categories section
