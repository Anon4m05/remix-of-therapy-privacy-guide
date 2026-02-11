

## Fix: Merge Duplicate Hamburger Menus

### Problem

The Header has two separate hamburger menu buttons:
1. **Left side** (mobile only): Opens a `Sheet`-based slide-out `MobileMenu` with limited nav items (Dashboard, Decision Trees, and "Coming Soon" placeholders)
2. **Right side** (always visible): Opens a `DropdownMenu` with the full nav (Dashboard, Decision Trees, AI Decision Tree, Document Analysis, Legislation, Saved Insights, Change Role)

These should be a single menu.

### Solution

Keep the **right-side DropdownMenu** as the single navigation menu since it has the complete set of nav items, and remove the left-side mobile hamburger + MobileMenu component entirely.

### Changes

**`src/components/layout/Header.tsx`:**
- Remove the left-side mobile hamburger `Button` (the one with `className="md:hidden"` that opens `mobileMenuOpen`)
- Remove the `useState` for `mobileMenuOpen`
- Remove the `<MobileMenu>` component render at the bottom
- Remove the `MobileMenu` import

No other files need changes. The `MobileMenu.tsx` component can remain in the codebase (unused) or be deleted -- it will no longer be referenced.

