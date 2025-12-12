# Minimal Component System

## Quick Visual Reference

---

## 1. Buttons

### Primary Button (Contained)
```
┌─────────────────────┐
│   START WATCHING    │  ← 16px/600, White text
└─────────────────────┘     #000000 background
                            1px solid border
                            0px border-radius
                            16px × 32px padding
```

### Secondary Button (Outlined)
```
┌─────────────────────┐
│   VIEW ALL          │  ← 16px/600, Black text
└─────────────────────┘     #FFFFFF background
                            1px solid #000000 border
                            Hover: #F5F5F5 background
```

### Text Button (Navigation)
```
HOME    MOVIES    SERIES
  ↑
1px bottom border when active
```

---

## 2. Cards

### Movie/Series Card
```
┌─────────────────────┐
│                     │
│                     │
│     Poster Image    │  ← 2:3 aspect ratio
│     (object-fit:    │     1px solid #E5E5E5 border
│      cover)         │     Hover: border → #000000
│                     │
│                     │
└─────────────────────┘
       ↓ 16px gap
   Movie Title (14px)
```

**Code:**
```typescript
<Box sx={{
  position: 'relative',
  paddingBottom: '150%',  // 2:3 ratio
  border: '1px solid',
  borderColor: 'divider',
  '&:hover': {
    borderColor: 'text.primary',
  }
}}>
  <Image src={poster} fill />
</Box>
```

---

## 3. Typography Examples

### Page Structure
```
┌────────────────────────────────────────┐
│                                        │
│         128px spacing                  │
│                                        │
│   Watch Movies & Series                │ ← H1 (48px/600)
│                                        │
│         32px spacing                   │
│                                        │
│   Unlimited access to content          │ ← Body1 (16px/400)
│                                        │
│         64px spacing                   │
│                                        │
│        [START WATCHING]                │ ← Button
│                                        │
│         128px spacing                  │
│                                        │
├────────────────────────────────────────┤
│                                        │
│         64px spacing                   │
│                                        │
│   Foreign Movies          View All →   │ ← H3 (24px/600)
│                                        │
│         32px spacing                   │
│                                        │
│   [Grid of 8 cards]                   │
│                                        │
└────────────────────────────────────────┘
```

---

## 4. Header Component

```
┌──────────────────────────────────────────────────────────┐
│                        80px height                        │
│                                                          │
│  PersiaPlay    HOME  MOVIES  SERIES  GENRES   [SIGN IN] │
│     ↑            ↑                               ↑       │
│   Logo       Navigation                        CTA      │
│   24px/600   16px/400                       Contained   │
│              32px gaps                       Button     │
│                                                          │
└──────────────────────────────────────────────────────────┘
              1px solid #E5E5E5 bottom border
```

