# Design System & Theme Documentation

## Overview

API Distribution Dashboard menggunakan **Modern Flat Minimalist Design** dengan light mode sebagai foundation utama. Design system ini dirancang untuk memberikan pengalaman visual yang clean, professional, dan optimized untuk dashboard monitoring.

---

## Design Philosophy

### Core Principles
1. **Modern Flat Minimalism**: Clean interface dengan subtle depth perception
2. **Light Mode Optimized**: Off-white backgrounds untuk mengurangi eye strain
3. **Blue Primary Identity**: Professional dan friendly untuk konteks akademik
4. **Accessibility First**: WCAG AA compliance untuk contrast ratios
5. **Scalable System**: Component-based dengan clear hierarchy

### Visual Direction
- **Aesthetic**: Contemporary flat design dengan subtle elevation
- **Approach**: Function over decoration, clarity over complexity
- **Context**: Academic dashboard untuk API monitoring dan data visualization

---

## Color System

### Primary Color: Blue

**Base Color**: `#3b82f6` (Tailwind blue-500)

**Full Spectrum** (9-shade system):
```css
primary-50:  #eff6ff  /* Backgrounds, hover states */
primary-100: #dbeafe  /* Light backgrounds */
primary-200: #bfdbfe  /* Borders, dividers */
primary-300: #93c5fd  /* Disabled states */
primary-400: #60a5fa  /* Secondary actions */
primary-500: #3b82f6  /* PRIMARY - main brand color */
primary-600: #2563eb  /* Hover states */
primary-700: #1d4ed8  /* Active states */
primary-800: #1e40af  /* Dark text on light bg */
primary-900: #1e3a8a  /* Headings, emphasis */
```

**Usage Guidelines**:
- **primary-500**: Main buttons, links, active navigation
- **primary-600**: Button hover states
- **primary-700**: Button active/pressed states
- **primary-100**: Light backgrounds untuk highlighted sections
- **primary-200**: Borders untuk primary elements

---

### Neutral Colors: Gray Scale

**Base Color**: `#6b7280` (Tailwind gray-500)

**Full Spectrum**:
```css
neutral-50:  #f9fafb  /* Page backgrounds, off-white */
neutral-100: #f3f4f6  /* Card backgrounds alternative */
neutral-200: #e5e7eb  /* Borders, dividers */
neutral-300: #d1d5db  /* Disabled borders */
neutral-400: #9ca3af  /* Disabled text, placeholders */
neutral-500: #6b7280  /* Secondary text, captions */
neutral-600: #4b5563  /* Body text secondary */
neutral-700: #374151  /* PRIMARY BODY TEXT */
neutral-800: #1f2937  /* Headings, emphasis */
neutral-900: #111827  /* Maximum contrast headings */
```

**Usage Guidelines**:
- **neutral-50**: Main page background (instead of pure white)
- **neutral-100**: Alternative card backgrounds
- **neutral-200**: Standard borders untuk cards dan dividers
- **neutral-700**: Primary body text (16px)
- **neutral-800**: Headings dan important labels

---

### Functional Colors

**Success (Green)**:
```css
success: #10b981  /* API online, successful operations */
```

**Warning (Amber)**:
```css
warning: #f59e0b  /* API degraded, caution states */
```

**Error (Red)**:
```css
error: #ef4444  /* API offline, error states */
```

**Info (Cyan)**:
```css
info: #06b6d4  /* Informational messages, tips */
```

**Usage Context**:
- API status indicators
- Form validation feedback
- Alert messages dan notifications
- Data visualization accents

---

## Typography System

### Font Family

**Sans Serif (Primary)**: Geist Sans
- Body text, headings, UI elements
- Variable: `--font-geist-sans`
- Fallback: `system-ui, -apple-system, sans-serif`

**Monospace (Code)**: Geist Mono
- Code snippets, API endpoints, JSON responses
- Variable: `--font-geist-mono`
- Fallback: `'Courier New', monospace`

### Type Scale

| Token | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px / 0.75rem | Micro labels, badges |
| `text-sm` | 14px / 0.875rem | Secondary text, captions |
| `text-base` | 16px / 1rem | **BODY TEXT DEFAULT** |
| `text-lg` | 18px / 1.125rem | Subheadings, card titles |
| `text-xl` | 20px / 1.25rem | Section headings |
| `text-2xl` | 24px / 1.5rem | Page titles |
| `text-3xl` | 30px / 1.875rem | Hero headings |

