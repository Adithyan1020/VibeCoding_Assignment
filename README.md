# Wobb Influencer Search - Project Submission

## What I Changed
- **Complete Visual Overhaul (Brutalist UI)**: Completely redesigned the interface from a basic layout to a striking, retro-inspired Brutalist design. This included a vibrant grid background, thick solid black borders, heavy offset drop-shadows, and a typography switch to `Archivo Black` and `Space Mono`.
- **Component Architecture**: 
  - Restructured `Layout.tsx` to feature a giant header and a globally floating bottom navigation bar.
  - Implemented a sliding drawer for the "Shortlisted" profiles using `framer-motion`.
  - Upgraded the profile cards to act like scattered polaroids that snap into place on hover.
  - Revamped the `ProfileDetailPage.tsx` to resemble an old-school macOS window with massive "REJECT" and "SHORTLIST" action buttons.
## Initial Code Bugs Found & Fixed
During the development process, several hidden bugs and structural issues from the initial starter code were identified and fixed:

1. **Dependency Installation Crash (`ERESOLVE`)**
   - **The Bug**: Running `npm install` on the initial code failed immediately with an `ERESOLVE` error. The project was using React 19, but the included `react-beautiful-dnd` package was highly outdated and strictly required React 18 or lower.
   - **The Fix**: Uninstalled the deprecated package and replaced it with `@hello-pangea/dnd`, which is the officially maintained community fork that supports React 19 natively.

2. **Missing Profile Data Crash**
   - **The Bug**: The `loadProfileByUsername` function assumed every creator had a detailed `.json` file in the `assets/data/profiles` folder. However, the initial code only provided these files for a select few creators. Clicking on most TikTok or YouTube profiles resulted in an ugly "Could not load profile details" screen.
   - **The Fix**: Implemented a smart fallback mechanism in `profileLoader.ts`. If the detailed file is missing, the app gracefully falls back to extracting their summary data from the main platform search JSONs.

3. **`TypeError: Cannot read properties of undefined (reading 'toLowerCase')`**
   - **The Bug**: The initial search filtering logic (`dataHelpers.ts`) assumed every single creator had a `username` property. However, many YouTube creators (like CoComelon or Vlad and Niki) actually omitted the `username` property in the JSON and instead used a `handle` or `custom_name`. Searching for them caused a fatal crash.
   - **The Fix**: Updated the extraction logic to normalize the data. If a `username` is undefined, it safely falls back to checking `p.handle` or `p.user_id`.

4. **The `NaN%` Engagement Rate Bug**
   - **The Bug**: On `ProfileDetailPage.tsx`, the engagement rate was hardcoded as `(user.engagement_rate! * 100).toFixed(1)`. For creators where `engagement_rate` was `undefined`, this evaluated to `undefined * 100`, resulting in a broken "NaN%" displaying in the UI.
   - **The Fix**: Added a safe ternary check to display "N/A" if the metric doesn't exist.

5. **Scroll Lock Bug**
   - **The Bug**: In the initial code (and early iterations), opening a modal or sidebar did not lock the background. You could scroll the main body content while looking at the overlay.
   - **The Fix**: Bound a `document.body.style.overflow = 'hidden'` toggle to the sidebar's open state via a `useEffect` hook.

## Libraries Added
1. **`framer-motion`**: Used for buttery-smooth animations, layout transitions, and the sliding sidebar drawer.
2. **`lucide-react`**: Used for all the modern, clean SVG icons throughout the app (Search, Trash, Home, Chevron, Bookmark, etc.).
3. **`@hello-pangea/dnd`**: Replaced the broken `react-beautiful-dnd` dependency. (Note: While installed and ready to resolve the build errors, drag-and-drop functionality wasn't fully implemented in the UI yet).

## Assumptions Made
- **Data Fetching**: I assumed that because this is a purely frontend assignment without a backend API, it was acceptable to read the mock JSON data locally, and implement in-memory fallbacks when detailed JSON profiles were missing from the template.
- **Design Freedom**: I assumed full creative liberty to revamp the aesthetic to match the provided Figma screenshot, moving away from conventional "clean" corporate dashboards to a highly stylized Brutalist design.

## Trade-offs
- **State Management**: The "Shortlisted" drawer relies on a custom `openSidebarEvent` to trigger from different components (like `PlatformFilter`). While functional and lightweight, in a larger application, this UI state might be better managed by a global UI store (like Zustand or Redux) to avoid manual event listener cleanup.
- **Client-Side Search**: The search filtering currently runs entirely on the client side via `filterProfiles`. This is perfectly fine for the small mock dataset, but for a real application with millions of users, this would need to be offloaded to a backend database with pagination or infinite scrolling.

## Remaining Improvements
- **Drag-and-Drop Reordering**: We successfully migrated the broken dnd dependency, but the next step would be to actually implement `<DragDropContext>` in the Shortlist drawer so users can reorder their saved influencers based on priority.
- **Pagination**: Implement pagination or a "Load More" button on the main search page to prevent rendering hundreds of DOM nodes at once.
- **Advanced Filtering**: Add sorting options (e.g., sort by highest followers, sort by engagement rate) rather than just a raw text search.