**Features:**
- Sticky position
- White background (#FFFFFF)
- Black text (#000000)
- Active nav item: 600 weight + 1px bottom border
- No search bar
- Mobile: "Menu" button instead of full nav

---

## 5. Footer Component

```
┌──────────────────────────────────────────────────────────┐
              1px solid #E5E5E5 top border
│                                                          │
│         64px spacing                                     │
│                                                          │
│  PersiaPlay        Legal           Contact              │ ← 20px/600
│  Online streaming  Terms           Email                │ ← 14px/400
│  platform          Privacy         Telegram             │
│                    DMCA                                  │
│                                                          │
│         32px spacing                                     │
├──────────────────────────────────────────────────────────┤
│              1px solid #E5E5E5 divider                   │
│         16px spacing                                     │
│                                                          │
│          © 2025 PersiaPlay. All rights reserved.        │ ← 14px/400
│                                                          │
│         16px spacing                                     │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Grid Layout

### Desktop (4 columns)
```
┌────┐  ┌────┐  ┌────┐  ┌────┐
│    │  │    │  │    │  │    │
└────┘  └────┘  └────┘  └────┘
   ↕ 24px gaps

┌────┐  ┌────┐  ┌────┐  ┌────┐
│    │  │    │  │    │  │    │
└────┘  └────┘  └────┘  └────┘

Grid container spacing={3}  (24px)
size={{ xs: 6, sm: 4, md: 3 }}
```

### Mobile (2 columns)
```
┌────────┐  ┌────────┐
│        │  │        │
└────────┘  └────────┘
     ↕ 24px gaps

┌────────┐  ┌────────┐
│        │  │        │
└────────┘  └────────┘
```

---

## 7. Form Elements

### Text Input
```
┌──────────────────────────────────────┐
│ Search movies and series...          │
└──────────────────────────────────────┘
     1px solid #E5E5E5 border
     Focus: border → #000000
     0px border-radius
     16px padding
     White background
```

**Code:**
```typescript
<TextField
  fullWidth
  placeholder="Search..."
  sx={{
    '& .MuiOutlinedInput-root': {
      background: '#FFFFFF',
      borderRadius: 0,
      '&.Mui-focused fieldset': {
        borderColor: '#000000',
        borderWidth: '1px',
      }
    }
  }}
/>
```

---

## 8. Spacing Examples

### Section Spacing
```
Hero:     [128px top] Content [128px bottom]
Section:  [64px top] Content [64px bottom]
Cards:    [24px gap] between items
Text:     [16px gap] between paragraphs
Inline:   [8px gap] between chips/tags
```

### Container Padding
```
Desktop:  32px left/right
Tablet:   24px left/right
Mobile:   16px left/right
```

---

## 9. Interactive States

### Button States
```
Default:    #000000 background, #FFFFFF text
Hover:      No change (minimal = no hover effects)
Active:     No change
Disabled:   #E5E5E5 background, #999999 text
```

### Link States
```
Default:    #000000, 400 weight
Hover:      #000000, no underline
Active:     #000000, 600 weight, 1px bottom border
Visited:    Same as default (no color change)
```

### Card States
```
Default:    1px solid #E5E5E5 border
Hover:      1px solid #000000 border
Focus:      1px solid #000000 border
```

---

## 10. Complete Homepage Layout

```
┌────────────────────────────────────────────────────────┐
│ HEADER (80px)                                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│ HERO (128px padding top/bottom)                       │
│   - H1 Headline                                       │
│   - Body text                                         │
│   - CTA Button                                        │
│                                                        │
├────────────────────────────────────────────────────────┤
│                    1px divider                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│ FOREIGN MOVIES (64px padding top/bottom)              │
│   - H3 Section title + View All link                  │
│   - 4×2 Grid (8 cards total)                         │
│                                                        │
├────────────────────────────────────────────────────────┤
│                    1px divider                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│ FOREIGN SERIES (64px padding top/bottom)              │
│   - H3 Section title + View All link                  │
│   - 4×2 Grid (8 cards total)                         │
│                                                        │
├────────────────────────────────────────────────────────┤
│                    1px divider                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│ IRANIAN MOVIES (64px padding top/bottom)              │
│   - H3 Section title + View All link                  │
│   - 4×2 Grid (8 cards total)                         │
│                                                        │
├────────────────────────────────────────────────────────┤
│                    1px divider                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│ IRANIAN SERIES (64px padding top/bottom)              │
│   - H3 Section title + View All link                  │
│   - 4×2 Grid (8 cards total)                         │
│                                                        │
├────────────────────────────────────────────────────────┤
│                  128px spacing                         │
├────────────────────────────────────────────────────────┤
│ FOOTER (64px padding top/bottom)                      │
│   - 3 columns                                          │
│   - Copyright                                          │
└────────────────────────────────────────────────────────┘
```

---

## Usage Examples

### Creating a New Section
```typescript
<Box sx={{ py: 8 }}> {/* 64px */}
  <Container maxWidth="xl">
    <Typography variant="h3" sx={{ mb: 4 }}> {/* 32px */}
      Section Title
    </Typography>
    
    <Grid container spacing={3}> {/* 24px gaps */}
      {items.map(item => (
        <Grid key={item.id} size={{ xs: 6, md: 3 }}>
          {/* Card content */}
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>
```

### Creating a Button Group
```typescript
<Stack direction="row" spacing={2}> {/* 16px gaps */}
  <Button variant="contained">
    Primary Action
  </Button>
  <Button variant="outlined">
    Secondary Action
  </Button>
</Stack>
```

### Creating a Card
```typescript
<Box
  component={Link}
  href="/movie/slug"
  sx={{
    display: 'block',
    textDecoration: 'none',
  }}
>
  <Box
    sx={{
      position: 'relative',
      paddingBottom: '150%',  // 2:3 ratio
      border: '1px solid',
      borderColor: 'divider',
      '&:hover': {
        borderColor: 'text.primary',
      },
    }}
  >
    <Image src={poster} alt={title} fill />
  </Box>
  <Typography variant="body2" sx={{ mt: 2 }}>
    {title}
  </Typography>
</Box>
```

---

## Design Tokens Quick Reference

```typescript
// Colors
black:     '#000000'
white:     '#FFFFFF'
offWhite:  '#F5F5F5'
gray:      '#999999'
lightGray: '#E5E5E5'

// Spacing (px)
xs:   8
sm:   16
md:   24
lg:   32
xl:   64
xxl:  128

// Typography (px/weight)
H1:    48/600
H3:    24/600
Body1: 16/400
Body2: 14/400

// Borders
All:   1px solid
Radius: 0px

// Shadows
All:   none
```

---

**All components follow these exact specifications for consistency.**
