# QuickMart - Quick-Commerce Grocery Platform

A high-performance, modular quick-commerce grocery web application built with React, Vite, Tailwind CSS, shadcn/ui, Zustand, and TanStack Query, powered by **Poppins typography**.

---

## Directory Architecture

```
src/
 ├─ api/                    # API client layer with Axios & switchable dummy fallback
 │   ├─ axiosInstance.js    # Centralized Axios with baseURL & request/response interceptors
 │   ├─ authApi.js          # Authentication endpoint (loginWithPhone)
 │   ├─ orderApi.js         # Orders endpoints (getOrders, getOrderById)
 │   ├─ addressApi.js       # Address endpoints (get, add, update, delete, setDefault)
 │   ├─ contactApi.js       # Contact info and inquiry submission endpoints
 │   ├─ pageApi.js          # Static policy & terms pages endpoint
 │   ├─ categoryApi.js      # Category endpoints
 │   ├─ productApi.js       # Product sections & item endpoints
 │   └─ bannerApi.js        # Promotional banners endpoints
 ├─ data/                   # Realistic Indian grocery dummy dataset
 │   ├─ orders.js           # 6 realistic grocery orders with statuses, items, and bills
 │   ├─ addresses.js        # Default saved delivery addresses
 │   ├─ bottomNav.js        # Mobile bottom navigation configuration
 │   ├─ profileMenu.js      # Configurable profile navigation items
 │   ├─ pages.js            # Structured sections for Terms & Privacy policies
 │   ├─ contact.js          # Customer care phone, email, address, and hours
 │   ├─ categories.js       # 20 curated quick-commerce categories
 │   ├─ banners.js          # Hero promotional campaign banners
 │   └─ products.js         # 6 sections with 8-10 products each in INR
31:  ├─ hooks/                  # TanStack Query & Responsive custom hooks
32:  │   ├─ useMediaQuery.js    # SSR-safe reactive media query hook
33:  │   ├─ useIsMobile.js      # Mobile detection hook (768px breakpoint)
34:  │   ├─ useOrders.js        # Query hook for past grocery orders
35:  │   ├─ useAddresses.js     # Query hook for saved delivery addresses
36:  │   ├─ useAddAddress.js    # Mutation hook to add a new address
37:  │   ├─ useUpdateAddress.js # Mutation hook to edit an address
38:  │   ├─ useDeleteAddress.js # Mutation hook to remove an address
39:  │   ├─ useSetDefaultAddress.js # Mutation hook to switch default address
40:  │   ├─ useLogin.js         # Mutation hook for phone number login
41:  │   ├─ useRequireLogin.js  # Action guard hook (prompts LoginDialog if unauthenticated)
42:  │   ├─ usePageContent.js   # Static page content query hook
43:  │   ├─ useContactInfo.js   # Support details query hook
44:  │   ├─ useSubmitContact.js # Contact form mutation hook
45:  │   ├─ useCategories.js
46:  │   ├─ useBanners.js
47:  │   └─ useProductSections.js
48:  ├─ store/                  # Zustand client stores (persisted to localStorage)
49:  │   ├─ authStore.js        # User profile, token, login dialog state, and auth actions
50:  │   ├─ cartStore.js        # Cart items, quantity steppers, bill calculations, drawer state
51:  │   └─ locationStore.js    # Delivery address, pincode & estimate
52:  ├─ components/
53:  │   ├─ ui/                 # shadcn/ui components (JS, tsx: false)
54:  │   │   ├── button.jsx     # Button with custom 'add' variant & rounded-xl
55:  │   │   ├── badge.jsx      # Badge with custom 'yellow' variant
56:  │   │   ├── input.jsx      # Form inputs
57:  │   │   ├── label.jsx      # Form labels
58:  │   │   ├── textarea.jsx   # Form textarea
59:  │   │   ├── accordion.jsx  # Expandable item details in orders
60:  │   │   ├── tabs.jsx       # Order status filter tabs
61:  │   │   ├── alert-dialog.jsx # Logout & delete confirmation modals
62:  │   │   ├── select.jsx     # State dropdown selector
63:  │   │   ├── radio-group.jsx# Address type selector (Home/Work/Other)
64:  │   │   ├── checkbox.jsx   # Default address checkbox
65:  │   │   ├── skeleton.jsx   # Shimmer loading skeleton
66:  │   │   ├── sheet.jsx      # Cart side-drawer
67:  │   │   ├── drawer.jsx     # Mobile bottom sheet drawer
68:  │   │   ├── dialog.jsx     # Location selector & address dialogs
69:  │   │   ├── dropdown-menu.jsx # User profile / auth menu
70:  │   │   ├── separator.jsx  # Dividers
71:  │   │   ├── scroll-area.jsx# Smooth scroll container
72:  │   │   ├── sonner.jsx     # Toast notifications
73:  │   │   ├── tooltip.jsx    # Accessible tooltips
74:  │   │   ├── avatar.jsx     # Profile avatars
75:  │   │   ├── card.jsx       # Card wrappers
76:  │   │   └── carousel.jsx   # Embla carousel with autoplay
77:  │   ├─ auth/
78:  │   │   ├── LoginDialog.jsx # Responsive modal with Indian mobile validation
79:  │   │   └── ProtectedRoute.jsx # Route guard redirecting to home with login modal
80:  │   ├─ profile/
81:  │   │   ├── ProfileSidebar.jsx # User avatar, phone, navlinks, and logout alert
82:  │   │   ├── OrderCard.jsx   # Thumbnails, status badges, accordion bill, reorder
83:  │   │   ├── AddressCard.jsx # Address badges, edit/delete actions, default toggle
84:  │   │   └── AddressForm.jsx # Reusable form with validation for add/edit addresses
85:  │   ├─ common/
86:  │   │   ├── ResponsiveModal.jsx # Adaptive modal (Dialog on desktop, Drawer on mobile)
87:  │   │   ├── ResponsiveSheet.jsx # Adaptive sheet (Sheet on desktop, Drawer on mobile)
88:  │   │   ├── PhoneInput.jsx  # Reusable +91 numeric input with inline error
89:  │   │   ├── PageHeader.jsx  # Page title, subtitle, and breadcrumbs
90:  │   │   ├── ContentPage.jsx # Sticky Table of Contents & readable policy content layout
91:  │   │   ├── ScrollToTop.jsx # Automatic window scroll to top on route transitions
92:  │   │   ├── Container.jsx   # Max-width 1180px centered page container
93:  │   │   ├── SectionHeader.jsx
94:  │   │   ├── EmptyState.jsx
95:  │   │   └── ErrorState.jsx
96:  │   ├─ layout/
97:  │   │   ├── Navbar.jsx      # Two-row mobile / single-row desktop sticky navbar
98:  │   │   ├── BottomNav.jsx   # Fixed mobile bottom navigation bar with cart badge
99:  │   │   ├── Footer.jsx      # Links to static pages, categories, and copyright
100:  │   │   ├── MainLayout.jsx  # Parent layout mounting Navbar, Container, Footer, Overlays
101:  │   │   ├── FloatingCartBar.jsx # Sticky bottom summary bar with dynamic bottom offsets
102:  │   │   └── CartDrawer.jsx  # Adaptive cart drawer with bill breakdown and steppers
103:  │   ├─ product/             # ProductCard, AddToCartButton, QuantityStepper, ProductRow
104:  │   ├─ category/            # CategoryCard, CategoryGrid
105:  │   └─ banner/              # BannerCarousel
 │   ├─ product/             # ProductCard, AddToCartButton, QuantityStepper, ProductRow
 │   ├─ category/            # CategoryCard, CategoryGrid
 │   └─ banner/              # BannerCarousel
 ├─ pages/
 │   ├─ Home.jsx             # Home page (banners, categories, product rows)
 │   ├─ ContactUs.jsx        # Support cards & inquiry form
 │   ├─ PrivacyPolicy.jsx    # Privacy policy with Table of Contents
 │   ├─ TermsAndConditions.jsx # Terms with Table of Contents
 │   ├─ NotFound.jsx         # 404 page with recovery action
 │   └─ Profile/
 │        ├── ProfileLayout.jsx # Protected layout with desktop sidebar & mobile tabs
 │        ├── Orders.jsx        # Order history with status filter tabs
 │        └── Addresses.jsx     # Saved addresses management with add/edit dialog
 ├─ utils/
 │   ├─ constants.js         # Central ROUTES object, USE_DUMMY_DATA, and config
 │   ├─ validators.js        # isValidIndianMobile, isValidEmail, isValidPincode, maskPhoneNumber
 │   ├─ formatPrice.js       # Indian Rupee (INR) currency formatter
 │   ├─ formatDate.js        # Date & timestamp formatter ("23 Oct 2026, 02:30 PM")
 │   └─ formatPhone.js       # Phone formatter ("+91 98765 43210")
 ├─ App.jsx
 └─ main.jsx
```

