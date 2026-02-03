# Ralph Agent Instructions - JHR Website

You are an autonomous coding agent working on the JHR Photography website project.

## Project Context

- **Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** AWS (DynamoDB, S3, CloudFront, Cognito)
- **Brand:** Dark theme (#0A0A0A), gold accent (#C9A227), white text
- **Fonts:** Inter (body), Outfit (display)

## Your Task

1. Read the PRD at `scripts/ralph/prd.json`
2. Read the progress log at `scripts/ralph/progress.txt` (check Codebase Patterns section first)
3. Check you're on the correct branch from PRD `branchName`. If not, check it out or create from main.
4. Pick the **highest priority** user story where `passes: false`
5. Implement that single user story
6. Run quality checks: `npm run typecheck` (or `npx tsc --noEmit`)
7. Update CLAUDE.md files if you discover reusable patterns (see below)
8. If checks pass, commit ALL changes with message: `feat: [Story ID] - [Story Title]`
9. Update the PRD to set `passes: true` for the completed story
10. Append your progress to `scripts/ralph/progress.txt`

## JHR-Specific Guidelines

### File Organization
- Pages go in `/app/[route]/page.tsx`
- Components go in `/components/[category]/ComponentName.tsx`
- API routes go in `/app/api/[endpoint]/route.ts`
- Utilities go in `/lib/[name].ts`
- Context providers go in `/context/[Name]Context.tsx`

### Styling Conventions
- Use Tailwind CSS classes
- Brand colors: `bg-jhr-black`, `text-jhr-white`, `text-jhr-gold`, `bg-jhr-gold`
- Use existing UI components from `/components/ui/` when available
- Dark theme by default

### Component Patterns
- Use 'use client' directive for interactive components
- Use Lucide React for icons
- Use Framer Motion for animations (already installed)

### Admin Panel Styling
- Sidebar: Dark background (#0A0A0A), gold accent for active items
- Cards: Dark background with subtle border
- Buttons: Gold for primary actions, gray for secondary

## Progress Report Format

APPEND to scripts/ralph/progress.txt (never replace, always append):
```
## [Date/Time] - [Story ID]
- What was implemented
- Files changed
- **Learnings for future iterations:**
  - Patterns discovered (e.g., "this codebase uses X for Y")
  - Gotchas encountered (e.g., "don't forget to update Z when changing W")
  - Useful context (e.g., "the admin layout is in /app/admin/layout.tsx")
---
```

The learnings section is critical - it helps future iterations avoid repeating mistakes.

## Consolidate Patterns

If you discover a **reusable pattern**, add it to the `## Codebase Patterns` section at the TOP of progress.txt:

```
## Codebase Patterns
- Admin components use shadcn/ui style with Tailwind
- All admin pages are protected by middleware.ts
- Use /lib/auth.ts for authentication helpers
- API routes use NextResponse for responses
```

## Quality Requirements

- ALL commits must pass typecheck (`npx tsc --noEmit`)
- Do NOT commit broken code
- Keep changes focused and minimal
- Follow existing code patterns in the codebase
- Use existing components when available

## Browser Testing

For any story that changes UI, include acceptance criteria verification:
1. The dev server should be running (`npm run dev`)
2. Navigate to the relevant page
3. Verify the UI changes work as expected

If browser tools are not available, note that manual verification is needed.

## Stop Condition

After completing a user story, check if ALL stories have `passes: true`.

If ALL stories are complete and passing, reply with:
<promise>COMPLETE</promise>

If there are still stories with `passes: false`, end your response normally (another iteration will pick up the next story).

## Important Reminders

- Work on ONE story per iteration
- Commit after each successful story
- Keep the build green (typecheck must pass)
- Read existing code before writing new code
- Don't over-engineer - keep it simple
- Update progress.txt with learnings
