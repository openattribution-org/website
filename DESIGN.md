# OpenAttribution Design Language

Single source of truth for all OpenAttribution projects (website, PolicyCheck, etc).

## Colours

Defined in `theme.js`. All projects should import or reference these values.

### Coral (Primary Brand)

| Token | Hex | Usage |
|-------|-----|-------|
| coral-50 | `#fef2f2` | Error/input backgrounds, light tints |
| coral-100 | `#fee2e1` | Borders, nav dividers |
| coral-200 | `#fecaca` | Table header borders, loader ring |
| coral-300 | `#fca5a3` | — |
| coral-400 | `#f87572` | — |
| coral-500 | `#f5564e` | Focus rings, scrollbar thumb, selection |
| coral-600 | `#dc3b35` | **Primary action** — buttons, links, accents, active tabs |
| coral-700 | `#b92d27` | Hover state for buttons/links, error text, blocked status |
| coral-800 | `#982724` | — |
| coral-900 | `#7f2724` | — |

### Amber (Secondary)

| Token | Hex | Usage |
|-------|-----|-------|
| amber-50 | `#fffbeb` | Notice backgrounds, gradient endpoints |
| amber-100 | `#fef3c7` | Draft badges, notice borders |
| amber-200 | `#fde68a` | Warning borders |
| amber-500 | `#f59e0b` | — |
| amber-800 | `#92400e` | Draft badge text |

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| cream | `#faf8f5` | **Page background** |
| white | `#ffffff` | Cards, inputs, alternating sections |
| gray-100 | `#f3f4f6` | Inline code background, light fills |
| gray-200 | `#e5e7eb` | Card borders, dividers |
| gray-300 | `#d1d5db` | Input borders, dashed borders |
| gray-400 | `#9ca3af` | Placeholder text |
| gray-500 | `#6b7280` | Tertiary text |
| gray-600 | `#4b5563` | **Secondary text**, body copy |
| gray-700 | `#374151` | Subheadings |
| gray-800 | `#1f2937` | **Primary text** |
| gray-900 | `#111827` | Headings, footer background |

### Semantic

| Colour | Background | Text | Usage |
|--------|-----------|------|-------|
| Green | `#dcfce7` | `#166534` | Success, published, allowed status |
| Amber | `#fef3c7` | `#92400e` | Draft, warning |
| Blue | `#e0e7ff` | `#3730a3` | Roadmap, info |
| Blue (light) | `#eff6ff` | — | Info callout backgrounds |

### Code Block (Catppuccin-inspired)

| Element | Hex |
|---------|-----|
| Background | `#1e1e2e` |
| Header | `#313244` |
| Text | `#cdd6f4` |
| Keywords | `#cba6f7` |
| Strings | `#a6e3a1` |
| Comments | `#a6adc8` |

## Typography

### Font Stack

```
Primary:  'Inter', system-ui, sans-serif
Mono:     'JetBrains Mono', 'Consolas', 'Monaco', monospace
```

Load Inter from Google Fonts: weights 300, 400, 500, 600, 700.

### Scale

| Element | Size | Weight | Line-height | Notes |
|---------|------|--------|-------------|-------|
| Hero h1 | 3rem / 4.5rem | 300 (light) | tight | Mobile / desktop |
| Section h2 | 2.25rem / 3rem | 300 | tight | |
| Card h3 | 1.5rem | 400 | — | |
| Subheading h4 | 1.125rem | 400 | — | |
| Body (large) | 1.25rem | 300 | 1.8 | Section intros |
| Body | 1rem | 300 | 1.8 | Default |
| Small | 0.875rem | 300 | — | Labels, help text |
| XS | 0.75rem | 300-500 | — | Badges, metadata |
| Code inline | 0.8125em | — | — | Mono, gray-100 bg |
| Code block | 0.8125rem | — | 1.6 | Mono |

### Key Pattern

Body text uses **weight 300** (light). Headings use 300-400. Bold/emphasis uses 400 ("normal") — the brand avoids heavy weights. Use `font-normal` (400) for emphasis rather than `font-bold` (700).

## Spacing

Base unit: `0.25rem` (4px). Common values:

| Token | Value | Usage |
|-------|-------|-------|
| `py-3 px-4` | 12px / 16px | Table cells, input padding |
| `p-4` | 16px | Small cards, notices |
| `p-8` | 32px | Cards, main sections |
| `px-8 py-4` | 32px / 16px | Buttons (primary) |
| `px-4 py-2` | 16px / 8px | Buttons (small/secondary) |
| `gap-4` | 16px | Default flex/grid gap |
| `gap-6` | 24px | Nav links, card grids |
| `gap-8` | 32px | Section content grids |
| `mb-6` | 24px | Between card sections |
| `mb-8` | 32px | Between major blocks |
| `mb-12` | 48px | After section headers |
| `py-20 px-6` | 80px / 24px | Section padding |

## Layout

### Max Widths

| Token | Value | Usage |
|-------|-------|-------|
| `max-w-7xl` | 1280px | Page container, nav |
| `max-w-6xl` | 1024px | Hero content |
| `max-w-5xl` | 960px | App content (PolicyCheck) |
| `max-w-4xl` | 896px | Article, forms |
| `max-w-3xl` | 768px | Narrow content, prose |