---

## 1. Typography & Font Configuration

The application uses **Poppins** via `@fontsource/poppins` exclusively:
- Installed weights: `400`, `500`, `600`, and `700`.
- Imported in `src/main.jsx`.
- Configured via `--font-sans: "Poppins", sans-serif` in `src/index.css` and `tailwind.config.js`.
- Proportions:
  - **Body text**: `14px` with `1.5` line-height for optimal legibility.
  - **Product names**: `13px` to `14px`, 2-line clamped.
  - **Product weights**: `12px` muted text.
  - **Section headings**: `20px` with `font-weight: 600`.
  - **Buttons**: `13px` to `14px` with `font-weight: 500` or `600`.

---

## 2. Profile Section & Route Guarding

### Route Protection ([ProtectedRoute.jsx](file:///d:/food/src/components/auth/ProtectedRoute.jsx))
- All `/profile` routes are wrapped with `<ProtectedRoute>`.
- If an unauthenticated user accesses `/profile`, they are redirected to `/` (`replace: true`), a Sonner toast displays *"Please login to continue"*, and the `LoginDialog` opens automatically.
- Upon login, the user can navigate to `/profile` and its nested views.

### Profile Layout ([ProfileLayout.jsx](file:///d:/food/src/pages/Profile/ProfileLayout.jsx))
- **Desktop**: Two-column layout with sticky left sidebar card and active sub-view on the right.
- **Mobile**: Responsive horizontal navigation and stacked content.
- **Sidebar Header**: Displays user avatar, name, and formatted phone (`+91 XXXXX XXXXX`).
- **Sidebar Menu**: Configured in `src/data/profileMenu.js` using `NavLink` with primary active highlights.
- **Logout Action**: Triggers an `AlertDialog` confirmation (*"Are you sure you want to logout?"* -> Cancel / Logout). On confirmation, clears `authStore`, navigates to `/`, and shows a toast.

