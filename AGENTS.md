# EcoZox Agent Guidelines

## Project Overview
Simple static website with HTML/CSS/JS. No build tools, package managers, or test frameworks.

## Development
- View site: Open `index.html` in browser
- Components: HTML injected via `data-component` attributes
- JS modules: Loaded in order by `app.js` after DOM ready
- CSS: Styles in `css/` directory, main stylesheet `style.css`

## Structure
- `index.html`: Main page
- `components/`: Reusable UI components (header, footer, product-card, etc.)
- `js/`: Feature modules (cart, gallery, toast, etc.)
- `css/`: Stylesheets
- `assets/`: Images, icons
- `locales/`: i18n JSON files
- `pages/`: Additional HTML pages (if any)

## Notes
- No special setup required
- No linting, testing, or build commands
- All scripts load with `defer` for proper ordering
- i18n handled via `js/i18n.js` and data attributes