# Decisions Log — Frankenstein

Started 2026-07-14. Records real decisions as they're made — what was chosen, what the alternative was, and why — so the reasoning isn't lost the way it was for earlier work (see `SUMMARY.md` for what had to be reconstructed from file/git archaeology instead). Newest entries at the top.

---

## 2026-08-11 — Built Forside as a new Frankenstein view, not a standalone static prototype
**Decision:** New `src/forside/` view recreating the real Helsenorge forside (Figma `OOhkNC18f5jrwa1C3TT4wV`, node 230:3677 default / 230:3673 expanded) inside the shared React app, reusing real design-system components throughout (LinkList, Tile, PromoPanel, Toggle where it was briefly used).
**Alternative considered:** A hand-rolled static HTML/CSS prototype at the repo root, matching the convention used by `behandlingshjelpemidler/`, `gravid/`, etc.
**Why:** User explicitly chose the Frankenstein-view route. It also made the rest of the day's work possible: activation state and deep-linking between Forside and Psykisk helse only work as *real* shared React state because both live in one app on one origin — a standalone static prototype would have needed to fake all of that.

## 2026-08-11 — New "Valgbare tjenester" section for growing set of optional tjenester (Psykisk helse, Gravid, Småbarnsliv)
**Decision:** A new section inserted after "Kvalitet og styring" inside the "Se alle tjenester" expander lists all 3 candidate tjenester as plain navigation rows (icon + label + chevron, same layout as every other group). Not in the Figma reference at all — designed fresh.
**Alternative considered:** Two separate sections — "Valgbare tjenester" as a toggle-driven activate/deactivate list, and an always-visible "Valgbare fliser" tile grid mirroring the same 3 items regardless of activation status. Built and shipped this first, then reworked it twice more (moved fliser inside the expander and converted it from a Tile grid to a plain LinkList row per feedback, then deleted the toggle-based Valgbare tjenester section entirely once "activated"/"deactivated" stopped needing a manual control at all).
**Why:** Once Psykisk helse's activation became fully derived (see next entry), a manual toggle list had nothing left to toggle for it, and duplicating the same 3 rows in two visually different sections (tiles vs. list) added complexity without a clear reason once both were pure navigation. One list, no toggles, is simpler and matches how the rest of the expander already behaves.

## 2026-08-11 — Psykisk helse's Snarveier presence is derived from hasCompletedVeiviser(), not a manually toggled flag
**Decision:** Whether Psykisk helse appears as a Snarveier on Forside is computed live from the same `ph-veiviser-completed` localStorage flag that already drives the "deep-link straight to results" decision — reaching results sets it, confirming "Avslutt tjenesten" clears it (and now always navigates back to Forside). No separate activation state to keep in sync.
**Alternative considered:** A generic `activatedTjenester` Set (localStorage-persisted) shared across all 3 valgbare tjenester, toggled explicitly via UI — this was the original design and is still how Gravid/Småbarnsliv work, since neither has a "results" concept to derive activation from.
**Why:** User's own framing: "when the psykisk helse tjeneste is activated (when there exists a results page, in other words)." Psykisk helse already had a real, meaningful signal for "has this been used" — reusing it removes an entire category of possible bugs (the two states silently drifting out of sync) for free. Gravid/Småbarnsliv don't have an equivalent signal yet, so they're still on the generic Set with no activate/deactivate UI at all currently — a known gap, not yet addressed.

## 2026-08-11 — Gravid gets a thin Frankenstein placeholder view, not a full port
**Decision:** `src/gravid/` is a minimal view (header, breadcrumb, H1, one status panel) — just enough for Forside to have a real in-app destination. The existing static `gravid/index.html` prototype (countdown ring, weekly content, sticky notes, growth chart) is untouched and stays separate.
**Alternative considered:** Port the full tracker into Frankenstein as part of this work.
**Why:** User's explicit scoping call — porting the full tracker is a distinctly larger, separate task, not a side effect of building Forside.

## 2026-08-11 — Småbarnsliv is a placeholder tile only, no real prototype
**Decision:** Småbarnsliv appears in Valgbare tjenester with real copy/icon and is inert (no navigation target). Its icon (`ChildIcon.tsx`) is a temporary hand-traced stand-in from a Figma node, since no "Child" icon exists yet in `@helsenorge/designsystem-react` — swap for the real shipped icon once it lands.
**Alternative considered:** Also stub out a minimal Småbarnsliv prototype so all 3 tjenester link somewhere real.
**Why:** User's explicit scoping call, keeping this task bounded to Forside itself.