### My Orders ([Orders.jsx](file:///d:/food/src/pages/Profile/Orders.jsx))
- Displays list of orders sorted newest first using [OrderCard.jsx](file:///d:/food/src/components/profile/OrderCard.jsx).
- **Status Badges**:
  - `Delivered`: Green badge with `CheckCircle2` icon.
  - `On the way`: Primary purple badge with `Truck` icon.
  - `Cancelled`: Red badge with `XCircle` icon.
- **Thumbnails Preview**: Shows first 4 item images with a `+N more` counter.
- **Expandable Details**: Built with shadcn **Accordion**, displaying each item's name, weight, quantity, unit price, delivery address, and bill summary.
- **Reorder**: Adds all items from the order directly to the cart, opens the `CartDrawer`, and shows a Sonner confirmation toast.
- **Filter Tabs**: Built with shadcn **Tabs** to filter between *All*, *Delivered*, and *Cancelled*.

### Saved Addresses ([Addresses.jsx](file:///d:/food/src/pages/Profile/Addresses.jsx))
- Displays cards with address type icons (Home, Work, Other), full address, contact details, and a *Default Address* badge.
- **Actions**:
  - **Edit**: Opens pre-filled [AddressForm.jsx](file:///d:/food/src/components/profile/AddressForm.jsx).
  - **Delete**: Prompts a shadcn **AlertDialog** confirmation. If the deleted address was default, the next available address automatically becomes default.
  - **Set as Default**: One-click default address switcher.
- **Add New Address Dialog**: Includes validated fields for Name, Phone (+91), House/Flat No, Street/Area, Landmark, City, State (shadcn **Select**), Pincode (6-digit validation), Address Type (shadcn **RadioGroup**), and default checkbox (shadcn **Checkbox**).
- **Navbar Location Sync**: When logged in, the Navbar location indicator automatically displays the user's default saved address.

---

## 3. Switching Orders and Addresses to the Real API

Switching from dummy data to the real API is a **one-line change**:

1. In [src/utils/constants.js](file:///d:/food/src/utils/constants.js):
   ```javascript
   export const USE_DUMMY_DATA = false;
   ```
2. Provide your API base URL in `.env`:
   ```env
   VITE_API_URL=https://api.yourdomain.com/v1
   ```
3. How the endpoints work in [src/api/orderApi.js](file:///d:/food/src/api/orderApi.js) and [src/api/addressApi.js](file:///d:/food/src/api/addressApi.js):
   - `getOrders()` -> `GET /orders`
   - `getAddresses()` -> `GET /addresses`
   - `addAddress(data)` -> `POST /addresses`
   - `updateAddress(id, data)` -> `PUT /addresses/:id`
   - `deleteAddress(id)` -> `DELETE /addresses/:id`
   - `setDefaultAddress(id)` -> `PATCH /addresses/:id/default`
   All TanStack Query mutation hooks (`useAddAddress`, `useUpdateAddress`, `useDeleteAddress`, `useSetDefaultAddress`) automatically invalidate the `['addresses']` cache query upon response.

---

## 4. Product Detail Flow & API Architecture

### Product Detail Page Flow ([ProductDetail.jsx](file:///d:/food/src/pages/ProductDetail.jsx))
1. **Navigation**:
   - Clicking any `ProductCard` image or title navigates to `/product/:slug` via `ROUTES.PRODUCT_DETAIL(slug)`.
   - The `AddToCartButton` uses `e.stopPropagation()` and sits outside `<Link>`, allowing instant cart actions without triggering navigation.
   - [ScrollToTop.jsx](file:///d:/food/src/components/common/ScrollToTop.jsx) automatically resets the viewport to the top on page open.
2. **Desktop Layout**:
   - **Breadcrumb**: `Home > Category name > Product name` using shadcn `Breadcrumb`.
   - **Left Column (~50%)**: [ProductImageGallery.jsx](file:///d:/food/src/components/product/ProductImageGallery.jsx) with vertical thumbnail strip, aspect-square main image with cursor-follow CSS zoom (`scale(1.85)`), skeleton shimmer loader, and full-screen preview `Dialog`.
   - **Right Column (~50%)**: [ProductInfo.jsx](file:///d:/food/src/components/product/ProductInfo.jsx) (sticky on scroll) featuring brand, title, dummy ratings & reviews, 10-minute delivery badge, price with discount tag, variant chips, large `AddToCartButton`, and trust guarantee badges.
   - **Below Both**: [ProductDetailsTabs.jsx](file:///d:/food/src/components/product/ProductDetailsTabs.jsx) rendering `Product Details`, key-value specs table, `Ingredients`, `Nutrition Info`, `Storage`, and `Return & Refund Policy`.
   - **Similar Products**: Rendered with the reusable [ProductRow.jsx](file:///d:/food/src/components/product/ProductRow.jsx) fed by `useSimilarProducts(slug)`.
3. **Mobile Layout**:
   - Swipeable shadcn `Carousel` with animated dot indicators.
   - Responsive shadcn `Accordion` for product details and nutritional breakdown.
   - Fixed bottom action bar with active price, discount, and large Add/Stepper button.
4. **Cart & Variant Compatibility**:
   - Cart item identity supports variants: `key = variantId ? `${product.id}-${variantId}` : product.id`.
   - Adding a variant preserves the specific pack size, price, and updates both `CartDrawer` and `FloatingCartBar` with weight labels (e.g. `(1 L)`).
   - Old/legacy items in `localStorage` without a variant resolve cleanly without throwing errors.

### Product Data Shape
```javascript
{
  id: 'p-101',
  name: 'Amul Taaza Toned Fresh Milk Pouch',
  slug: 'amul-taaza-toned-fresh-milk-pouch',
  brand: 'Amul',
  image: 'https://images.unsplash.com/...', // Main thumbnail
  images: [                                 // High-res gallery images
    'https://images.unsplash.com/...',
    'https://images.unsplash.com/...'
  ],
  weight: '500 ml',
  price: 28,
  mrp: 30,
  discountPercent: 7,
  deliveryTime: '8 mins',
  inStock: true,
  categorySlug: 'dairy-bread-eggs',
  categoryName: 'Dairy, Bread & Eggs',
  rating: 4.8,
  reviewCount: 4210,
  description: 'Amul Taaza fresh toned milk is pasteurised and homogenized with 3.0% fat...',
  highlights: [
    '10-minute instant doorstep delivery',
    'Pure pasteurised toned milk with no adulteration',
    'Rich in Vitamin D and Calcium'
  ],
  specs: [
    { label: 'Brand', value: 'Amul' },
    { label: 'Type', value: 'Pasteurised Toned Milk' },
    { label: 'Shelf Life', value: '2 Days from packing' },
    { label: 'Country of Origin', value: 'India' },
    { label: 'FSSAI License', value: '10012021000071' },
    { label: 'Manufacturer', value: 'Gujarat Co-operative Milk Marketing Federation Ltd.' },
    { label: 'Seller', value: 'QuickMart Dark Store Retail' }
  ],
  ingredients: 'Toned Milk, Vitamin A, Vitamin D2.',
  nutrition: [
    { label: 'Energy', value: '58.2 kcal' },
    { label: 'Protein', value: '3.1 g' },
    { label: 'Total Fat', value: '3.0 g' },
    { label: 'Carbohydrate', value: '4.7 g' },
    { label: 'Calcium', value: '120 mg' }
  ],
  storage: 'Store refrigerated below 4°C at all times. Consume within 2 days of opening.',
  variants: [
    {
      id: 'v-101-500',
      label: '500 ml Pouch',
      weight: '500 ml',
      price: 28,
      mrp: 30,
      discountPercent: 7,
      inStock: true
    },
    {
      id: 'v-101-1000',
      label: '1 L Pouch',
      weight: '1 L',
      price: 54,
      mrp: 60,
      discountPercent: 10,
      inStock: true
    }
  ]
}
```

### Switching Product Detail to the Real API
Set `USE_DUMMY_DATA = false` in [src/utils/constants.js](file:///d:/food/src/utils/constants.js):
- `getProductBySlug(slug)`: Calls `GET /products/${slug}` via Axios instance.
- `getSimilarProducts(slug)`: Calls `GET /products/${slug}/similar` via Axios instance.
- Handled gracefully via `useProduct(slug)` and `useSimilarProducts(slug)` with automatic 404 detection and retry logic.

---

## 5. Responsive Guidelines (Mobile-First Architecture)

QuickMart treats **mobile as the primary experience** and desktop as the progressive enhancement.

### Breakpoint Strategy
- **320px - 412px (Mobile Phones)**: Base Tailwind classes (`w-full`, `grid-cols-2`, `p-4`). All layouts are strictly validated down to 320px screen width without any horizontal scrolling (`overflow-x: clip`).
- **768px (`md:`, Tablet)**: Breakpoint switching from mobile Bottom Navigation and two-row header to single-row desktop navigation with header Cart button.
- **1024px (`lg:`, Laptop)**: Multi-column product layouts, sticky sidebar columns.
- **1280px+ (`xl:`, Desktop)**: Expanded product rows and maximum container widths (`max-w-[1180px]`).

### Responsive UI Components
1. **`ResponsiveModal` (`src/components/common/ResponsiveModal.jsx`)**:
   - On **Mobile (<768px)**: Renders a swipeable **shadcn Drawer** bottom sheet with a top drag handle, automatic `max-h-[90dvh]`, scrollable content, and safe-area padding.
   - On **Desktop (≥768px)**: Renders a centered **shadcn Dialog**.
   - Props: `open`, `onOpenChange`, `title`, `description`, `children`, `footer`.
   - Used in: `LoginDialog`, `Addresses` (Add/Edit address), and `Navbar` Location selector.

2. **`ResponsiveSheet` (`src/components/common/ResponsiveSheet.jsx`)**:
   - On **Mobile (<768px)**: Renders a bottom sheet **shadcn Drawer** (`max-h-[90dvh]`) with sticky checkout action bar and safe-area insets.
   - On **Desktop (≥768px)**: Renders a right-aligned **shadcn Sheet** (~420px wide).
   - Used in: `CartDrawer`.

### Navigation & Stacking Layout
- **Mobile Navbar**: Two-row header (Row 1: Logo + Truncated delivery location + Login/Avatar; Row 2: Full-width search bar). Cart button is hidden on mobile header since cart is accessible via `BottomNav` and `FloatingCartBar`.
- **Bottom Navigation (`src/components/layout/BottomNav.jsx`)**: Fixed bottom bar visible only on mobile (`md:hidden`) with `Home`, `Categories`, `Cart` (with dynamic badge), and `Profile/Login`. Automatically hides on Product Detail page (which has its own action bar) and when the cart drawer is open.
- **Bottom Offset Management**:
  - Main page content and footer include bottom padding (`pb-28 sm:pb-14` / `safe-bottom`) so fixed controls never obscure content.
  - `FloatingCartBar` dynamically offsets above the `BottomNav` using:
    `bottom-[calc(56px+max(env(safe-area-inset-bottom,0px),8px)+8px)]` on standard pages, and `bottom-[calc(76px+max(env(safe-area-inset-bottom,0px),8px)+8px)]` on product detail pages.
- **Toasts (`Sonner`)**: Responsive positioning — `top-center` on mobile (preventing collision with bottom bars) and `bottom-right` on desktop.

### Touch Targets & iOS Safari Optimizations
- **44x44px minimum touch targets**: All buttons, stepper plus/minus controls, icons, menu items, and category chips maintain comfortable tap targets and tap highlights are disabled (`-webkit-tap-highlight-color: transparent`).
- **16px input font size on mobile**: Enforced via `@media (max-width: 767px) { input, select, textarea { font-size: 16px !important; } }` in `src/index.css` to prevent iOS Safari auto-zoom on field focus.
- **Safe Area Insets**: Handled across all fixed bars using `env(safe-area-inset-bottom)` and `env(safe-area-inset-top)`.

### How to Add a New Page Responsively
1. **Lazy Loading**: Import the new page via `React.lazy()` in `src/App.jsx` wrapped inside `<Suspense fallback={<PageSkeleton />}>`.
2. **Container**: Wrap page content with `<Container className="py-4 md:py-6">`.
3. **Mobile-First Layout**:
   - Default to single-column stacking: `flex flex-col md:flex-row`.
   - For grids, use: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`.
   - For horizontal scrollable product rows, use `.scroll-row` with `-mx-4 px-4 sm:mx-0 sm:px-0`.
4. **Modals & Popups**: Always use `ResponsiveModal` instead of raw `Dialog` so it seamlessly becomes a bottom sheet on mobile.
5. **Inputs**: Use proper `inputMode` (`numeric`, `email`, `tel`) and `autoComplete` attributes.

---

## 6. Category Pages & Products Architecture

### Routing & Navigation
- Route: `/category/:slug` defined via `ROUTES.CATEGORY(slug)` in [src/utils/constants.js](file:///d:/food/src/utils/constants.js).
- Clicking any category from the **"Shop by category"** grid on the Home page, or clicking **"See all >"** on any product section carousel, immediately routes to that category's dedicated listing page.

### Features & Layout ([CategoryDetail.jsx](file:///d:/food/src/pages/CategoryDetail.jsx))
1. **Breadcrumbs & Navigation**:
   - `Home > Categories > [Category Name]` with quick back-button on mobile.
2. **Hero Header Banner**:
   - Displays category icon, title, 10-minute delivery badge, and real-time product count.
3. **Quick Category Switcher Bar**:
   - Horizontal `.scroll-row` containing chips for all 20 categories, allowing seamless jumping between categories directly without returning to the homepage. Active category is highlighted in solid primary purple.
4. **Sort & Filter Toolbar**:
   - **Sort options**: Popularity / Recommended, Price: Low to High, Price: High to Low, Highest Discount, and Customer Rating.
   - **Filter**: In-Stock Only filter button.
5. **Responsive Product Grid**:
   - Mobile-first layout: 2 columns on phones (`grid-cols-2`), 3 on tablets (`sm:grid-cols-3`), 4 on laptops (`md:grid-cols-4`), and 5 on large displays (`lg:grid-cols-5`).
   - Reuses [ProductCard.jsx](file:///d:/food/src/components/product/ProductCard.jsx) with instant Add/Stepper actions and clickable navigation to Product Detail (`/product/:slug`).
6. **Data & Fallback**:
   - Powered by [useCategoryProducts(slug)](file:///d:/food/src/hooks/useCategoryProducts.js) and `extraCategoryProducts.js`, ensuring every single one of the 20 quick-commerce categories has realistic products with INR pricing, images, and delivery badges.

---

## 7. Checkout Flow & Order Success Architecture

### Routes & Guards
- **Checkout Page**: `/checkout` (protected by `<ProtectedRoute>`).
- **Order Success Page**: `/order-success/:orderId` (protected by `<ProtectedRoute>`).
- **Unauthenticated User Handling**:
  - If an unauthenticated user attempts to visit `/checkout` or clicks *"Proceed to checkout"* in `CartDrawer`, `useRequireLogin` intercepts the action, opens `LoginDialog`, and saves the intended path in `authStore.redirectAfterLogin`.
  - Once phone login completes, the user is automatically redirected to `/checkout`.
- **Empty Cart Protection**:
  - Visiting `/checkout` with an empty cart immediately redirects to `/` with a Sonner toast notification (*"Your cart is empty"*).
- **Overlay Suppression**:
  - Both `BottomNav` and `FloatingCartBar` automatically hide on `/checkout` and `/order-success` to prevent layout interference and allow dedicated mobile checkout action bars.

### Page Structure ([pages/Checkout/Checkout.jsx](file:///d:/food/src/pages/Checkout/Checkout.jsx))
The checkout page uses 4 collapsible, numbered step sections ([CheckoutSection.jsx](file:///d:/food/src/components/checkout/CheckoutSection.jsx)):
1. **Delivery Address**:
   - Loads saved addresses with `useAddresses`.
   - Rendered using [AddressCard.jsx](file:///d:/food/src/components/profile/AddressCard.jsx) in `selectable` radio mode.
   - Seamless add/edit address via [AddressForm.jsx](file:///d:/food/src/components/profile/AddressForm.jsx) embedded inside `ResponsiveModal` (bottom sheet on mobile, dialog on desktop).
   - **Serviceability Check**: Real-time dummy pincode check (`checkServiceability`). Unserviceable addresses show an inline alert (*"We don't deliver here yet"*) and disable order placement.
   - **Delivery Instructions**: Reusable [DeliveryInstructions.jsx](file:///d:/food/src/components/checkout/DeliveryInstructions.jsx) with 200-character counter and quick chips (*"Ring the bell"*, *"Leave at the door"*, *"Call before arriving"*).
2. **Delivery Time**:
   - [DeliverySlotPicker.jsx](file:///d:/food/src/components/checkout/DeliverySlotPicker.jsx) with shadcn `RadioGroup`.
   - Options: *"Deliver now (10 to 15 mins)"* and *"Schedule for later"*.
   - Schedule picker provides day switcher (*Today* / *Tomorrow*) and time slots from `data/deliverySlots.js`. Past slots for today and full slots are automatically disabled.
3. **Order Review**:
   - Compact list of cart items with image thumbnail, title, weight/variant, price, and [QuantityStepper.jsx](file:///d:/food/src/components/product/QuantityStepper.jsx).
   - Real-time cart revalidation via `useValidateCart`. Any out-of-stock items block checkout until updated.
4. **Payment Method**:
   - [PaymentMethodSelector.jsx](file:///d:/food/src/components/checkout/PaymentMethodSelector.jsx) supporting UPI, Credit/Debit Card, and Cash on Delivery.
   - **UPI**: Validates format (`name@bank`) with simulated 500ms dummy verification checkmark.
   - **Credit / Debit Card**: Pure local state only (never in Zustand, localStorage, query cache, or logs). Masked inputs, Luhn algorithm verification, card brand detection (`Visa`, `Mastercard`, `RuPay`, `Amex`), and expiry/CVV validation.
   - **Cash on Delivery**: Enforces max order limit of ₹5,000.

### Bill Calculation & `BILL_CONFIG`
Centralized in pure function `calculateBill` ([src/utils/billCalculator.js](file:///d:/food/src/utils/billCalculator.js)) and shared identically between `CartDrawer` and `OrderSummary`:
```javascript
export const BILL_CONFIG = {
  FREE_DELIVERY_THRESHOLD: 199, // Free delivery on orders above ₹199
  STANDARD_DELIVERY_FEE: 25,   // Standard delivery fee is ₹25
  HANDLING_FEE: 5,             // Platform handling fee is ₹5
  SMALL_CART_THRESHOLD: 99,    // Orders below ₹99 incur small cart fee
  SMALL_CART_FEE: 20,          // Small cart fee is ₹20
  SCHEDULED_DELIVERY_FEE: 0,   // Scheduled delivery fee is ₹0
};
```

### Dummy Coupons ([src/data/coupons.js](file:///d:/food/src/data/coupons.js))
- **`FIRST50`**: Flat ₹50 off on orders above ₹299.
- **`SAVE10`**: 10% off up to ₹100 on orders above ₹199.
- **`FREEDEL`**: 100% free delivery on any order value.
- Available coupons can be browsed and applied via the *"View all available coupons"* modal in [CouponInput.jsx](file:///d:/food/src/components/checkout/CouponInput.jsx).

### Test Cases & QA Validation
| Test Case | Action | Expected Behavior |
| :--- | :--- | :--- |
| **Payment Failure Simulation** | Select UPI and enter ID `fail@upi` | Order placement fails after 1500ms. Inline `PaymentFailed` component appears with *"Try again"* and *"Choose another method"* buttons. Cart and inputs remain intact. |
| **Unserviceable Pincode** | Add/Select address with pincode outside `1100xx`, `1220xx`, `2013xx` (e.g. `400001`) | Inline warning *"We don't deliver to this pincode yet"* displays on card. Place Order button is disabled. |
| **Empty Cart Redirect** | Direct URL navigation to `/checkout` with 0 items | Immediately redirects to `/` with Sonner toast *"Your cart is empty"*. |
| **COD Order Limit** | Cart total exceeds ₹5,000 | COD option is disabled with reason *"COD is not available for orders above ₹5,000"*. |
| **Out of Stock Simulation** | Run `window.__TEST_CART_OUT_OF_STOCK__ = true` in console | Order Review section flags first item as out-of-stock and blocks checkout. |
| **Form Error Scroll** | Click *"Place Order"* with missing address/payment | Viewport smoothly scrolls to and focuses on the first invalid section using `scrollToError.js`. |

### Order Success Page ([pages/Checkout/OrderSuccess.jsx](file:///d:/food/src/pages/Checkout/OrderSuccess.jsx))
- Displays animated green checkmark, Order ID, and estimated delivery time.
- Displays [OrderTimeline.jsx](file:///d:/food/src/components/checkout/OrderTimeline.jsx) (*Placed -> Packed -> On the way -> Delivered*).
- Shows delivery address, payment method, collapsible itemized bill summary, *"Track Order"* button (navigates to Profile Orders), and *"Continue Shopping"* button.

### Switching Checkout & Orders to Real Backend API
Set `USE_DUMMY_DATA = false` in `src/utils/constants.js`:
- `placeOrder(payload)` -> `POST /orders`
- `getOrderById(orderId)` -> `GET /orders/:id`
- `getDeliverySlots(day)` -> `GET /checkout/slots?day=today|tomorrow`
- `validateCart(items)` -> `POST /checkout/validate-cart`
- `applyCoupon(code, cartTotal)` -> `POST /checkout/apply-coupon`
- `checkServiceability(pincode)` -> `GET /addresses/serviceability/:pincode`



