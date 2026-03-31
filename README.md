# Angavu Metrics — Website & Brand Assets

Professional website and brand materials for Angavu Metrics, a consultancy specialising in monitoring, evaluation, accountability and learning (MEAL), impact evaluations, and policy advisory.

## Structure

```
website/       → Static website (HTML/CSS/JS) — deploy this folder
brand/         → Brand strategy documents (Markdown)
templates/     → Branded proposal and report templates (HTML)
```

## Deployment (GitHub Pages)

This site is configured for **GitHub Pages** deployment from the `website/` folder.

### Option A: GitHub Actions (Recommended)

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source → GitHub Actions**
3. The workflow at `.github/workflows/deploy.yml` will automatically deploy the `website/` folder

### Option B: Manual (gh-pages branch)

```bash
git subtree push --prefix website origin gh-pages
```
Then set GitHub Pages source to the `gh-pages` branch.

### Option C: Netlify / Vercel

Set the **publish directory** to `website/` and deploy.

## Brand Palette

| Colour        | HEX       | Usage                    |
|---------------|-----------|--------------------------|
| Insight Navy  | `#1A365D` | Primary, headings         |
| Impact Teal   | `#2A9D8F` | Secondary, CTAs, accents  |
| Earth Gold    | `#D4A843` | Highlights, emphasis      |
| Warm Cream    | `#F9F7F4` | Backgrounds               |

## Fonts

- **Headings:** Plus Jakarta Sans (Google Fonts)
- **Body:** Source Sans 3 (Google Fonts)

## Contact

info@angavumetrics.com | Nairobi, Kenya
