# Campus Life Planner

## Overview

Campus Life Planner is a student-focused task management application designed to help organize academic assignments, projects, and study sessions. The application provides task tracking, productivity analytics, regex-powered search capabilities, and data import/export functionality. Built with accessibility and productivity in mind, it follows a clean, distraction-free design approach inspired by modern productivity tools like Linear and Notion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with TypeScript, using Vite as the build tool

**UI Framework**: Custom component library built on Radix UI primitives with Tailwind CSS for styling

**Design System**: "New York" variant of shadcn/ui components with productivity-focused design principles
- Emphasis on clarity over decoration
- Information density balanced with breathing room
- Scannable visual hierarchy for quick priority identification
- Status-driven color system (urgent, due soon, on track, completed)

**State Management**: TanStack Query (React Query) for server state management
- Centralized API communication through a custom query client
- Optimistic updates and automatic cache invalidation
- Separate client-side state management for UI concerns (theme, navigation, search filters)

**Routing**: Wouter for lightweight client-side routing
- Main routes: Dashboard (/), Tasks (/tasks), About (/about), Settings (/settings)
- Hash-based navigation fallback for static hosting compatibility

**Key Architectural Decisions**:
- **Component Structure**: Atomic design with separated concerns (UI components, feature components, pages)
- **Styling Approach**: Utility-first with Tailwind, enhanced by CSS custom properties for theming
- **Type Safety**: Full TypeScript coverage with shared schema validation between client and server
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation, ARIA attributes, and focus management

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Design**: RESTful API with JSON responses
- GET /api/tasks - Retrieve all tasks
- GET /api/tasks/:id - Retrieve single task
- POST /api/tasks - Create new task
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task

**Data Storage Strategy**: Dual-mode persistence
- **Development**: In-memory storage (MemStorage class) for rapid iteration
- **Production**: PostgreSQL via Drizzle ORM with Neon serverless driver

**Validation Layer**: Zod schemas shared between client and server
- Schema defined in shared/schema.ts for type consistency
- Regex-based validation for title, date, duration, and tag fields
- Advanced patterns include duplicate word detection and time token recognition

**Key Architectural Decisions**:
- **Modular Storage Interface**: IStorage interface allows swapping between memory and database implementations
- **Schema Sharing**: Single source of truth for data models prevents client-server drift
- **Error Handling**: Centralized error middleware with status code normalization
- **Development Experience**: Hot module replacement via Vite middleware in development mode

### Data Layer

**Database Schema** (PostgreSQL via Drizzle ORM):

```typescript
tasks table:
- id: varchar (primary key)
- title: text
- due_date: text (YYYY-MM-DD format)
- duration: integer (minutes)
- tag: text
- status: text (urgent | dueSoon | onTrack | completed)
- created_at: text (ISO timestamp)
- updated_at: text (ISO timestamp)
```

**Schema Validation**:
- Title: No leading/trailing spaces, regex `/^\S(?:.*\S)?$/`
- Date: YYYY-MM-DD format, regex `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/`
- Duration: Non-negative integer
- Tag: Letters, spaces, hyphens only, regex `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`
- Status: Enum validation

**Local Storage** (Client-side fallback):
- Tasks stored in localStorage under 'campus_planner_tasks'
- Settings stored under 'campus_planner_settings'
- JSON import/export with validation

### Theme System

**Dark/Light Mode Implementation**:
- CSS custom properties for all color tokens
- Theme toggle persisted to localStorage
- Automatic theme class application to document root
- Separate color schemes optimized for each mode

**Design Tokens**:
- Primary: Blue (hsl(250, 85%, 45%/60%))
- Status colors: Urgent (red), Due Soon (orange), On Track (green), Completed (gray)
- Neutral grays for backgrounds, borders, and text hierarchy
- Consistent shadow system for depth

### Search and Filtering

**Regex Search Engine**:
- Live pattern compilation with error handling
- Case-insensitive toggle
- Regex mode toggle for advanced patterns
- Search across task titles, tags, and descriptions

**Sorting Capabilities**:
- Sort by: date, title (alphabetical), duration
- Ascending/descending order toggle
- Client-side sorting for immediate feedback

### Accessibility Features

- Semantic HTML structure
- Skip-to-content link for keyboard users
- ARIA labels and live regions
- Visible focus indicators
- Keyboard navigation throughout
- Color contrast meets WCAG AA standards
- Screen reader friendly labels

## External Dependencies

### Core Framework Dependencies

- **React 18** (`react`, `react-dom`) - UI framework
- **Express** - Backend server framework
- **Vite** - Build tool and development server
- **TypeScript** - Type safety across the stack

### UI Component Libraries

- **Radix UI** - Headless, accessible component primitives
  - Dialog, Dropdown, Popover, Select, Toast, and 20+ other components
  - Handles keyboard navigation, focus management, ARIA attributes
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Type-safe variant styling
- **Lucide React** - Icon system

### Data Management

- **Drizzle ORM** (`drizzle-orm`) - Type-safe database toolkit
- **@neondatabase/serverless** - Serverless PostgreSQL driver for Neon
- **Drizzle Zod** (`drizzle-zod`) - Schema to Zod validator conversion
- **Zod** - Schema validation library
- **TanStack Query** (`@tanstack/react-query`) - Server state management

### Routing and Navigation

- **Wouter** - Lightweight React router (< 2KB)

### Form Management

- **React Hook Form** (`react-hook-form`) - Performant form library
- **@hookform/resolvers** - Form validation resolvers

### Date Utilities

- **date-fns** - Modern date utility library

### Development Tools

- **tsx** - TypeScript execution for development
- **esbuild** - JavaScript bundler for production builds
- **PostCSS** with Autoprefixer - CSS processing
- **@replit/vite-plugin-*** - Replit-specific development enhancements

### Session Management

- **express-session** - Session middleware (if user authentication added)
- **connect-pg-simple** - PostgreSQL session store

### Typography

- **Inter** (Google Fonts) - Primary sans-serif font
- **JetBrains Mono** (Google Fonts) - Monospace font for code/regex

### Notable Architectural Constraints

- Database schema uses text fields for dates (YYYY-MM-DD strings) rather than native date types
- No authentication/authorization layer currently implemented
- Single-user application design (no multi-tenancy)
- Client-side validation mirrors server-side validation via shared schemas