### Text Hierarchy

**Page Title**: `text-2xl font-bold text-neutral-800`
```tsx
<h1 className="text-2xl font-bold text-neutral-800">API Distribution Dashboard</h1>
```

**Section Heading**: `text-xl font-semibold text-neutral-800`
```tsx
<h2 className="text-xl font-semibold text-neutral-800">Kelompok 1 - Rental System</h2>
```

**Card Title**: `text-lg font-medium text-neutral-700`
```tsx
<h3 className="text-lg font-medium text-neutral-700">API Status</h3>
```

**Body Text**: `text-base text-neutral-700`
```tsx
<p className="text-base text-neutral-700">Lorem ipsum dolor sit amet...</p>
```

**Secondary Text**: `text-sm text-neutral-500`
```tsx
<span className="text-sm text-neutral-500">Last updated: 2 minutes ago</span>
```

### Line Height & Spacing

- **Headings**: `leading-tight` (1.25) - compact untuk visual impact
- **Body Text**: `leading-normal` (1.5) - optimal readability
- **Long Form**: `leading-relaxed` (1.75) - extra comfort untuk paragraphs

---

## Spacing System

### Base Unit: 4px

Menggunakan Tailwind's default spacing scale (base unit 0.25rem = 4px):

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight spacing, icon gaps |
| `2` | 8px | Compact spacing |
| `3` | 12px | Small gaps |
| `4` | 16px | **STANDARD PADDING** (card internal) |
| `6` | 24px | **COMFORTABLE PADDING** (sections) |
| `8` | 32px | Large gaps |
| `12` | 48px | Section separators |
| `16` | 64px | Major layout divisions |

### Component Spacing Standards

**Cards**: `p-6` (24px padding)
```tsx
<div className="p-6 bg-white rounded-lg">
  {/* Card content */}
</div>
```

**Sections**: `gap-6` or `space-y-6` (24px vertical spacing)
```tsx
<div className="space-y-6">
  <Card />
  <Card />
</div>
```

**Grid Layouts**: `gap-4` (16px grid gap)
```tsx
<div className="grid grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>
```

---

## Elevation & Shadows

### Shadow System (Subtle Depth)

Menggunakan subtle shadows untuk memberikan depth perception tanpa menghilangkan flat aesthetic:

**shadow-sm**: Subtle elevation untuk cards
```css
box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
```
Usage: Default cards, panels

**shadow**: Standard elevation untuk interactive elements
```css
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
```
Usage: Hover states, dropdowns

**shadow-md**: Medium elevation untuk modals
```css
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
```
Usage: Modals, popovers, tooltips

**shadow-lg**: High elevation untuk overlays
```css
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```
Usage: Drawer navigation, notifications

### Border System

**Standard Border**: `border border-neutral-200`
- Cards, inputs, dividers
- 1px solid with neutral-200 color

**Accent Border**: `border-l-4 border-primary-500`
- Status cards, highlighted sections
- 4px left border untuk visual emphasis

---

## Component Patterns

### Card Component

**Standard Card**:
```tsx
<div className="bg-white shadow-sm rounded-lg border border-neutral-100 p-6">
  {/* Card content */}
</div>
```

**Card with Accent**:
```tsx
<div className="bg-white shadow-sm rounded-lg border-l-4 border-primary-500 p-6">
  {/* Highlighted card content */}
</div>
```

**Interactive Card** (hover effect):
```tsx
<div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg border border-neutral-100 p-6 cursor-pointer">
  {/* Clickable card content */}
</div>
```

---

### Button Styles

**Primary Button**:
```tsx
<button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
  Primary Action
</button>
```

**Secondary Button**:
```tsx
<button className="bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 px-4 py-2 rounded-md font-medium transition-colors">
  Secondary Action
</button>
```

**Text Button**:
```tsx
<button className="text-primary-500 hover:text-primary-600 px-4 py-2 rounded-md font-medium transition-colors">
  Text Action
</button>
```

---

### Status Indicators

**API Status Badges**:

```tsx
// Online Status
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
  Online
</span>

// Offline Status
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
  Offline
</span>

// Warning Status
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
  Degraded
</span>
```

---

### Navigation Sidebar

