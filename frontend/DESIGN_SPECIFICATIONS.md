# 🎨 Course Module - Visual & UX Design Guide

## Page Layout Architecture

### Overall Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│                         TOP HEADER BAR                              │
│  Search │ Theme Switcher │ Notifications │ Profile                  │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                      │
│   SIDEBAR    │                 MAIN CONTENT AREA                    │
│  (320px)     │                                                      │
│              │                                                      │
│ • Modules    │  Topic Header → Notes Section → Video Section       │
│ • Chapters   │                                                      │
│ • Topics     │                                                      │
│              │                                                      │
│ ✓ Progress   │  Resources & Practice Section                       │
│ ✓ Profile    │                                                      │
│              │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## 📱 Courses Browsing Page Layout

### Course Cards Hierarchy
```
┌─────────────────────────────────────────────────┐
│ Card Header (Gradient Background)                │
├─────────────────────────────────────────────────┤
│  [Emoji] │ Course Title                          │
│          │ • Description (2 lines truncated)     │
│          │ • [Badge] | ⏱ Duration | ⭐ Rating   │
│          │                                       │
│          │ [Action Button]                       │
│          │ [Secondary Action]                    │
├─────────────────────────────────────────────────┤
│  Progress Bar (for enrolled courses)            │
├─────────────────────────────────────────────────┤
│  [View Course Content]  → Expands to show...    │
└─────────────────────────────────────────────────┘
```

### Expanded Course Structure
```
┌─ MODULE 1 (Gradient Background)
│  └─ Chapter 1.1 (Folder Icon)
│     └─ Topic 1.1.1 (Video Icon) ← Type indicator
│     └─ Topic 1.1.2 (Article Icon)
│     └─ Topic 1.1.3 (Quiz Icon)
│  └─ Chapter 1.2
│     └─ Topic 1.2.1
│     └─ Topic 1.2.2
└─ MODULE 2
   └─ ... (Same structure)
```

---

## 🔍 Course Detail Page Layout

### Sidebar Structure
```
┌─────────────────────────────────┐
│  ← Back to Courses              │
├─────────────────────────────────┤
│  Course: Data Structures        │
│  Progress: ████████░░ 75%       │
├─────────────────────────────────┤
│                                 │
│  📦 Module 1 (Expandable)       │
│  ├─ 📁 Chapter 1.1 ⏶          │
│  │  ├─ 🎬 Topic 1 (Blue)       │
│  │  ├─ 📄 Topic 2 (Gray)       │
│  │  └─ ✅ Topic 3 (Green)      │
│  │                              │
│  ├─ 📁 Chapter 1.2 ▶           │
│  │  └─ (Collapsed)              │
│  │                              │
│  📦 Module 2 ▶                 │
│     (Collapsed)                 │
│                                 │
├─────────────────────────────────┤
│  [Profile Section]              │
│  👤 John                        │
└─────────────────────────────────┘
```

### Main Content Area
```
┌─────────────────────────────────────────────────────┐
│  TOPIC TITLE                           [Mark Complete]
│  [Badge: Video] ⏱ 15 min                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📚 STUDY NOTES                                     │
│  ┌────────────────────────────────────────────────┐ │
│  │ [PDF Icon]  DS_Introduction.pdf                 │ │
│  │             2.4 MB • Nov 15, 2024               │ │
│  │             Complete introduction with...       │ │
│  │             [View Notes Button]                 │ │
│  └────────────────────────────────────────────────┘ │
│                                                     │
│  🎬 VIDEO TUTORIAL                                  │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                │ │
│  │         [YouTube Embedded Video Player]        │ │
│  │                                           [⛶]   │ │
│  ├────────────────────────────────────────────────┤ │
│  │ Duration: 15:45                                │ │
│  │ Learn the basics of data structures and...     │ │
│  └────────────────────────────────────────────────┘ │
│                                                     │
│  📋 RESOURCES & PRACTICE                           │
│  [📝 Download] [🔗 Resources] [💬 Q&A]            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Color & Typography System

### Text Hierarchy
```
H5 (36px)  → Page Titles          | "My Courses"
H6 (24px)  → Section Headers      | "Study Notes"
Subtitle1  → Card Titles          | Course/Topic titles
Subtitle2  → Important Text       | Module titles
Body1      → Main content         | Descriptions
Body2      → Supporting content   | Metadata
Caption    → Small text           | Timestamps
```

### Color Roles
```
Primary Colors:
• Primary: Header & sidebar bg
• PrimaryDark: Darker header variant
• PrimaryLight: Lighter accent elements
• Accent: CTAs, highlights, important elements
• Secondary: Alternative accent color
• SecondaryLight: Lighter alternative

