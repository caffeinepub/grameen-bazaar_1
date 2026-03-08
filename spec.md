# Grameen Bazaar

## Current State

- Vendor application form exists at `/vendor/apply` (VendorApplyPage). On submit it adds a vendor with `isApproved: false` and `isVerified: false`.
- Admin Dashboard has a Vendors tab listing all vendors with Approve/Suspend toggle buttons but no distinction between newly submitted (pending) and already-reviewed vendors.
- `Vendor` type uses two booleans: `isApproved` and `isVerified`.
- `approveVendor` sets `isApproved: true`; `suspendVendor` sets `isApproved: false`.

## Requested Changes (Diff)

### Add
- A `status` field on `Vendor`: `"pending" | "approved" | "suspended"`. Pending = newly submitted application awaiting admin review.
- A "Pending" sub-tab inside the Admin Vendors section that lists only vendors with `status === "pending"`.
- A `rejectVendor` action in AppContext that sets status to `"suspended"`.
- One-click Approve and Reject buttons on each pending vendor row in the Pending tab.
- A count badge on the Pending tab label showing how many are waiting.
- Mock vendors in `mockData.ts` updated so some have status `"pending"` to demo the flow.

### Modify
- `Vendor` type: replace/augment `isApproved: boolean` with `status: "pending" | "approved" | "suspended"`. Keep `isApproved` as a computed alias or migrate all references.
- `approveVendor` in AppContext: sets `status = "approved"`.
- `suspendVendor` in AppContext: sets `status = "suspended"`.
- `VendorApplyPage`: new vendor submitted with `status: "pending"` instead of `isApproved: false`.
- Admin Vendors tab: split into sub-tabs -- Pending, Approved, Suspended. Default to Pending if there are pending items.
- Admin stat card for vendors: unchanged (total count).

### Remove
- Nothing removed externally. Internal `isApproved` boolean usage migrated to `status` field.

## Implementation Plan

1. Update `types.ts` -- add `status: "pending" | "approved" | "suspended"` to `Vendor`. Keep `isApproved` as derived getter or migrate all consumers.
2. Update `mockData.ts` -- set `status` on all seeded vendors; add 2-3 vendors with `status: "pending"` to demo the flow.
3. Update `AppContext.tsx` -- add `rejectVendor`; update `approveVendor` and `suspendVendor` to use `status`; expose `rejectVendor`.
4. Update `VendorApplyPage.tsx` -- set `status: "pending"` on new vendor object.
5. Update `AdminDashboard.tsx` -- add Pending sub-tab with badge count, approve/reject buttons; split Approved and Suspended views.
6. Validate and deploy.