**Sidebar Container**:
```tsx
<aside className="w-64 bg-white border-r border-neutral-200 min-h-screen">
  {/* Navigation items */}
</aside>
```

**Navigation Item** (inactive):
```tsx
<a className="flex items-center px-4 py-3 text-neutral-700 hover:bg-neutral-50 transition-colors">
  <span>Kelompok 1</span>
</a>
```

**Navigation Item** (active):
```tsx
<a className="flex items-center px-4 py-3 bg-primary-50 text-primary-700 border-l-4 border-primary-500 font-medium">
  <span>Kelompok 1</span>
</a>
```

---

### Data Tables

**Table Structure**:
```tsx
<div className="overflow-x-auto bg-white rounded-lg border border-neutral-200">
  <table className="min-w-full divide-y divide-neutral-200">
    <thead className="bg-neutral-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Header
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-neutral-200">
      <tr className="hover:bg-neutral-50 transition-colors">
        <td className="px-6 py-4 text-sm text-neutral-700">
          Data
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Accessibility Guidelines

### Contrast Ratios (WCAG AA Compliance)

**Text Contrast**:
- Body text: `neutral-700` on white background = 10.7:1 (Pass AAA)
- Secondary text: `neutral-500` on white background = 4.6:1 (Pass AA)
- Primary buttons: White text on `primary-500` = 4.9:1 (Pass AA)

**Interactive Elements**:
- Minimum touch target: 44x44px (mobile)
- Minimum click target: 24x24px (desktop)
- Focus indicators: `ring-2 ring-primary-500 ring-offset-2`

### Focus States

**Standard Focus Ring**:
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Accessible Button
</button>
```

---

## Responsive Design

### Breakpoints

Menggunakan Tailwind default breakpoints:

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

### Layout Patterns

**Mobile First Approach**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
</div>
```

**Sidebar Navigation**:
```tsx
<aside className="hidden lg:block w-64">
  {/* Sidebar: hidden on mobile, visible on desktop */}
</aside>
```

---

## Implementation Notes

### Tailwind Configuration

File: `tailwind.config.ts` (to be created)

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### Global Styles Update

File: `app/globals.css` (perlu update untuk remove dark mode)

```css
@import "tailwindcss";

:root {
  --background: #f9fafb;  /* neutral-50 */
  --foreground: #374151;  /* neutral-700 */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
}

/* Custom scrollbar untuk consistency */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f9fafb;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
```

---

## Design Decisions & Rationale

### Why Light Mode Only?

1. **Academic Context**: Dashboard untuk mata kuliah, typically digunakan di lingkungan terang
2. **Data Clarity**: Light backgrounds optimal untuk data visualization dan charts
3. **Development Speed**: Fokus pada satu mode accelerates development
4. **Consistent Experience**: Avoid mode-switching bugs dan design inconsistencies

### Why Blue Primary?

1. **Professional Identity**: Blue conveys trust, reliability, professionalism
2. **Academic Appropriate**: Neutral enough untuk konteks pendidikan
3. **Accessibility**: Blue-500 provides excellent contrast ratios
4. **Versatility**: Works well dengan functional colors (green/red/yellow status indicators)

### Why Subtle Elevation?

1. **Visual Hierarchy**: Shadows help users understand component layers
2. **Modern Flat Hybrid**: Balance between pure flat dan skeuomorphic design
3. **Interactive Feedback**: Hover shadows provide clear affordance untuk clickable elements
4. **Professional Polish**: Subtle depth perception without sacrificing minimalism

---

## Future Considerations

### Potential Enhancements

1. **Dark Mode Support**: Jika user feedback menunjukkan kebutuhan
2. **Theming System**: Allow customization per kelompok (optional accent colors)
3. **Animation Library**: Consistent transitions dan micro-interactions
4. **Icon System**: Standardized icon library (Heroicons, Lucide, dll)

### Maintenance Notes

- Review contrast ratios setiap ada perubahan color
- Test responsive behavior pada breakpoints utama
- Validate accessibility dengan automated tools (axe, Lighthouse)
- Document component variants di Storybook (future)

---

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Color System](https://material.io/design/color)
- [Refactoring UI](https://www.refactoringui.com/)

---

**Last Updated**: 2025-09-30
**Version**: 1.0.0
**Maintainer**: Development Team