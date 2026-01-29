# OpenAttribution Website

Website for [openattribution.org](https://openattribution.org) — an open standards body developing specifications for AI content transparency.

## Standards

OpenAttribution defines three complementary standards:

- **AIMS** (AI Manifest Standard) — DID-based agent identity and content access rights
- **Telemetry** — Session-based content attribution tracking
- **Disclosure Label** — Runtime compliance assertion via HTTP header

All specifications are [Apache 2.0 licensed](https://www.apache.org/licenses/LICENSE-2.0).

## Repository Structure

```
index.html          — Main single-page site
styles.css          — Custom styles (Tailwind via CDN)
script.js           — Form validation, scroll effects, mobile menu
aims/               — AIMS specification subpage
  index.html        — AIMS landing page
  spec.css          — Documentation stylesheet
  examples/         — Example manifests and viewer
telemetry/          — Telemetry specification subpage
  index.html        — Telemetry landing page
  spec.css          — Documentation stylesheet
_layouts/           — Jekyll layouts for spec pages
_config.yml         — Jekyll configuration
img/                — Images
```

## Development

This is a static site hosted on GitHub Pages. No build step required.

To preview locally:
```bash
# Simple HTTP server
python3 -m http.server 8000

# Or with Jekyll (for spec pages using layouts)
bundle exec jekyll serve
```

## Resources

- **Website**: [openattribution.org](https://openattribution.org)
- **GitHub Org**: [github.com/openattribution-org](https://github.com/openattribution-org)
- **AIMS SDK**: `pip install openattribution-aims`
- **Telemetry SDK**: `pip install openattribution-telemetry`
- **Contact**: info@openattribution.org