### Grid Patterns

- **Hero**: `lg:grid-cols-2 gap-12 items-center`
- **Cards (2-col)**: `md:grid-cols-2 gap-8`
- **Cards (3-col)**: `md:grid-cols-3 gap-6`
- **Cards (auto)**: `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`

### Section Structure

```
<section class="py-20 px-6">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-12">    <!-- Header -->
      <h2>...</h2>
      <p>...</p>
    </div>
    <div class="grid md:grid-cols-3 gap-6">  <!-- Content -->
      ...
    </div>
  </div>
</section>
```

## Components

### Buttons

```html
<!-- Primary -->
<button class="px-8 py-3 bg-coral-600 text-white rounded-lg hover:bg-coral-700
               transition shadow-lg hover:shadow-xl font-normal">
  Action
</button>

<!-- Secondary -->
<button class="px-4 py-2 bg-white text-coral-600 rounded-lg border border-coral-200
               hover:bg-coral-50 transition font-light text-sm">
  Action
</button>

<!-- Disabled -->
<button class="... opacity-60 cursor-not-allowed" disabled>
```

### Cards

```html
<div class="bg-white rounded-2xl shadow-lg border border-coral-100 p-8">
  ...
</div>

<!-- With gradient -->
<div class="rounded-xl bg-gradient-to-br from-coral-50 to-amber-50
            border border-coral-200 shadow-lg p-8">
```

### Form Inputs

```html
<input class="w-full px-4 py-3 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-coral-500 focus:border-transparent
              transition font-light">
```

### Navigation

```html
<nav class="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-coral-100">
  <div class="max-w-7xl mx-auto px-6 py-4">
    ...
  </div>
</nav>
```

Nav links: `text-gray-600 hover:text-coral-600 transition font-light`
Active: `text-coral-600 font-normal`

### Status Badges

```css
.status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.025em;
}
```

Published: green bg/text. Draft: amber. Roadmap: blue. (See Semantic colours above.)

### Tables

- Header: `border-b-2 border-coral-200`, `font-normal text-gray-900`
- Cells: `py-3 px-4`, `border-b border-gray-100`
- Hover: `hover:bg-gray-50`
- Body text: `text-gray-600 font-light text-sm`

### Callouts

```html
<!-- Info/highlight -->
<div class="bg-gradient-to-r from-coral-50 to-amber-50 rounded-2xl
            border-l-4 border-coral-600 p-8">
```

### Loading Spinner

```html
<div class="w-12 h-12 border-4 border-coral-200 border-t-coral-600
            rounded-full animate-spin"></div>
```

## Borders & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-2xl` | 16px | Cards, modals |
| `rounded-xl` | 12px | Code blocks, upload areas |
| `rounded-lg` | 8px | Buttons, inputs, notices |
| `rounded` | 4px | Small tags |
| `rounded-full` | 9999px | Badges, pills |

Borders: 1px default, 2px for table headers/dividers, 4px for callout left accent.

## Shadows

| Token | Usage |
|-------|-------|
| `shadow-lg` | Cards, buttons |
| `shadow-xl` | Hover state |
| `shadow-2xl` | Hero images, sticky CTA |
| Code blocks | `0 4px 6px -1px rgba(0,0,0,0.1)` |

## Transitions & Animation

### Timing

| Duration | Easing | Usage |
|----------|--------|-------|
| 0.2s | ease | Links, buttons, inputs |
| 0.3s | ease | Cards, nav, mobile menu |
| 0.4s | ease-out | Form messages |
| 0.6s | — | Button ripple |
| 0.8s | ease-out | Section fade-in, slide-in |

### Keyframes

- **fadeIn**: `opacity 0 + translateY(20px)` to visible
- **slideInLeft/Right**: `opacity 0 + translateX(±30px)` to visible
- **shake**: horizontal jitter for validation errors
- **pulse**: gentle opacity throb for placeholders

### Reduced Motion

All animations disabled via `prefers-reduced-motion: reduce`.

## Gradients

| Name | Value | Usage |
|------|-------|-------|
| Hero | `from-coral-50 via-cream to-amber-50` | Hero sections |
| Summary | `from-coral-50 to-amber-50` | Result summaries, callouts |
| Alternating | `from-cream to-white` / `from-white to-cream` | Section backgrounds |

## Accessibility

- Focus: `outline 2px solid coral-500, offset 2px`
- Selection: `coral-500` background, white text
- Scrollbar (webkit): `coral-500` thumb on `cream` track
- All interactive elements get visible focus rings
- Reduced motion respected

## Favicon

Coral speech-bubble SVG at `/favicon.svg`.

## Applying to New Projects

1. Load Inter from Google Fonts (300, 400, 500)
2. Use Tailwind CDN or equivalent with `theme.js` colours
3. Set `bg-cream` on body, `font-sans antialiased`
4. Use `font-light` (300) as default text weight
5. Use `coral-600` for primary actions, `coral-700` for hover
6. Keep cards on `bg-white` with `rounded-2xl shadow-lg border border-coral-100`
7. Match the nav pattern: fixed, `bg-white/80 backdrop-blur-md`
