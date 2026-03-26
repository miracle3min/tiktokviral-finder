# 🔥 TikTok Viral Finder

Discover and analyze the most viral TikTok content with real-time engagement scoring. Features a beautiful claymorphism UI with soft, puffy 3D design elements.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

## ✨ Features

- **🔍 Smart Search** — Search any keyword to find trending TikTok videos
- **📊 Viral Score** — Proprietary scoring algorithm (0-100) based on engagement rate, share ratio, save ratio, velocity, and reach
- **🎨 Clay UI** — Beautiful claymorphism design with pastel gradients, glassmorphic cards, and smooth animations
- **📱 Responsive** — Mobile-first design with sm/md/lg breakpoints
- **⚡ Fast** — Server-side API with client-side caching and optimistic UI
- **🔄 Sort & Filter** — Sort by viral score, views, likes, shares, or recency

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A [RapidAPI](https://rapidapi.com) account with access to the TikTok Scraper API
- A [Neon](https://neon.tech) PostgreSQL database (optional, for search history)

### Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd tiktok-viral-finder

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your API keys (see below)

# 4. Run database migrations (optional)
npm run db:generate
npm run db:migrate

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RAPIDAPI_KEY` | ✅ | Your RapidAPI key for the TikTok Scraper API |
| `RAPIDAPI_HOST` | ❌ | API host (default: `tiktok-scraper17.p.rapidapi.com`) |
| `DATABASE_URL` | ❌ | Neon PostgreSQL connection string (for search history) |
| `NEXT_PUBLIC_APP_URL` | ❌ | App URL (default: `http://localhost:3000`) |

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling with custom clay theme |
| **Drizzle ORM** | Type-safe database queries |
| **Neon PostgreSQL** | Serverless Postgres for search history |
| **Axios** | HTTP client for TikTok API |
| **Lucide React** | Beautiful icons |

## 📁 Project Structure

```
src/
├── app/
│   ├── api/search/route.ts    # Search API endpoint
│   ├── globals.css            # Clay theme styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── EmptyState.tsx         # Initial empty state
│   ├── ErrorState.tsx         # Error display
│   ├── Header.tsx             # App header
│   ├── LoadingDots.tsx        # Loading indicator
│   ├── LoadingSkeleton.tsx    # Skeleton loading cards
│   ├── SearchBar.tsx          # Search input + trending tags
│   ├── VideoCard.tsx          # Individual video card
│   ├── VideoGrid.tsx          # Video grid with sorting
│   └── ViralScore.tsx         # Circular score indicator
├── hooks/
│   └── useSearch.ts           # Search state management
├── lib/
│   ├── db/
│   │   ├── index.ts           # Database connection
│   │   └── schema.ts          # Drizzle schema
│   ├── logger.ts              # Structured logging
│   ├── tiktok-api.ts          # TikTok API client
│   ├── utils.ts               # Utility functions
│   └── viral-score.ts         # Viral score algorithm
└── types/
    └── index.ts               # TypeScript interfaces
```

## 🚢 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import your repo
3. Add your environment variables in the Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📊 Viral Score Algorithm

The viral score (0-100) is calculated from five weighted components:

| Component | Weight | Signal |
|-----------|--------|--------|
| Engagement Rate | 0-30 pts | (likes + comments + shares + saves) / views |
| Share Ratio | 0-25 pts | shares / views — strongest virality indicator |
| Save Ratio | 0-15 pts | saves / views — high-value content signal |
| Velocity | 0-20 pts | views per hour since posting |
| Reach | 0-10 pts | logarithmic scale of total views |

**Score Labels:**
- 🔴 **80-100**: Mega Viral
- 🟠 **60-79**: Viral
- 🟡 **40-59**: High
- 🟢 **20-39**: Medium
- ⚪ **0-19**: Low

## 📝 License

MIT — Not affiliated with TikTok or ByteDance.
