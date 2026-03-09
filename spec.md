# HalfBuilt Registry

## Current State
- Full multi-page app with Home, Registry, Submit, ProjectView, About pages
- Obsidian Glass design system in place with Electric Indigo (#4F46E5) accents
- Registry page has a vacuum state (zero-project) with an "INITIALIZE FIRST REPOSITORY" button that currently links to `/submit` page
- Navbar has a "Join the Brotherhood" button that opens ConnectModal (auth)
- Submit page is a full standalone page at `/submit`
- Backend supports `submitProject` via `actor.submitProject(...)`
- Auth via AuthContext (GitHub-based)

## Requested Changes (Diff)

### Add
- `PostProjectModal` component: a centered `.obsidian-glass` overlay modal triggered from two entry points
  - Overlay: `rgba(5,5,5,0.9)` background with `blur(30px)`
  - Card: `max-width: 650px`, `width: 90%`, border pulses Electric Indigo on hover
  - 4 form fields with monospace labels (`> PROJECT_ID`, `> THE_SOUL (ONE LINER)`, `> CURRENT_STATUS (THE HALF-BUILT TRUTH)`, `> SOURCE_LINK`)
  - Each field: transparent background, white bottom border only
  - Genesis toggle: "Claim Genesis Status (Remaining: XX/100)" — when checked, subtle indigo glow spreads behind the modal
  - Execute button: `[ EXECUTE_INITIALIZATION ]` — solid Electric Indigo, animated loading bar showing UPLOADING_GENIUS... 45%... 89%... DONE
  - ESC key and `[ esc_to_cancel ]` corner text to close
- State management: `postModalOpen` boolean state shared between Navbar and Registry via a global/lifted approach (or component prop drilling)

### Modify
- `Registry.tsx`: `InitializeButton` — remove `<Link to="/submit">` wrapper, instead call `onOpenModal()` callback to open PostProjectModal. Accept `onOpenModal` prop.
- `Navbar.tsx`: `JoinButton` — when user is already authenticated, clicking "Join the Brotherhood" opens PostProjectModal instead of ConnectModal
- `App.tsx`: Lift `postModalOpen` state at root layout level, pass open/close handlers down to Navbar and Registry via context or props

### Remove
- Direct navigation from "INITIALIZE FIRST REPOSITORY" to `/submit` page (replaced by modal)

## Implementation Plan
1. Create `PostProjectModal.tsx` component with all overlay physics, form fields, Genesis toggle, animated execute button, and ESC close behavior
2. Add a `PostProjectModalContext` (or lift state in `App.tsx` RootLayout) to share modal open state between Navbar and Registry
3. Modify `Registry.tsx` — wire InitializeButton to open the post modal
4. Modify `Navbar.tsx` — when authenticated user clicks "Join the Brotherhood", open PostProjectModal instead of ConnectModal
5. Wire submit logic to existing `useSubmitProject` mutation
6. Validate and deploy
