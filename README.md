# Admin App - Permissions Dashboard

A Next.js 14 application for managing permissions and access control.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Navigate to [http://localhost:3000/permissions](http://localhost:3000/permissions) to view the permissions overview page.

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - React components
  - `PermissionsOverview.tsx` - Main permissions page
  - `SecondaryNav.tsx` - Side navigation
  - `MainContent.tsx` - Main content area
  - `QuickActions.tsx` - Quick action cards
  - `StatsCards.tsx` - Statistics cards
  - `ProductUsage.tsx` - Product usage progress bars
  - `RecentActivity.tsx` - Recent activity list
  - `TopNavigation.tsx` - Top navigation bar
  - `LeftNavigation.tsx` - Left side navigation

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS 4
- CSS Variables for theming

## Design

The permissions overview page is based on the Figma design and includes:
- Top navigation with search
- Left sidebar navigation
- Secondary navigation panel
- Quick action cards (Add Member, Create Group)
- Statistics cards (Members, Products, Groups)
- Product usage progress bars
- Recent activity feed

