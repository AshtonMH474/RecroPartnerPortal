# Recro Partner Portal

A [Next.js](https://nextjs.org/) + [TinaCMS](https://tina.io/) partner management platform with HubSpot integration, MongoDB authentication, and TailwindCSS.

**Key Features:**

- HubSpot CRM integration for deal tracking
- Partner-specific dashboards with personalized content
- Download tracking and activity history
- White papers, data sheets, and statements
- Deal submission and management
- JWT-based authentication with email verification

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have these installed on your system:

- **Node.js** v22 or higher → [download here](https://nodejs.org/)
- **npm** (comes with Node)
- **Git** (to clone the repo and work with TinaCMS)

---

### 2. Install Dependencies

Run the following command in the root(my-app) of the project to install all required packages:

```bash
npm install
```

---

## 3. Fill Out a `.env` File

Create a `.env` file in the root of the project.

You can use the provided `.env.example` as a template — copy all of the variables listed there into your new `.env` file and fill them out with the correct values for your environment.

---

## 4. Running the Server

Use the following commands depending on what you need:

- **Development server (Next.JS + TinaCMS)**
  ```bash
  npm run dev
  ```
- **Production server (Next.JS + TinaCMS)**
  ```bash
  npm run production
  ```
- **Build server (Next.JS + TinaCMS)**
  ```bash
  npm run build
  ```

---

## 5. Playwright Test

- **Use the following command to run all test:**

  ```bash
  npm run test:e2e
  ```

- **Run Specific Test File:**

  ```bash
     cd playwright
     npx playwright test playwright/tests/dashboard.spec.js
  ```

- **Test Credentials**

  Some tests require authentication. Make a `.env` file in the Playwright directory. Set these environment variables:

  ```bash
     TEST_USER_EMAIL=your@email.com
     TEST_PASSWORD=yourpassword
  ```

---

## 6. Content Editing with TinaCMS

For detailed instructions on editing content through TinaCMS, see [Quick Guide](quickGuide.md)

**Quick access**: Navigate to /admin to enter edit mode.

---

## 📁 Project Structure

```
RecroPartnerPortal/
├── src/
│   ├── components/           # React components
│   │   ├── Activity/         # Activity tracking with filters
│   │   ├── Cards/            # Reusable card components
│   │   ├── Dashboard/        # Main dashboard with personalized content
│   │   ├── Deals/            # Deal management (AllDeals, MyDeals, Filters)
│   │   ├── EditProfile/      # User profile editing with categories
│   │   ├── Materials/        # White papers, data sheets, statements viewer
│   │   ├── Nav/              # Navigation and mobile menu
│   │   ├── Sidebar/          # Fixed sidebar with profile
│   │   ├── Tickets/          # HubSpot ticket cards
│   │   ├── shared/           # Reusable UI components
│   │   ├── Login.jsx         # Login modal
│   │   ├── Register.jsx      # Registration modal
│   │   ├── DealForm.jsx      # Deal submission form
│   │   ├── Landing.jsx       # Public landing page
│   │   └── BG.jsx            # Background component
│   │
│   ├── context/              # React context providers
│   │   ├── auth.jsx          # Authentication & modal management
│   │   ├── downloads.jsx     # Download history tracking
│   │   └── materials.jsx     # Materials data context
│   │
│   ├── lib/                  # Utility functions and middleware
│   │   ├── auth_functions.js     # Login/signup/verification logic
│   │   ├── authMiddleware.js     # JWT verification middleware
│   │   ├── service_functions.js  # API service calls
│   │   ├── csrf.js               # CSRF protection
│   │   ├── rateLimit.js          # Rate limiting middleware
│   │   ├── sanitize.js           # Input validation
│   │   ├── mongodb.js            # MongoDB connection
│   │   └── tinaClient.js         # TinaCMS client
│   │
│   ├── pages/                # Next.js pages and API routes
│   │   ├── index.js          # Landing page
│   │   ├── dashboard.js      # Main partner dashboard
│   │   ├── papers.js         # White papers page
│   │   ├── sheets.js         # Data sheets page
│   │   ├── statements.js     # Performance statements
│   │   ├── activity.js       # Download activity
│   │   ├── deals.js          # All company deals
│   │   ├── profile-deals.js  # User's personal deals
│   │   │
│   │   └── api/              # Backend API routes
│   │       ├── session/      # Auth endpoints
│   │       ├── hubspot/      # HubSpot CRM integration
│   │       ├── userInfo/     # User data endpoints
│   │       ├── categories.js
│   │       └── download.js
│   │
│   └── styles/               # CSS
│       ├── globals.css
│       ├── cards.css
│       └── gears.css
│
├── content/                  # TinaCMS markdown content
│   ├── pages/                # Page content
│   ├── papers/               # White papers
│   ├── sheets/               # Data sheets
│   ├── statements/           # Performance statements
│   ├── categories/           # Interest categories
│   ├── nav/                  # Navigation config
│   └── footer/               # Footer content
│
├── playwright/               # End-to-end tests
│   ├── tests/
│   │   └── fixtures/
│   └── playwright.config.js
│
├── public/                   # Static assets
├── tina/                     # TinaCMS configuration
├── .env                      # Environment variables
├── .env.example
├── next.config.js
├── tailwind.config.js
└── package.json
```
