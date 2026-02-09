# JHR Photography Website — Claude Code Guide

## Content Deployment Pipeline

After editing schema files in `/content/schemas/`, content must be pushed to DynamoDB before changes appear on the live site. DynamoDB published content always takes precedence over schema defaults.

### Staging (Amplify)
```bash
# Deploy all pages (merge mode — preserves user-uploaded images)
curl -s -X POST "https://main.danki5kmggsn7.amplifyapp.com/api/admin/content/seed" \
  -H "Content-Type: application/json" -d '{"slugs":["all"]}'

# Deploy specific pages (merge mode)
curl -s -X POST "https://main.danki5kmggsn7.amplifyapp.com/api/admin/content/seed" \
  -H "Content-Type: application/json" -d '{"slugs":["home","services"]}'

# Force overwrite — DESTRUCTIVE, resets user edits including uploaded images
curl -s -X POST "https://main.danki5kmggsn7.amplifyapp.com/api/admin/content/seed" \
  -H "Content-Type: application/json" -d '{"slugs":["home"], "force": true}'

# List available pages
curl -s "https://main.danki5kmggsn7.amplifyapp.com/api/admin/content/seed"
```

### Seed Modes
- **Default (merge)**: Pushes schema text/structure to DynamoDB but preserves user-uploaded images (hero backgrounds, CTA backgrounds, feature card images, gallery images, OG images)
- **Force overwrite** (`"force": true`): Full reset to schema defaults — destroys all user edits including uploaded images. Use only when intentionally resetting a page.

### Local development
Replace the Amplify URL with `http://localhost:3000`.

## Schema Registry

`/content/schema-registry.ts` is the single source of truth mapping site slugs to `PageSchema` objects. When adding a new page:

1. Create the schema file in `/content/schemas/`
2. Add the import and map entry in `/content/schema-registry.ts`
3. The admin pages API and seed endpoint will pick it up automatically

## Key Architecture

- **Framework**: Next.js 14 (App Router), standalone output for Docker
- **Content loading**: DynamoDB published → localStorage draft → schema defaults (see `ContentContext.tsx`)
- **Schema files**: `/content/schemas/*.ts` — each exports a `*_PAGE_SCHEMA` constant
- **Section types**: hero, text-block, feature-grid, image-gallery, cta, testimonials, faq, columns, stats
- **Section renderer**: `SectionRenderer.tsx` maps section type → component
- **Types**: `/types/inline-editor.ts` (PageSchema, section discriminated union), `/types/content.ts` (DynamoDB types)

## Key File Locations

| File | Purpose |
|------|---------|
| `content/schema-registry.ts` | Central slug → PageSchema map |
| `content/schemas/*.ts` | Page content schemas |
| `app/api/admin/content/seed/route.ts` | Seed API endpoint |
| `app/api/admin/content/sections/route.ts` | Section CRUD API |
| `app/api/admin/content/publish/route.ts` | Publish API |
| `lib/content.ts` | DynamoDB content service layer |
| `components/inline-editor/SectionRenderer.tsx` | Section type → component mapper |

## Build & Verify

```bash
npx tsc --noEmit   # Type check
npm run build       # Full production build
npm run dev         # Local development server
```
