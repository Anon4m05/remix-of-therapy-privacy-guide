

## Fix: Markdown Artifacts and Add Content Linking in Educational Library

### Problem
1. The educational library JSON content contains `**bold**` markdown syntax (e.g., `**Empathy**`, `**Relegated to Compliance**`), but the component renders raw text, so users see literal asterisks.
2. References to legislation (PHIPA sections, FIPPA, MFIPPA) and IPC decisions are plain text instead of being linked to the actual in-app content.

### Solution

#### 1. Create a content renderer utility (`src/utils/contentRenderer.tsx`)

A small React utility function that processes raw text strings and returns JSX with:

- `**bold text**` converted to `<strong>` elements
- PHIPA section references (e.g., "PHIPA s.29", "PHIPA s.17") converted to links pointing to `/learn/phipa`
- FIPPA section references converted to links pointing to `/learn/fippa`
- MFIPPA references converted to links pointing to `/learn/mfippa`
- IPC Decision references (e.g., "Decision 290", "IPC Decision 298") converted to links pointing to `/ipc-decisions`

The function will use regex to identify these patterns and split the text into an array of strings and JSX elements.

#### 2. Update `src/pages/EducationalLibrary.tsx`

Replace the raw `{resource.content}` render (line 73) with a call to the new content renderer. This single change fixes both issues across all resources.

### What stays the same
- The JSON data files are not modified
- All other rendering logic (key takeaways, dimensions, scenarios, etc.) remains unchanged
- Only the `content` field rendering is updated

### Technical details

The renderer handles these patterns:
- `**text**` -> `<strong class="font-semibold">text</strong>`
- `PHIPA s.XX` / `PHIPA Section XX` -> `<Link to="/learn/phipa">PHIPA s.XX</Link>`
- `FIPPA` references -> `<Link to="/learn/fippa">...</Link>`
- `MFIPPA` / `M/FIPPA` references -> `<Link to="/learn/mfippa">...</Link>`
- `Decision 290` / `IPC Decision 298` -> `<Link to="/ipc-decisions">Decision 290</Link>`
- Patterns like `Perlin (2019)` or `Campbell (2010)` -> linked to the "Academic Foundations" category tab within the Educational Library itself

