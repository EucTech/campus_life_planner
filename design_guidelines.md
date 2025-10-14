# Campus Life Planner - Design Guidelines

## Design Approach

**Selected Approach:** Productivity-Focused Design System
**Primary References:** Linear (modern productivity), Notion (information density), Asana (task management)
**Justification:** Campus planners require clarity, efficiency, and visual organization over decorative elements. Students need quick access to tasks, clear visual hierarchy, and distraction-free interfaces for academic productivity.

**Core Design Principles:**
- Clarity over decoration: Every element serves a functional purpose
- Information density with breathing room: Pack data efficiently without overwhelming
- Scannable hierarchy: Users should instantly identify priorities and deadlines
- Purposeful color: Use color to communicate status and urgency, not decoration

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 250 85% 45% (vibrant blue for CTAs, active states)
- Background: 0 0% 100% (pure white)
- Surface: 220 15% 97% (light gray cards/panels)
- Text Primary: 220 20% 15% (near-black)
- Text Secondary: 220 10% 45% (medium gray)
- Border: 220 15% 88% (subtle dividers)
- Success: 140 70% 45% (task completion, positive stats)
- Warning: 35 95% 55% (approaching deadlines)
- Error: 0 75% 55% (overdue, validation errors)

**Dark Mode:**
- Primary: 250 85% 60% (brighter for contrast)
- Background: 220 15% 10% (deep dark)
- Surface: 220 15% 14% (slightly lighter cards)
- Text Primary: 220 15% 95% (near-white)
- Text Secondary: 220 10% 65% (lighter gray)
- Border: 220 15% 20% (subtle dividers)
- Success: 140 60% 55% (adjusted for dark bg)
- Warning: 35 90% 60%
- Error: 0 70% 60%

**Status Colors (Applied via badges, borders, highlights):**
- Urgent: 0 75% 55% (due within 24h)
- Due Soon: 35 95% 55% (due within 3 days)
- On Track: 140 70% 45% (normal status)
- Completed: 220 10% 45% (muted, crossed out)

### B. Typography

**Font Families:**
- Primary: 'Inter', system-ui, sans-serif (body, UI elements)
- Monospace: 'JetBrains Mono', 'Consolas', monospace (durations, timestamps, regex patterns)

**Type Scale:**
- Display: 2.5rem/1.2 (600) - Dashboard headings
- H1: 2rem/1.3 (600) - Page titles
- H2: 1.5rem/1.4 (600) - Section headers
- H3: 1.25rem/1.4 (500) - Card titles, form labels
- Body: 1rem/1.6 (400) - Paragraphs, descriptions
- Small: 0.875rem/1.5 (400) - Meta info, timestamps
- Tiny: 0.75rem/1.4 (500) - Badges, caps, labels

**Font Weights:** 400 (regular), 500 (medium), 600 (semibold)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistency
- Micro spacing (p-2, gap-2): Between related small elements
- Standard spacing (p-4, gap-4): Default padding/gaps for cards, form fields
- Section spacing (p-8, py-12): Between major sections
- Page margins (px-4 md:px-8 lg:px-16): Responsive container padding

**Grid System:**
- Mobile: Single column, full-width cards (stacked)
- Tablet (768px): 2-column for stats, cards; single for forms
- Desktop (1024px): 3-column dashboard stats, 2-column forms with preview, table view for records

**Container Widths:**
- Full app: max-w-7xl mx-auto
- Forms: max-w-2xl
- Tables: w-full with horizontal scroll on mobile

### D. Component Library

**Navigation:**
- Top header: Logo left, nav center (horizontal links on desktop, hamburger on mobile), user avatar right
- Active state: Bold text + subtle underline in primary color
- Mobile: Slide-out drawer with backdrop overlay

**Cards (Task/Event Records):**
- Elevated surface with subtle shadow (0 1px 3px rgba(0,0,0,0.1))
- Left border accent (4px) colored by urgency status
- Header: Title (H3) + duration badge
- Meta row: Tag badge + due date with calendar icon
- Actions: Edit pencil + Delete trash icons (visible on hover/focus)