Neutral Colors:
• textDark: Primary text (dark mode)
• textLight: Primary text (light mode)
• backgroundDark: Page bg (dark mode)
• backgroundLight: Page bg (light mode)
• paperDark: Card bg (dark mode)
• paperLight: Card bg (light mode)
```

---

## 🔘 Interactive Components

### Buttons & CTAs
```
PRIMARY (Gradient Background)
┌──────────────────────┐
│  ▶ Continue Learning │  ← Icon + Text
└──────────────────────┘
   Used for: Main actions, proceed to next step

ACCENT (Gradient)
┌──────────────────────┐
│  + Enroll Now        │
└──────────────────────┘
   Used for: Positive actions, enrollment

OUTLINE (Border only)
┌──────────────────────┐
│  Download Notes      │
└──────────────────────┘
   Used for: Secondary actions

TEXT
─────────────────────────
  Unenroll
─────────────────────────
   Used for: Tertiary actions, destructive options

DISABLED
┌──────────────────────┐
│  (faded) Mark Complete│
└──────────────────────┘
   Used for: Unavailable actions
```

### Progress Indicators
```
Linear Progress:
████████░░ 75%
[Blue gradient bar]
[Background: low opacity]

Chip Badge:
┌─────────┐
│ PDF     │ ← File type
└─────────┘

Status Badge:
✓ Completed         ← Green checkmark
🎬 Video (15 min)   ← Type-specific
📄 Article          ← Type-specific
❓ Quiz             ← Type-specific
```

### Navigation States
```
Selected Topic:
┌──────────────────────────┐
│ 🎬 Topic Title           │  ← Highlighted with accent color
│    1.1 min               │     Larger border width
└──────────────────────────┘     Glow effect

Completed Topic:
┌──────────────────────────┐
│ ✓ Topic Title            │  ← Green checkmark
│   (strikethrough or muted)│
└──────────────────────────┘

Hover State:
┌──────────────────────────┐
│ 🎬 Topic Title           │  ← Slightly elevated
│    1.1 min               │     Color change
└──────────────────────────┘     Smooth transition
```

---

## 📐 Spacing & Layout

### Card Padding
```
Large Cards (Course/Topic Headers):
Padding: 24px (3rem)
Gap between elements: 16px (1rem)

Standard Cards (Sections):
Padding: 24px (3rem)
Border radius: 12px

Small Elements (Sidebar Items):
Padding: 12px (1.5rem)
Border radius: 8px
```

### Column Grid
```
Main Content: 
- Single column, full width
- Max width: None (responsive)
- Margins: 32px (4rem) on sides

Sidebar:
- Fixed width: 320px
- Sticky positioning
- Persistent on scroll

Responsive:
- Mobile: Stack layout, sidebar as drawer
- Tablet: Sidebar collapses to icons
- Desktop: Full sidebar visible
```

---

## 🎭 Animation & Transitions

### Collapse/Expand
```
Timing: 300-400ms ease-in-out
Direction: Vertical (modules/chapters) or Horizontal (themes)
Visual: Smooth height/width change with opacity fade

Module Expand:
┌─────────────┐
│ Module ▼    │  ← Chevron rotates 90°
├─────────────┤
│ Chapter 1   │  ← Slides in from top
│ Chapter 2   │  ← Fades in
└─────────────┘
```

### Hover Effects
```
Cards:
- Translate Y: -4px (slight lift)
- Shadow: Enhanced
- Duration: 200ms

Buttons:
- Background: Color shift
- Scale: 1.02 (very slight)
- Duration: 150ms

Menu Items:
- Translate X: 5px (slide right)
- Background: Subtle highlight
- Duration: 200ms
```

### Page Load
```
Fade In:
Opacity: 0 → 1
Transform: translateY(20px) → 0
Duration: 500ms ease-out
Applies to: All major sections
```

---

## 📊 Responsive Design Breakpoints

```
Desktop (> 1024px):
├─ Sidebar: 320px fixed
├─ Content: Full width minus sidebar
├─ Grid: 2-3 columns where applicable
└─ Font sizes: Standard

Tablet (768px - 1024px):
├─ Sidebar: 280px fixed or collapsible
├─ Content: Adjusted margins
├─ Grid: 1-2 columns
└─ Font sizes: Slightly reduced