## 2026-08-11 — Din fastlege uses the real PromoPanel component, not a hand-rolled HighlightPanel+Illustration layout
**Decision:** Rebuilt using `PromoPanel` (`illustration="Doctor"`, `color="cherry"`), which natively supports illustration + title-as-link + subtext-via-children + trailing arrow — exactly this pattern.
**Alternative considered:** The original build used `HighlightPanel` with an `Illustration` component manually laid out via custom CSS, since `HighlightPanel`'s own `svgIcon` slot only accepts small icons, not illustrations.
**Why:** User caught that a purpose-built component existed for this. Real component > hand-rolled equivalent whenever one exists — same principle applied throughout this repo already (e.g. the Resepter/PLL rebuilds from real Figma references).

## 2026-08-11 — Psykisk helse results: temporarily show all matches, not just top 3
**Decision:** Removed the "show 3, hide the rest behind a 'Se flere...' Expander" pattern from both the Verktøy and Artikler result sections — both now render every matched resource in a single flat list.
**Alternative considered:** Keep the top-3-plus-expander pattern as is.
**Why:** The original top-3 cut relied on a prioritizing/ranking engine to decide which 3 resources actually deserved the promoted spot. That engine won't be ready before Christmas, so the "top 3" shown today would just be whatever happens to sort first — not a meaningful recommendation. Showing everything avoids implying a false prioritization. Revisit once the engine exists: restore the top-3 cut (or similar) once results can be genuinely ranked rather than arbitrarily truncated.

## 2026-07-17 — Resepter expanded detail replaced with the real "E-resept" field set
**Decision:** Dropped the invented Forskrivende lege/Reseptnummer/Gyldig til fields and the per-card "Forny resept" button from `Panel.ExpandedContent`, replacing them with the real field list from a reference the user shared (Figma file `UAhljteF5I4yI9lwrpxta7`, node `3398:1004`): Legemiddel, Bruksområde, Dosering, Virkestoff, ATC-kode, Pakningsstørrelse, Antall, Rekvirert av/dato, Gyldig til, Reiterasjoner, Antall utleveringer, Refusjonshjemmel, Reseptstatus, Resepten er hentet fra. `Prescription.kanFornyes`/`fornyesNote` (my own invented fields) are gone; `reiterasjoner: 0` on Metoprolol now expresses "no refills left, needs a new legetime" using a real field instead.
**Alternative considered:** Keep the invented fields since they conveyed similar information.
**Why:** A real reference exists now — matching it is strictly better than an approximation, and the reference doesn't show a per-card renew button at all (only the top-of-page one), so removing it isn't a loss, it's a correction.

## 2026-07-17 — Resepter view rebuilt from a real reference, kept PLL's medications instead of the screenshot's own
**Decision:** Recreated the Resepter list page structure/fields from a real reference screenshot the user shared (Figma file `UAhljteF5I4yI9lwrpxta7`, node `3396:937`) using Frankenstein/design-system components (`Tabs`, `Select`, `StatusDot`, `Panel.ExpandedContent`, `LinkList`), but populated it with the existing PLL medication catalog (Lamotrigin, Rivaroksaban, Metoprolol, Kandesartan, Paracetamol, Valporinsyre) rather than the reference's own drug names (Lipitor, Norvasc, Aerius, and two vaccines). Added a `pllInfoFor()` lookup in `data.ts` so Resepter cards source their indikasjon/dosering/dispensed-brand text from the same PLL entries instead of a separate copy.
**Alternative considered:** Use the reference's own medications verbatim, matching the screenshot exactly including vaccines.
**Why:** User explicitly asked to "use the same medicines as those in the PLL so that the two lists are harmonized" — the point is demonstrating one coherent patient record across both views, not maximum fidelity to an unrelated screenshot's mock data. Vaccines were dropped rather than inventing new unrelated PLL entries for them.

## 2026-07-17 — Tjeneste name is always "Resepter", regardless of PLL presence
**Decision:** Landing page H1, browser tab title, and breadcrumb label from sub-pages all changed from "Legemiddelliste" to "Resepter". Landing ingress changed to "Medisiner som er forskrevet for deg og hvordan du skal bruke dem." The PLL sub-page keeps its own "Legemiddelliste" H1 (verbatim from the Figma reference) — that's a page title, not the service name.
**Alternative considered:** Keep the vault note's original "Design proposal" — name it "Legemiddelliste" when both Resepter and PLL are present, "Resepter" only when PLL is absent.
**Why:** User explicitly overrode the earlier proposal — the tjeneste should always be called "Resepter". Not otherwise justified in the note (design direction still evolving); recorded as the current decision, superseding the conditional-naming proposal.

<!-- Template for new entries:

## YYYY-MM-DD — Short decision title
**Decision:** what was chosen
**Alternative considered:** what else was on the table
**Why:** the reason this one won

-->

## 2026-07-15 — Built Sykdom og kritisk informasjon inside Frankenstein, not as a static-HTML prototype
**Decision:** New prototype lives at `src/sykdom-kritisk-info/` as a Frankenstein React page, using real `@helsenorge/designsystem-react` components (Panel, Tag, Expander, EmptyState, Tabs, Title).
**Alternative considered:** A hand-rolled static HTML/CSS folder at the repo root, matching the convention used by `behandlingshjelpemidler/`, `egenregistreringer/`, etc.
**Why:** User explicitly chose "use Frankenstein" when Figma's Code Connect step found no codebase match for the design outside of Frankenstein's design-system dependency. Code Connect mapping itself failed server-side ("published component not found") since these components were never registered via Figma's publish flow — abandoned that path and built directly from `get_design_context` output instead.

