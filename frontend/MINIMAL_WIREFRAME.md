# Minimal Design Wireframe

## 8px Grid Overlay Structure

```
┌────────────────────────────────────────────────────────────┐
│ HEADER (80px height)                                       │
│ ┌────────┬──────────────────────────────┬────────────┐    │
│ │ Logo   │    HOME  MOVIES  SERIES      │  [SIGN IN] │    │
│ └────────┴──────────────────────────────┴────────────┘    │
├────────────────────────────────────────────────────────────┤ 1px border
│                                                            │
│                     128px spacing ↕                        │
│                                                            │
│ ┌────────────────────────────────────────────────────┐    │
│ │              HERO SECTION                          │    │
│ │                                                    │    │
│ │              Watch Movies & Series                 │    │ 48px H1
│ │                                                    │    │
│ │         32px spacing ↕                            │    │
│ │                                                    │    │
│ │      Unlimited access to thousands of content     │    │ 16px body
│ │                                                    │    │
│ │         64px spacing ↕                            │    │
│ │                                                    │    │
│ │              [START WATCHING]                      │    │ Button
│ │                                                    │    │
│ └────────────────────────────────────────────────────┘    │
│                                                            │
│                     128px spacing ↕                        │
│                                                            │
├────────────────────────────────────────────────────────────┤ 1px divider
│                                                            │
│                      64px spacing ↕                        │
│                                                            │
│ FOREIGN MOVIES                          View All →        │ 24px H3
│                                                            │
│         32px spacing ↕                                    │
│                                                            │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                  │
│ │      │  │      │  │      │  │      │                  │
│ │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │                  │ 2:3 ratio
│ │      │  │      │  │      │  │      │                  │ 1px border
│ └──────┘  └──────┘  └──────┘  └──────┘                  │
│  Title     Title     Title     Title                      │ 14px
│                                                            │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                  │
│ │      │  │      │  │      │  │      │                  │
│ │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │                  │
│ │      │  │      │  │      │  │      │                  │
│ └──────┘  └──────┘  └──────┘  └──────┘                  │
│  Title     Title     Title     Title                      │
│                                                            │
│        24px gaps between cards                            │
│                                                            │
│                      64px spacing ↕                        │
│                                                            │
├────────────────────────────────────────────────────────────┤ 1px divider
│                                                            │
│ (REPEAT FOR: Foreign Series, Iranian Movies, etc)         │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│                      128px spacing ↕                       │
│                                                            │
├────────────────────────────────────────────────────────────┤ 1px border
│ FOOTER (64px padding)                                     │
│                                                            │
│ irdnl         Legal          Contact                 │
│ Online streaming   Terms          Email                   │
│                    Privacy        Telegram                │
│                    DMCA                                    │
│                                                            │
│              32px spacing ↕                               │
├────────────────────────────────────────────────────────────┤ 1px border
│              © 2025 irdnl                            │ 14px center
└────────────────────────────────────────────────────────────┘
```

## Grid System Breakdown

### Header (80px height)
```
[8px] [Logo] [32px] [Nav Items with 32px gaps] [32px] [CTA] [8px]
```

### Hero Section (128px top/bottom padding)
```
         [128px padding]
              ↓
        [48px Headline]
              ↓
         [32px spacing]
              ↓
        [16px Body text]
              ↓
         [64px spacing]
              ↓
          [Button]
              ↓
         [128px padding]
```

### Content Sections (64px top/bottom padding)
```
         [64px padding]
              ↓
    [24px Section Title] [View All]
              ↓
         [32px spacing]
              ↓
    [Grid: 4 columns × 2 rows]
    [24px gaps horizontal/vertical]
    [1px borders on cards]
              ↓
         [64px padding]
```

### Footer (64px padding)
```
         [64px padding]
              ↓
    [3 columns: Brand | Legal | Contact]
    [32px gaps between columns]
              ↓
         [32px spacing]
              ↓
    [1px border]
              ↓
         [16px padding]
              ↓
    [Copyright text]
              ↓
         [16px padding]
```

## Responsive Breakpoints

### Mobile (< 600px)
- Stack navigation (hamburger menu)
- Single column grid
- 16px side padding
- 64px section spacing

### Tablet (600px - 960px)
- 3-column grid
- Visible navigation
- 24px side padding
- 64px section spacing

### Desktop (> 960px)
- 4-column grid
- Full navigation
- 32px side padding
- 64px section spacing

## Color Application

```
Background:     #FFFFFF (White)
Text:           #000000 (Black)
Borders:        #E5E5E5 (Light Gray)
Hover Borders:  #000000 (Black)
Secondary Text: #999999 (Gray)
Buttons:        #000000 bg / #FFFFFF text
```

## Typography Hierarchy

```
H1 (Hero):           48px / 600 weight / -0.02em tracking
H2 (Not used):       32px / 600 weight
H3 (Sections):       24px / 600 weight
Body (Description):  16px / 400 weight
Small (Cards):       14px / 400 weight
```

## Component Specifications

### Button (Primary)
```
Height: 48px (16px padding top/bottom)
Width: Auto (32px padding left/right)
Background: #000000
Text: #FFFFFF, 16px, 600 weight
Border: 1px solid #000000
Border Radius: 0
```

### Card
```
Aspect Ratio: 2:3 (portrait)
Border: 1px solid #E5E5E5
Border Radius: 0
Hover: Border → #000000
Image: object-fit: cover
Title: 14px, 400 weight, 16px margin-top
```

### Navigation Link
```
Font: 16px, 400 weight
Active: 600 weight + 1px bottom border
Spacing: 32px gaps
Hover: No background change
```

## Implementation Notes

1. **All spacing values** divisible by 8
2. **No decimals** in spacing (8, 16, 24, 32, 64, 128)
3. **Strict alignment** to baseline grid
4. **1px borders only** - no 2px or thicker
5. **No box-shadows** anywhere
6. **No border-radius** on any element
7. **No transitions/animations**
8. **Maximum whitespace** between sections