Mobile (< 768px):
├─ Sidebar: Drawer/modal
├─ Header: Hamburger menu
├─ Content: Full width
├─ Grid: Single column
├─ Font sizes: Optimized for reading
└─ Touch: Larger tap targets (44px min)
```

---

## 🎯 User Flow Diagrams

### Student Learning Journey
```
                    ┌──────────────────┐
                    │ Dashboard (Home) │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Courses Page     │
                    │ (Browse/Enroll) │
                    └────────┬─────────┘
                             │
               ┌─────────────┼─────────────┐
               │                           │
        ┌──────▼──────┐           ┌───────▼──────┐
        │ Enroll Course│           │ View Enrolled│
        └──────┬──────┘           └───────┬──────┘
               │                         │
               └────────────┬────────────┘
                            │
                   ┌────────▼────────┐
                   │ Course Detail   │
                   │ Select Topic    │
                   └────────┬────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
         ┌──────▼─┐   ┌─────▼────┐   ┌─▼──────┐
         │View    │   │Watch     │   │Take    │
         │Notes   │   │Video     │   │Quiz    │
         └────────┘   └──────────┘   └────────┘
                │
         ┌──────▼──────────┐
         │Mark Complete    │
         │Update Progress  │
         └─────────────────┘
```

### Admin Notes Upload Flow
```
         ┌──────────────────┐
         │ Admin Dashboard  │
         └────────┬─────────┘
                  │
         ┌────────▼────────┐
         │ Notes Management│
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │ Click Upload    │
         │ Button          │
         └────────┬────────┘
                  │
    ┌─────────────▼──────────────┐
    │ Upload Dialog Opens        │
    ├────────────────────────────┤
    │ Enter:                      │
    │ • Course ID                │
    │ • Topic ID                 │
    │ • File Name                │
    │ • File Type                │
    │ • Description (optional)   │
    └─────────────┬──────────────┘
                  │
         ┌────────▼────────┐
         │ Click Upload    │
         └────────┬────────┘
                  │
         ┌────────▼────────────────┐
         │ Progress Bar Shows      │
         │ Upload Status           │
         └────────┬────────────────┘
                  │
         ┌────────▼────────────────┐
         │ Success Confirmation   │
         │ Note Added to Table    │
         └────────────────────────┘
```

---

## 🎨 Accessibility Features

### Color Contrast
```
Text on Light Background:
• Primary text: #333333 (WCAG AAA)
• Secondary text: #666666 (WCAG AA)

Text on Dark Background:
• Primary text: #FFFFFF (WCAG AAA)
• Secondary text: #E0E0E0 (WCAG AA)

Links & CTAs:
• Always distinguishable from text
• Use color + additional indicator
• Sufficient contrast ratio: 4.5:1 minimum
```

### Focus States
```
Keyboard Navigation:
┌────────────────────────┐
│ › ╳ Topic Title         │  ← Focus ring (accent color)
│      15 min            │     Blue outline
└────────────────────────┘

Outline width: 2-3px
Visible on all interactive elements
```

### ARIA Labels
```
<Button aria-label="Mark topic as complete">
  ✓ Complete
</Button>

<ExpandButton aria-expanded={isExpanded}>
  View Course Content
</ExpandButton>

<Progress aria-label="Course progress: 75%">
  ████░░░
</Progress>
```

---

## 📋 Component Specifications

### Course Card Dimensions
```
Width: Full available (responsive)
Height: Auto (content-driven)
Min-Height: 280px
Max-Width: None

Header Section:
- Thumbnail: 70x70px with emoji/icon
- Padding: 24px
- Gap: 16px between elements

Action Area:
- Buttons: 120-150px width
- Button gap: 8px vertical

Expanded Content:
- Padding: 16px
- Module item height: Auto
- Max inner height: 600px (scrollable)
```

### Sidebar Dimensions
```
Width: 320px (fixed)
Height: 100vh (full viewport)
Position: Fixed, left: 0
Z-index: 100
Border-right: 1px solid (theme color)
Overflow: Auto (with scrollbar)

Logo Section: 64px height
Menu items: 48px each
Spacing: 8px gaps

Profile section: 80px height
```

### Video Player Dimensions
```
Aspect Ratio: 16:9
Width: 100% of container
Height: Auto (56.25% padding-bottom)
Max-Width: None (responsive)
Border-radius: 12px
Shadow: Elevated

Fullscreen Mode:
Width: 100vw
Height: 100vh
Position: Fixed, z-index: 200
```

---

## 🎯 Performance Optimizations

### Image Optimization
```
Thumbnail emoji: Rendered as text (no image file)
Icons: SVG via @mui/icons-material (optimized)
Background: CSS gradients (no image)

Result: Minimal image downloads, fast rendering
```

### Lazy Loading
```
Course content: Expanded on demand (collapse/expand)
Video: Embedded iframe (lazy loads)
Long lists: Virtual scrolling recommended for 100+ items
```

### CSS-in-JS Optimization
```
Theme colors: Computed once at context level
Transitions: 200-400ms (smooth but responsive)
Animations: GPU-accelerated (transform, opacity)
```

---

**Design Guidelines Version**: 1.0  
**Last Updated**: December 12, 2025  
**Status**: ✅ Ready for Implementation
