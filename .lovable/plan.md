
## Comprehensive Fix and Educational Material Integration

### Part 1: Fix the Runtime Crash (Critical)

**Root Cause:** `renderContent()` in `contentRenderer.tsx` crashes when passed `undefined` instead of a string. This happens when the EducationalLibrary component calls `renderContent(value)` on JSON fields that don't exist (e.g., a comparison entry value that is missing, or a resource field that is `undefined`).

**Fix in `src/utils/contentRenderer.tsx`:**
- Add a guard at the top of `renderContent`: if `text` is not a string, return it as-is (or return empty)
- Add the same guard in `parseContent`
- This single change fixes all the crashes throughout the Educational Library

### Part 2: Extend `renderContent` to All Text Fields

Currently only `resource.content` goes through the renderer but other text fields (keyTakeaways, scenario, therapeuticConsiderations, antiTherapeuticRisks, therapeuticApproaches, connection text, example text, step descriptions) also contain references that should be linked. The EducationalLibrary component already calls `renderContent` on most of these fields -- this is already done but is the source of the crash when values are `undefined`.

### Part 3: Integrate Uploaded Educational Materials

Add new resources to `src/data/educationalLibrary.json` drawn from the uploaded files. Each will be a condensed, structured summary (not a full-text dump) placed in the appropriate existing category:

**New resources to add:**

1. **"Two Decades of Therapeutic Jurisprudence"** (category: `tj-foundations`)
   - Summary of TJ's 20-year evolution, key milestones, and global expansion
   - Links to Wexler, Winick, Perlin references

2. **"PHIPA: Full Act Overview"** (category: `legislation-context`)
   - Structured overview of PHIPA's parts, key sections, and therapeutic implications
   - Links to specific PHIPA sections

3. **"Public Hospitals Act: Privacy Dimensions"** (category: `legislation-context`)
   - Hospital management regulations relevant to privacy (patient records, access, consent)
   - Links to PHIPA cross-references

4. **"Health Privacy Officer Handbook Insights"** (category: `implementation-tools`)
   - Key practical guidance: 16-step privacy program, cultivating privacy culture, breach management
   - Links to PHIPA provisions referenced

5. **"Digital Privacy in Healthcare Education"** (category: `privacy-as-principle`)
   - Digital privacy concepts applied to healthcare: data protection, emerging technology, patient rights in digital contexts

6. **"Therapeutic Jurisprudence-Centered Privacy Impact Assessment (TJPIA)"** (category: `implementation-tools`)
   - The TJPIA framework: 8 dimensions, scoring methodology, anti-therapeutic patterns
   - Links to PHIPA, FIPPA, academic citations

### Part 4: Additional Sweep Items

- **DecisionTreeSession.tsx line 67**: `useEffect` is called conditionally after an early return -- this violates Rules of Hooks. Will restructure to ensure all hooks are called unconditionally.
- **Verify all navigation routes** in Header, Landing, LearnHub work correctly and don't lead to dead ends.

### Technical Details

**Files to modify:**
1. `src/utils/contentRenderer.tsx` -- Add null/undefined guard to `renderContent` and `parseContent`
2. `src/data/educationalLibrary.json` -- Add 6 new resource entries across appropriate categories
3. `src/pages/DecisionTreeSession.tsx` -- Fix hooks ordering violation

**Files unchanged:**
- `src/pages/EducationalLibrary.tsx` -- Already calls `renderContent` on all relevant fields; the crash fix in the renderer resolves all issues
- All other pages -- No changes needed after the renderer fix
