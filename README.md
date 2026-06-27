# PHORAMEC IMPORTS AVENUE — Technical Reference & Under the Hood

Welcome to the official developer reference manual for **PHORAMEC IMPORTS AVENUE**, a premium vanilla-stack e-commerce web application. This application was built specifically to transition a high-volume WhatsApp-based global procurement concierge service into an automated storefront.

This document serves as an educational guide explaining the engineering decisions, layout strategies, and DOM state coordination systems that power this single-page, multi-view application.

---

## 1. HTML Architecture (The View & Overlay Framework)

The `index.html` file provides a highly semantic, flat layout structure. It is optimized for speed, visual hierarchy, accessibility, and clean component segmentation.

```
+--------------------------------------------------------+
|                      NAVIGATION HEADER                 |
+--------------------------------------------------------+
|                                                        |
|   +-------------------+        +-------------------+   |
|   |   CUSTOMER VIEW   |        |    ADMIN VIEW     |   |
|   |     (active)      |        |     (hidden)      |   |
|   +-------------------+        +-------------------+   |
|                                                        |
+--------------------------------------------------------+
|                      PAGE FOOTER                       |
+--------------------------------------------------------+
|                    DRAWER & OVERLAYS                   |
|  - Cart Sidebar Drawer                                 |
|  - Checkout & Success Modals                           |
|  - Interactive Tour System                             |
+--------------------------------------------------------+
```

### Main Highlights of the DOM Architecture:
1. **Header Navigation Area (`<header id="main-header">`):**
   - Holds brand identities, search fields, category selectors, and toggle buttons. It is styled with `position: fixed` to serve as a persistent command bar across all views.
2. **Multi-View System (`<main>` Panel Viewports):**
   - Rather than loading separate web pages (which resets memory and cuts off dynamic tracking states), the app handles views as single-page panels:
     - `<div id="customer-view" class="view-panel active">`
     - `<div id="admin-view" class="view-panel">`
   - Switching views is done by swapping the `.active` utility class. The inactive pane is styled with `display: none`, and the active pane fades onto the screen via CSS `@keyframes fadeIn`.
3. **Modal & Sidebar Drawers (Body-level Overlays):**
   - The Shopping Cart (`#cart-drawer-overlay`), Checkout Forms (`#checkout-modal-overlay`), Order Placement Success (`#success-modal-overlay`), and the Interactive Tutorial (`#tour-overlay`) sit at the absolute root of the `<body>`.
   - Putting overlays at the body root prevents any nested parent styling (`overflow: hidden` or absolute z-indexes) from truncating or corrupting modal visibility.

---

## 2. CSS Mechanics (Theme Tokens & Responsive Grid)

Our `style.css` is built entirely with vanilla CSS3. It leverages custom properties (CSS variables), CSS Flexbox, and CSS Grid to structure a modern desktop-first precision, mobile-first code system.

### Custom Theme Variable Architecture
We define theme tokens inside `:root`. By updating these tokens on the parent, we trigger immediate, cascading visual updates across the layout.

```css
:root {
  /* Default Light Theme Values */
  --bg-primary: #fbfbfa;
  --bg-secondary: #ffffff;
  --text-primary: #181916;
  --primary-color: #0f3d30;
  --accent-color: #cfa45d;
  --card-shadow: 0 10px 30px -10px rgba(15, 61, 48, 0.08);
}

body.dark-theme {
  /* Dark Theme Values Override */
  --bg-primary: #0a0c0b;
  --bg-secondary: #121513;
  --text-primary: #f2f4f0;
  --primary-color: #21ce9f;
  --accent-color: #e6b973;
  --card-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.6);
}
```

The background transitions are smoothed globally:
`transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;`

### Fluid Mechanics: CSS Grid vs Flexbox
1. **Flexbox (Dynamic Rails & Navbars):**
   - Flexbox is utilized for 1D alignments where spacing must adjust based on child counts. For example, the Header container uses `display: flex; justify-content: space-between; align-items: center;` to keep branding on the left, search inputs centered, and buttons on the right.
   - On mobile, media queries shift the header into a multi-row column layout (`flex-direction: column`) to fit smaller screens.
2. **CSS Grid (High Density Product Catalog & Panels):**
   - Grids are ideal for 2D structured layouts. The product storefront uses the fluid `repeat(auto-fill, minmax(290px, 1fr))` pattern:
     ```css
     .product-grid {
       display: grid;
       grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
       gap: 30px;
     }
     ```
   - This grid automatically shrinks and packs rows/columns depending on screen widths, removing the need for manual viewport breakpoints.
