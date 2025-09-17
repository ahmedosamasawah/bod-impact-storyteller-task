# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start Development Server:**

```bash
npm run dev
```

Server runs on http://localhost:8081 (Vite auto-selects available port)

**Build Commands:**

```bash
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
```

**Code Quality:**

```bash
npm run lint         # ESLint with TypeScript
```

No test runner is configured in this project.

## Architecture Overview

### Tech Stack

- **Frontend**: React 18.3.1 with TypeScript and Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API + Custom Hooks (simplified)
- **Routing**: React Router v6
- **Data Fetching**: MockAPI.io with direct API calls
- **Charts**: Recharts library

### Application Structure

**Context Providers (Provider Pattern):**
The app uses a nested provider pattern in `App.tsx`:

```
ErrorBoundary > Theme > Language > Auth > Tooltip > Router
```

*Note: Removed QueryClient for junior-friendly architecture*

**Key Contexts:**

- `AuthContext` - Mock authentication with demo credentials (demo@bod.consulting / demo123)
- `ThemeContext` - Light/dark theme toggle with system preference detection
- `LanguageContext` - Internationalization support

**Layout Architecture:**

- `DashboardLayout` - Main layout with collapsible sidebar using shadcn/ui sidebar components
- `DashboardSidebar` - Navigation with BarChart3, Users, FolderOpen icons
- `DashboardHeader` - Top bar with user profile and theme toggle

**API Layer:**

- `src/services/api.ts` - Simplified API service with direct MockAPI calls
- Uses MockAPI.io for Projects and Team Members endpoints
- Includes mock data for metrics and chart visualization
- Simple fetch + useState patterns instead of complex query management

**Page Structure:**

- `/` - Dashboard (Index) with metrics overview
- `/metrics` - Analytics page with charts
- `/projects` - Data table for project management
- `/login` - Authentication page
- Protected routes require authentication

### Component Organization

**UI Components:**

- `src/components/ui/` - shadcn/ui component library (fully implemented)
- All components follow consistent variant patterns (default, hero, success, warning, outline)

**Feature Components:**

- `src/components/impact/ImpactChart.tsx` - Recharts integration
- `src/components/shared/DataTable.tsx` - Generic table component with TypeScript generics
- `src/components/consulting/ProjectForm.tsx` - Form handling with react-hook-form
- `src/components/impact/ImpactMetricsCard.tsx` - Dashboard metric displays

**Design System:**

- Semantic color tokens in `src/index.css`
- Professional brand colors: Trust Blue (primary), Growth Green (success), Action Orange (warning)
- Mobile-first responsive design with Tailwind breakpoints

### Data Flow Patterns

**State Management:**

- Global app state via Context API (theme, auth, language)
- Server state via custom React hooks with simple fetch patterns
- Form state via react-hook-form with Zod validation
- Undo functionality using programmatic toast actions

**Authentication Flow:**

- Mock authentication system ready for production integration
- Protected routes redirect to `/login` when unauthenticated
- Demo credentials: demo@bod.consulting / demo123

### Development Patterns

**Import Paths:**

- Use `@/` alias for src directory imports
- Absolute imports configured in vite.config.ts

**Error Handling:**

- Global ErrorBoundary wraps entire application
- API requests include centralized error handling
- Toast notifications for user feedback

**Performance Optimizations:**

- Simple loading states with useState patterns
- Vite's automatic code splitting
- Lazy loading patterns implemented for routes
- Generic DataTable component for code reuse

## Key Files to Understand

- `src/App.tsx` - Provider setup and routing configuration
- `src/services/api.ts` - Simplified API layer with direct MockAPI.io calls
- `src/hooks/useProjects.ts` and `src/hooks/useTeamMembers.ts` - Custom data hooks
- `src/components/shared/DataTable.tsx` - Generic table component with TypeScript
- `src/contexts/` - Global state management
- `src/components/layout/DashboardLayout.tsx` - Main layout structure
- `vite.config.ts` - Build configuration with path aliases

## Recent Architecture Improvements

**Refactoring Achievements (Phases 2-6):**
- **Code Deduplication**: Created generic `DataTable<T>` component, eliminated 512 lines
- **UI Cleanup**: Removed 20 unused shadcn/ui components (41% reduction)
- **State Simplification**: Replaced TanStack Query with junior-friendly React hooks
- **API Simplification**: Removed complex conversion layers, direct MockAPI integration
- **Bundle Optimization**: Achieved 42% reduction in API service complexity

**Current Architecture Benefits:**
- Junior-appropriate patterns for 0-1 years experience assessment
- Clean, readable code without enterprise over-engineering
- Simple React hooks demonstrate core skills effectively
- Generic TypeScript components show advanced understanding
- Professional error handling and user experience maintained
