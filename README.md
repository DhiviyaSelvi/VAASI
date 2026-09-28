# Vaasi - Peer-to-Peer Secondhand Book Exchange (Coimbatore)

Vaasi is a web-first, mobile-responsive peer-to-peer thrift book exchange application built for Coimbatore, India. Buyers and sellers list, browse, chat, and schedule in-person handovers for pre-loved books.

---

## Architecture & Data Access Rule

> [!IMPORTANT]
> **STRICT DATA ACCESS RULE**:
> Pages and UI components must **NEVER** directly import `src/data/mockData.js`. 
> All data fetching, mutations, and user state MUST flow through the service abstraction layer in `src/services/` or custom hooks in `src/hooks/`.

### Architecture Flow:
`UI Component / Page` ➔ `Custom Hook (e.g., useListings)` ➔ `Service Layer (e.g., listingsService)` ➔ `Data Source (Mock Data now / Firebase later)`

---

## Folder Structure

```text
vaasi-app/
├── index.html              # HTML shell with Google Fonts (Zilla Slab & Work Sans) & SEO meta
├── package.json            # React 18, Vite, react-router-dom v6
├── vite.config.js          # Vite configuration
├── README.md               # Project documentation and architectural guidelines
└── src/
    ├── main.jsx            # React root entry point
    ├── App.jsx             # RouterProvider setup
    ├── routes.jsx          # Central route table definition
    ├── styles/
    │   ├── tokens.css      # Design tokens (Teal, Marigold, Paper, Ink, Radii, Shadows, Spacing)
    │   └── global.css      # Global reset, typography, layout, & @media (min-width: 860px) queries
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx       # Header bar (Logo & Locality visible at all sizes; Nav links hide <860px)
    │   │   ├── BottomNav.jsx    # Mobile bottom navigation bar (visible <860px)
    │   │   └── PageShell.jsx    # Conditional layout shell (hides nav elements on /login)
    │   ├── books/
    │   │   ├── BookCard.jsx       # Book card component
    │   │   ├── ConditionBadge.jsx # Condition badge indicator
    │   │   └── ShelfRow.jsx       # Grid / Shelf layout wrapper
    │   └── common/
    │       ├── Button.jsx         # Button component with design tokens
    │       └── EmptyState.jsx     # Reusable empty state display
    ├── pages/
    │   ├── Login.jsx       # /login placeholder
    │   ├── Browse.jsx      # / (Browse) placeholder using useListings hook
    │   ├── BookDetail.jsx  # /book/:id placeholder
    │   ├── Sell.jsx        # /sell placeholder
    │   ├── Chat.jsx        # /chat placeholder
    │   ├── Profile.jsx     # /profile placeholder
    │   └── NotFound.jsx    # 404 route placeholder
    ├── services/
    │   ├── authService.js     # Auth service interface (mock delay + Firebase annotations)
    │   ├── listingsService.js # Listings service interface (mock delay + Firebase annotations)
    │   ├── chatService.js     # Chat service interface (mock delay + Firebase annotations)
    │   └── storageService.js  # File storage interface (mock delay + Firebase annotations)
    ├── data/
    │   ├── constants.js    # JSDoc schemas (@typedef), CONDITIONS, CATEGORIES, LOCALITIES
    │   └── mockData.js     # Seed data for development
    └── hooks/
        └── useListings.js  # Custom hook wrapping listingsService
```

---

## Navigation & Breakpoint Rules
1. **Header Header Bar**: Brand logo ("Vaasi") and location pill ("📍 Coimbatore") remain visible on **all screen sizes**.
2. **Navigation Bar**:
   - Above **860px** (Desktop): Desktop links show in Header; `BottomNav` is hidden.
   - Below **860px** (Mobile): Header nav links hide; `BottomNav` appears fixed at the bottom.
3. **Login Exception**: Neither navigation bar displays on `/login`.

---

## Available Scripts

In the `vaasi-app` directory, you can run:

```bash
npm install     # Install dependencies
npm run dev     # Starts Vite development server
npm run build   # Compiles production bundle
npm run preview # Preview production build locally
```