**Forms:**
- Floating labels that animate above input on focus
- Input borders: Default (border-gray-300 dark:border-gray-700), Focus (ring-2 ring-primary), Error (border-error)
- Error messages below field in error color with icon
- Button group: Primary submit (filled) + secondary cancel (outline) side-by-side

**Tables (Desktop View):**
- Sticky header with sort indicators (↑↓ arrows)
- Zebra striping on rows (subtle bg-surface on alternate rows)
- Row hover: Slight background lift + visible action icons
- Inline edit: Row transforms to form inputs with save/cancel micro-buttons

**Stats Dashboard:**
- 4-card grid on desktop (2x2), stacked on mobile
- Each card: Large number (Display size) + label (Small) + trend icon/arrow
- Last 7 days chart: Simple vertical bar chart using CSS (height percentages), no libraries
- Cap indicator: Progress bar with fill percentage + live region text ("20 hours remaining" / "5 hours over cap!")

**Badges:**
- Pill shape (rounded-full), small text, padding px-3 py-1
- Tag badges: Outlined style with border-current
- Status badges: Filled with status colors
- Duration badges: Monospace font, subtle background

**Search Bar:**
- Prominent placement above table
- Search icon prefix, regex toggle suffix (/ icon)
- Live highlight: Yellow background on <mark> tags in results
- Pattern error: Red underline on invalid regex with tooltip

**Modal/Dialog (Delete Confirmation):**
- Centered overlay with backdrop (bg-black/50)
- Card with title, message, action buttons (Danger + Cancel)
- Focus trap: Tab cycles within modal only

### E. Animations

**Subtle Transitions (Use Sparingly):**
- Button/link hover: transform scale(1.02) + shadow lift (150ms ease)
- Card hover: shadow increase (200ms ease)
- Page transitions: Fade in content (300ms ease-in-out)
- Form validation: Shake animation on error (400ms)
- Toast notifications: Slide in from top-right (250ms ease-out)

**No Animations:**
- Avoid carousel auto-play, parallax, or unnecessary motion
- Respect prefers-reduced-motion for all animations

---

## Page-Specific Layouts

**About Page:**
Simple centered column (max-w-3xl) with project description, feature highlights (3-column icon grid on desktop), and contact info footer (GitHub, email as clickable badges)

**Dashboard/Stats:**
Stats cards grid at top, followed by "Recent Tasks" preview (5 latest records as compact cards), followed by mini bar chart for 7-day trend

**Records Table Page:**
Search bar + filters row, followed by responsive table (cards on mobile, table on desktop >768px), pagination controls at bottom if >20 records

**Add/Edit Form:**
2-column layout on desktop (form left, live preview card right showing how record will appear), single column on mobile, sticky submit button on mobile

**Settings:**
Sectioned form (Units/Duration preferences, Import/Export buttons, Theme toggle, Data management) with collapsible accordions for each section

---

## Images

**Hero Section: No**
This is a utility application - no hero image needed. The About page can include a subtle abstract pattern background (geometric shapes in primary color at 5% opacity) but focus remains on text content.

**Icons:**
Use Heroicons (outline style) via CDN for all interface icons: calendar, clock, tag, pencil, trash, plus, check, x-mark, funnel (filter), magnifying-glass, regex pattern icon

**Illustrations:**
Empty states only: Simple line illustrations for "No tasks yet" (use undraw.co style SVG) and "Search returned no results"

---

## Accessibility Enhancements

- All interactive elements: 48x48px minimum touch target on mobile
- Focus indicators: 2px solid ring in primary color with 2px offset
- Skip-to-content link: Positioned off-screen until focused (top-0 left-0, -translate-y-full when unfocused)
- ARIA live regions: Stats cap announcements (polite for normal, assertive for exceeded)
- Form errors: Linked to inputs via aria-describedby, announced on validation
- Color contrast: All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- Dark mode toggle: Respects system preference by default, manual override in settings

---

## Mobile-First Responsive Strategy

**360px (Mobile S):** Single column, stacked cards, full-width forms, horizontal scroll for tables  
**768px (Tablet):** 2-column stats, side-by-side form fields, table view available  
**1024px (Desktop):** 3-column stats, table default view, 2-column form + preview layout