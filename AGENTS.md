# EcoZox Agent Guidelines

## Project Overview
Static HTML/CSS/JS site. No build tools, package managers, or test frameworks.

## Development
- View/edit: Open any HTML file in browser (index.html is main)
- Components: HTML injected via `data-component` attrs (see components/)
- JS: Feature modules loaded in order by app.js after DOM ready
- CSS: Variables in base.css, component styles in css/
- i18n: Translate via js/i18n.js using data-i18n attrs

## Structure
- index.html: Home page
- carrito.html: Cart page  
- contacto.html: Contact page
- producto.html: Product page
- components/: UI components (header.js, footer.js, etc.)
- js/: Feature modules (cart.js, gallery.js, etc.)
- css/: Stylesheets (base.css defines variables)
- assets/: Images/icons
- locales/: i18n JSON files
- pages/: Additional HTML pages

## Notes
- No setup required - edit files and refresh browser
- Scripts load with defer for correct execution order
- Cart count updated via JS in bottom-nav.js
- Base path detected dynamically for deployment flexibility