3. **Desktop-First Precision vs. Mobile Responsive Layouts:**
   - Desktop views benefit from double-column grids in the Admin Workspace and the Custom Request Sourcing portal.
   - On screens smaller than `768px`, media queries collapse these grids into single vertical columns. The order tracking progress bar (`.track-timeline`) adapts by switching from a horizontal bar to a vertical timeline anchored to a left border.

---

## 3. JavaScript & Browser Web APIs

Our application logic (`app.js`) acts as the state manager and data bridge. It coordinates user actions, updates memory state, and triggers UI updates.

### Persistent Local Storage Pipeline
To prevent data loss on page refreshes, the application maintains state synchronizations with standard browser `localStorage`:

```
+------------------+         +-----------------------+         +---------------------+
|   User Interaction|  --->   | JS Memory State update|  --->   | localStorage Update |
+------------------+         +-----------------------+         +---------------------+
        ^                                                                 |
        |                                                                 v
+------------------+                                           +---------------------+
|    UI Render     |  <--------------------------------------  |  JSON State Sync    |
+------------------+                                           +---------------------+
```

- When the application boots, it reads raw string payloads using `localStorage.getItem("key")`.
- If no inventory, orders, or sourcing requests are detected, it seeds a list of initial mock products.
- When catalog updates, checkout forms, or status timelines are modified, the state object is stringified and saved back: `localStorage.setItem("key", JSON.stringify(data))`.

### Automatic System Theme Interception
The application automatically respects the visitor's OS preference using standard `window.matchMedia` media queries, while supporting manual overrides:

```javascript
function initTheme() {
  const savedTheme = localStorage.getItem("ph_theme_pref");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  if (savedTheme) {
    state.currentTheme = savedTheme; // Use manual preference if saved
  } else if (prefersDark.matches) {
    state.currentTheme = "dark";     // fallback to system default
  } else {
    state.currentTheme = "light";
  }
  applyTheme();
}
```

If the user clicks the toggle button, `toggleTheme()` runs, overriding the system preference, saving the change to local storage, and adding or removing the `.dark-theme` class on the `<body>` element.

### Array-Driven Walkthrough Tour Guide Engine
The interactive user tutorial reads step metadata from a structured array (`TOUR_STEPS`).
Each step specifies a `targetId` (the DOM element to highlight), a `title`, and educational details:

```javascript
const TOUR_STEPS = [
  {
    targetId: "logo-link",
    title: "Welcome to PHORAMEC IMPORTS AVENUE!",
    description: "Our famous Dubai, USA & UK WhatsApp concierge service has evolved..."
  },
  // ... extra steps
];
```

#### How Element Highlighting & Positioning Works:
1. **Dynamic Element Highlighting:**
   - The engine adds the `.tour-highlighted` class to the targeted element.
   - This class raises the target's `z-index` to sit above the darkened overlay (`#tour-overlay`) and adds a prominent outline with a pulsing drop shadow.
2. **Floating Desktop Placement:**
   - The engine calculates the target's exact screen position using `.getBoundingClientRect()`.
   - It computes the relative top and left spacing while accounting for current scroll positions:
     ```javascript
     const rect = targetElement.getBoundingClientRect();
     const scrollTop = window.scrollY;
     const scrollLeft = window.scrollX;
     
     let boxTop = rect.bottom + scrollTop + 15;
     let boxLeft = rect.left + scrollLeft;
     ```
3. **Centered Mobile Safe-Fallbacks:**
   - On mobile screens (width < `768px`), absolute positioning near elements can cause truncation or layout overflows. 
   - The engine detects smaller screens and switches the tour box to a centered layout (`position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)`) to guarantee a smooth reading experience on all devices.

---

## 4. Operational Workflows & WhatsApp Coordination

The application acts as a simulation bridge, replicating the original WhatsApp business flow with enhanced automation.

1. **Custom Sourcing Workflow (Concierge Sourcing):**
   - Customers submit custom item specifications, budget parameters, and reference images.
   - These requests are added to `localStorage` under `ph_custom_requests` and immediately register in the Sourcing Tracking timeline.
   - In **Admin Mode**, the business owner reviews incoming requests and can advance their status through key steps (e.g., *Pending Review* $\rightarrow$ *Quoted* $\rightarrow$ *Procured* $\rightarrow$ *Delivered*).
   - Updates made in Admin Mode reflect instantly in the customer's order tracker.
2. **Direct WhatsApp Checkout stub:**
   - Standard orders in the catalog go through a secure payment gateway simulation.
   - Upon confirming the simulated checkout, the app generates a text receipt summarizing the transaction.
   - The receipt features a **Send Stub to WhatsApp** button. When clicked, it opens a pre-formatted message link containing transaction IDs, ordered items, totals, and logistics destinations, allowing customers to easily finalize manual mobile money or bank transfers with the Phoramec sales office.