## 2026-07-15 — No dedicated Netlify site for Sykdom og kritisk informasjon yet
**Decision:** Shipped only via Frankenstein's existing combined deploy (reachable at `#sykdom-kritisk-info`); did not create a new Netlify site.
**Alternative considered:** Provision a new site the way `psykisk-helse` and `behandlingshjelpemidler` each got their own hostname-detected dedicated deploy.
**Why:** Creating a new Netlify site is an external, harder-to-reverse action — deferred until the user confirms they want a standalone shareable link for this prototype.

## 2026-07-15 — Empty vs. populated state get separate URLs, not an in-page toggle
**Decision:** Reverted an in-page "Har registreringer / Ingen registreringer" toggle button and replaced it with hash-based routing (`#populert`, `#tom`) inside `SykdomKritiskInfo`, mirroring how `psykisk-helse` handles its own sub-views.
**Alternative considered:** The toggle button (shipped briefly, then reverted same day).
**Why:** User feedback — selector controls inside the page aren't part of the Figma design; each design frame should be independently shareable at its own URL instead.

## 2026-07-15 — Category titles/descriptions sourced verbatim from the vault note
**Decision:** Replaced the placeholder category descriptions (invented for the 8 categories the Figma frames didn't show detail for) with the real text from `Helsenorge/Sykdom og kritisk info.md`'s "Kategori-tekster" section, added by the user after the initial build.
**Alternative considered:** Keep the placeholder copy.
**Why:** User explicitly asked to pull category text from the Obsidian note. One category id/title was renamed (`annen-prosedyreending` → `annen-prosedyreendring`) to match the note's corrected spelling; the Implantat description's leading "I" (dropped in the note — "nnopererte...") was restored as an obvious typo fix, not a wording change.

## 2026-07-16 — Rebuilt PLL view from a real Figma reference, dropped the custom discrepancy callout
**Decision:** Replaced the invented flat PLL mock with content transcribed from a real reference design the user shared (Figma file `UAhljteF5I4yI9lwrpxta7`, node `3393:7599`), including fields not previously modeled (Virkestoff, Sist utlevert, indication tags, MULTIDOSE badge, Fast/Ved behov grouping, Avsluttet legemidler + Legemiddelreaksjoner as collapsible sections with count badges). Dropped the earlier hand-built "discrepancy" warning box (red flag + cross-link) in favor of letting the same medication (now Valporinsyre, matching the reference's own "avsluttet" example) simply appear as active in Resepter and discontinued in PLL — the mismatch is demonstrated by the data itself, not a bespoke UI element.
**Alternative considered:** Keep the custom discrepancy callout, just re-skin it to match the new visual style.
**Why:** User asked to "refer to my current Figma selection for design direction" — the reference has no inline cross-reference/warning pattern between Resepter and PLL entries, so inventing one there would contradict the instruction to follow the actual design rather than my own earlier guess. The conceptual-divide point from `Helsenorge/Legemidler.md` still holds, just demonstrated more subtly (compare the two tabs) instead of flagged explicitly.

## 2026-07-16 — Legemiddelliste: reframe Resepter vs. PLL by task, not service name
**Decision:** Landing page links are labeled by the question a patient actually has ("Hva kan jeg hente på apoteket?" / "Hva skal jeg bruke, og hvordan?") rather than by service name ("Resepter" / "Pasientens legemiddelliste"), and the PLL view carries an explicit discrepancy flag + cross-link back to Resepter when the two disagree (demonstrated with the Ibux mock data — active resept, but seponert in PLL).
**Alternative considered:** Just implement the note's "Design proposal" section literally (umbrella name + two links naming each component), without the discrepancy flag.
**Why:** The note documents real patient confusion about what "resept" vs. "legemiddelliste" even mean; task-framed language sidesteps that jargon. But hiding the vocabulary risks burying the case where the two sources genuinely disagree — which is clinically the most important moment to surface, not paper over. Added the discrepancy UI so the prototype demonstrates the tradeoff instead of just the happy path.

## 2026-07-16 — No Figma design for Legemiddelliste — built directly from the vault note
**Decision:** All content (medication mock data, view structure, discrepancy demo) derived from `Helsenorge/Legemidler.md` directly; no Figma frames existed to reference, unlike Sykdom og kritisk informasjon.
**Alternative considered:** Wait for a design before prototyping.
**Why:** The vault note's own to-do explicitly asked for "a prototype demonstrating a new conceptual divide" — the prototype *is* the design exploration here, not an implementation of a prior design decision.

#helsenorge
