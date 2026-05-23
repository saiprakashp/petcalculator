# Pet Age Calculator — Guide

This document explains the structure of `pet-age-calculator.html`, how the page is built, and how to update colors and layout in the future.

## 1. File purpose

`pet-age-calculator.html` is a single-page tool that converts dog or cat age into human-equivalent years. It contains:
- HTML content and page metadata
- Embedded CSS for styling and responsive layout
- Embedded JavaScript for calculator logic, UI interactions, and modal behavior

## 2. Main structure

The file is divided into these main areas:

1. `<head>`
   - Metadata: title, description, social tags, canonical URL
   - Google Fonts import
   - Embedded `<style>` block with all CSS
   - JSON-LD schema for search engines

2. `<body>`
   - `header.site-header`: top navigation and site branding
   - `.layout-wrapper`: main grid containing the calculator and sidebar
   - `main.main-content`: calculator card, result area, articles, FAQ, tables
   - `aside.sidebar`: ads or secondary content
   - `footer.site-footer`: footer links and source attribution
   - modal dialogs: about, contact, privacy, legal, sitemap

3. `<script>`
   - Data tables for dog and cat conversions
   - Utility functions for age conversion and UI updates
   - Modal open/close helpers
   - Accessibility event handling

## 3. How colors are currently defined

Colors are mostly defined in the `:root` section of the CSS using CSS variables:

```css
:root{
  --sand:#FAF7F2;
  --sand-mid:#F0EBE0;
  --sand-dark:#D9CFBB;
  --ink:#2A2118;
  --ink-muted:#7A6E5F;
  --amber:#C4722A;
  --amber-light:#F5E2CC;
  --teal:#2A7A6A;
  --teal-light:#CDF0E8;
  --radius:18px;
  --radius-sm:10px;
  --tap:48px;
}
```

This is already a good pattern. The best way to design colors is to keep this palette simple and then use semantic names for page roles.

### Recommended improvements for color design

Instead of only color names, use semantic design tokens such as:

- `--bg-page`
- `--surface`
- `--surface-muted`
- `--text-primary`
- `--text-secondary`
- `--border`
- `--accent`
- `--accent-soft`
- `--success`
- `--error`

Example:

```css
:root {
  --bg-page: #FAF7F2;
  --surface: #FFFFFF;
  --surface-muted: #F5E2CC;
  --border: #D9CFBB;
  --text-primary: #2A2118;
  --text-secondary: #7A6E5F;
  --accent: #C4722A;
  --accent-soft: #F5E2CC;
  --success: #2A7A6A;
  --error: #A32D2D;
}
```

Then replace hardcoded values across the stylesheet with these semantic variables.

### Why this is better

- One place to change the entire look
- Easier to add a second theme later (dark mode, high contrast)
- Clearer meaning when editing the CSS
- Better consistency across buttons, cards, text, and borders

## 4. Where to change colors

### Page background and text

Update these in `:root` and the related CSS rules:

```css
body { background: var(--bg-page); color: var(--text-primary); }
.card, .modal { background: var(--surface); }
```

### Card and border styles

Replace direct `#fff`, `#D9CFBB`, and `var(--sand-dark)` values with semantic variables:

- `.card` border color
- `.modal` border and background
- `.article-block` border color
- `.table-wrap` border color

### Button and accent styles

Update these rules:

- `.toggle-btn`
- `.toggle-btn.active`
- `.calc-btn`
- `.footer-link:hover`
- `.ad-placeholder`

For example:

```css
.calc-btn { background: var(--text-primary); }
.calc-btn:hover { background: var(--accent); }
```

### Error and result states

Use semantic variables for messages:

```css
.error-msg { background: #FFF3F3; border-color: #F09595; color: #A32D2D; }
.result-card { background: var(--teal-light); }
```

Better version:

```css
.error-msg {
  background: #FFF3F3;
  border-color: var(--error);
  color: var(--error);
}
.result-card {
  background: var(--accent-soft);
}
```

## 5. How to update layout later

### Main layout

The core grid is controlled by:

```css
.layout-wrapper { display:grid; grid-template-columns:minmax(0,1fr) 300px; gap:40px; }
```

To make the calculator full-width on mobile, update or add responsive rules in the media queries.

### Mobile flow

The mobile rules are near the end of the stylesheet:

```css
@media(max-width:850px) { ... }
@media(max-width:720px) { ... }
@media(max-width:600px) { ... }
```

These decide when the layout switches from side-by-side to stacked, and how the buttons and tables shrink.

## 6. JavaScript summary

### Data tables

- `DOG_TABLE`: dog age conversion values by years and size.
- `CAT_TABLE`: cat age conversion values by years.
- `SIZE_INDEX`: maps `small`, `medium`, `large` to table columns.

### Main functions

- `dogYearsToHuman(totalYears,size)` — calculates human age for dogs, including fractional years.
- `catYearsToHuman(totalYears)` — calculates human age for cats.
- `dogLifeStage(years,size)` — returns a life stage string for dogs.
- `catLifeStage(years)` — returns a life stage string for cats.
- `selectPet(type)` — toggles dog/cat mode and hides size selection for cats.
- `selectSize(size)` — updates the selected dog size button.
- `hideResult()` — hides the result card and error message.
- `calculate()` — reads inputs, validates values, calculates the result, and shows the result card.
- Modal helpers: `openModal(id)` and `closeModal()`

### What to change in JS

To change calculator behavior:
- update `DOG_TABLE` / `CAT_TABLE` values
- change the age conversion functions
- modify the text in `calculate()` for result formatting
- update `dogLifeStage` / `catLifeStage` thresholds

## 7. Better color design ideas

### Option 1: Keep the same palette, but use semantic tokens

Use a small palette of 6–8 variables and rename them by role, not by color.

### Option 2: Add a theme palette

Add a second theme like this:

```css
body[data-theme='dark'] {
  --bg-page: #1B1A17;
  --surface: #272522;
  --text-primary: #F7F5EF;
  --text-secondary: #C5BCA8;
  --accent: #E09F3E;
  --accent-soft: #3E6B60;
}
```

Then switch the theme by setting `document.body.dataset.theme = 'dark'` or `light` in JavaScript.

### Option 3: Use a single accent color family

Choose one strong accent and one muted accent for all interactive elements.

For example:
- accent: dark amber `#C4722A`
- accent-soft: pale amber `#F5E2CC`
- surface: white `#FFFFFF`
- border: warm neutral `#D9CFBB`
- text: dark brown `#2A2118`

This gives a calm, consistent veterinary brand look.

## 8. Quick editing tips

- To change text content: edit the HTML inside tags such as `<h1>`, `<p>`, `<button>`, `<summary>`, and table cells.
- To change the page title or SEO metadata: edit the `<title>` and `<meta>` tags in the `<head>`.
- To change spacing: adjust `padding`, `margin`, and `gap` values in `.card`, `.layout-wrapper`, `.field`, and `.article-block`.
- To change fonts: update the Google Fonts import and `font-family` values.

## 9. Recommended next step

If you want a cleaner future setup, split the file into:
- `index.html`
- `styles.css`
- `script.js`

That makes it much easier to maintain and change colors or layout separately.

---

If you want, I can also generate a version of this page with the color palette rewritten using semantic theme variables and a small CSS legend.