# HalfBuilt

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full multi-page React application with 4 routes: `/`, `/submit`, `/project/:id`, `/about`
- Motoko backend with User, Project, and Proposal data models
- GitHub username-based auth (local state, no OAuth redirect)
- Impact Ticker showing live stats from backend
- Responsive project feed grid (approved projects only)
- Project submission form with multi-tag tech stack input
- Project detail view with Handover Proposal modal
- Manifesto page (text-focused, static content)
- Mobile-first responsive nav with hamburger menu

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- `User` record: `github_id`, `github_username`, `github_avatar_url`, `created_at`
- `Project` record: `id`, `title`, `repo_url`, `tech_stack` (array), `handover_type`, `pitch`, `status` (variant: pending/approved/adopted), `submitter_github_id`, `created_at`
- `Proposal` record: `id`, `project_id`, `proposer_github_id`, `message`, `created_at`
- Mutations: `connectUser(github_id, username, avatar_url)`, `submitProject(...)`, `submitProposal(...)`, `updateProjectStatus(id, status)` (admin)
- Queries: `getApprovedProjects()`, `getAllProjects()`, `getProjectById(id)`, `getStats()` → `{listed, in_audit, adopted}`

### Frontend
1. **Auth context** — GitHub username connect flow; stores `{github_id, github_username, github_avatar_url}` in localStorage and React context. Modal prompt for connect.
2. **Navigation** — Logo "HalfBuilt", links Registry/Submit/About, Connect GitHub button; hamburger collapse on mobile.
3. **Home (`/`)** — Hero headline, subheadline, Impact Ticker (live stats), project feed grid with empty state.
4. **Project cards** — Title, tech stack tags, handover type badge, pitch excerpt, "View Project" CTA.
5. **Submit (`/submit`)** — Auth gate, form (title, repo URL, tech stack multi-tag, handover type select, pitch textarea), submit to backend, success state.
6. **Project View (`/project/:id`)** — Full details, submitter info, "Request Handover" button, proposal modal with auth gate.
7. **About (`/about`)** — Manifesto text layout.
8. **Routing** — React Router for all pages.
