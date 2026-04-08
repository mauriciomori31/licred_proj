# AGENTS.md - LICRED Landing Page

## Project Type
Static HTML/CSS/JS landing page - no build system required.

## Key Files
- `index.html` - Main landing page
- `styles.css` - Design system (CSS custom properties)
- `script.js` - Form handling, animations, mobile optimizations

## Running Locally
Open `index.html` directly in browser, or serve locally:
```bash
npx serve .
# or
python -m http.server 8000
```

## Forms & External Integrations
- Forms POST to `https://webhookn8n.ntwsaas.app.br/webhook/` endpoints
- Lead form: `webhook/gratis` (download guide)
- Contact form: `webhook/contatolid` (contact submission)

## External Dependencies (CDN)
- Google Fonts: Inter, Outfit
- Feather Icons: `https://unpkg.com/feather-icons`

## Mobile Performance
The `script.js` includes mobile optimizations:
- Visibility change detection
- Throttled scroll handlers using requestAnimationFrame
- Reduced animation duration support (prefers-reduced-motion)
- Device capability detection for fallbacks

## Available Skills
Local skills exist in `.agents/skills/`:
- `frontend-design` - Design decisions and systems
- `mobile-performance-optimization` - Mobile optimization techniques

## Notes
- Forms include basic phone input masking
- Toast notifications for success feedback
- Glass navbar effect on scroll