
## Plan: Fix Jumbled Categories and Broken Academic Citation Links

### Issue 1: Jumbled Category Tabs in Educational Library

**Current Problem:**
- `src/pages/EducationalLibrary.tsx` line 35 uses a rigid CSS grid: `grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 h-auto`
- This forces 6 long category titles ("Therapeutic Jurisprudence Foundations", "Ontario Privacy Legislation in Context", etc.) to fit into a fixed grid
- At larger viewports, titles overflow their cells and overlap, making them unreadable

**Solution:**
- Replace the rigid grid with a flexible flex-wrap layout
- Change `TabsList` className from `grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 h-auto` to `flex flex-wrap gap-2 h-auto w-full justify-start p-2`
- Add `whitespace-nowrap` to each `TabsTrigger` to prevent text from breaking mid-word
- Allow tabs to wrap naturally to multiple rows as needed

**Result:** Category tabs will display cleanly without overlapping, maintaining readable text at all screen sizes.

---

### Issue 2: Broken Academic Citation Links

**Current Problem:**
- `src/utils/contentRenderer.tsx` lines 96-102 match academic citations like "Kawalek (2020)", "Perlin (2019)", etc. using the regex pattern on line 55
- These are rendered as `<Link to="/educational-library">` (lines 98-102)
- Since the user is already on `/educational-library`, clicking these links navigates to the same page and does nothing—they are dead links
- This violates the user requirement that "links listed in the various literature summaries (for example, Kawalek 2020) do not work"

**Solution:**
1. Extend the `TextSegment` interface (line 4-8) to include a new type: `'citation'` (in addition to `'text'`, `'bold'`, `'link'`)
2. Change the academic citation handler (lines 96-102) from creating a broken link to creating a citation type:
   - Replace the current `link` segment with a `citation` segment
   - Push `{ type: 'citation', content: match[14] }` instead
3. Add a new case in the `renderContent` switch statement (lines 119-136) to handle citations:
   - Render citations as visually distinct `<span>` elements with styling: `className="font-medium italic text-[#2E5C8A]"`
   - This makes them look like academic references without being clickable dead links

**Result:** Academic citations will display as styled, italicized text that visually indicates they are recognized references, without the broken link behavior.

---

### Implementation Sequence

1. **`src/utils/contentRenderer.tsx`** (3 changes):
   - Line 5: Extend TextSegment type to include `'citation'`
   - Lines 96-102: Change academic citation handling from `link` type to `citation` type
   - Lines 119-136: Add new `case 'citation'` in renderContent switch with italic styled span

2. **`src/pages/EducationalLibrary.tsx`** (2 changes):
   - Line 35: Replace grid className with flex-wrap className
   - Line 37: Add `whitespace-nowrap` to TabsTrigger

---

### Technical Details

**Why these fixes work:**
- **Tab layout**: Flex-wrap allows natural reflow; gap and padding ensure readable spacing
- **Citations**: Distinguishing them from links prevents confusing UX where a "link" doesn't navigate anywhere; styling (italic, color) still indicates they are references

**No breaking changes:**
- All legislation links (PHIPA, FIPPA, MFIPPA) remain functional
- All IPC Decision links remain functional
- All other rendering behavior unchanged
