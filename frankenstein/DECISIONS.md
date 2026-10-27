# Decisions Log — Frankenstein

Started 2026-07-14. Records real decisions as they're made — what was chosen, what the alternative was, and why — so the reasoning isn't lost the way it was for earlier work (see `SUMMARY.md` for what had to be reconstructed from file/git archaeology instead). Newest entries at the top.

---

## 2026-10-02 — Psykisk helse demo: real App Store icons for the app verktøy (psykiskhelse-demo branch)
**Decision:** The six app tools that still had coloured placeholder shapes (NettOpp, Opp, Slutta, Spillfri, Tankevirus, UngSpotlight) now show their actual App Store icons. These were fetched once through Apple's public iTunes lookup API (`itunes.apple.com/lookup?id=…`, using the id in each tool's `appStoreUrl`), downloaded at 256px to `public/ph-tool-<id>.png`, and shown at 48px with 8px rounded corners like Grubl.
- Grubl keeps its Figma image.
- The five "Selvhjelpsvideo(er)…" programmes aren't apps and keep the video thumbnail from the Figma design.
- No verktøy uses the placeholder any more. The placeholder code stays as a fallback for tools added later without an icon.

**Why:** Direct user request to find actual icons for the tools.

---

## 2026-10-02 — Psykisk helse demo: resource sections grey (psykiskhelse-demo branch)
**Decision:** The three resource containers are grey instead of light blue, using the design system's neutral list-element pair in place of the blueberry one: header `neutral-medium` #EAE7E7 (was #CAE7ED), body `neutral-light` #F5F3F3 (was #E4F7F9). The body grey is the same as the earlier grey Verktøy box. Shape is unchanged: inset, rounded 8px corners.
**Why:** Direct user request. A darker try (body #EAE7E7, header #D6D4D3) was reverted on request. Both are valid tokens, but #D6D4D3 is only used as a hover/pressed state in the design system, and #EAE7E7 is its header colour, so that pairing doesn't match any component setting. The #EAE7E7/#F5F3F3 pair matches an open neutral ExpanderList.

---

## 2026-10-02 — Psykisk helse demo: resource sections inset with rounded corners (psykiskhelse-demo branch)
**Decision:** The three light-blue containers (Selvhjelpsverktøy, Artikler, Noen å snakke med) are no longer full-bleed. They sit inside the page margins with 8px rounded corners, and the top/bottom rules are gone (they clashed with the corners). The light-blue area alone frames each group.

To keep "Åpne chat" and "Ring oss" side by side at the narrower width:
- Container padding is 12px top, 8px sides, 16px bottom (was 12/16/32/14). The 8px sides line up with the header's 8px inset.
- The gap between those two buttons is 12px instead of the design's 16px. It was 1px short otherwise.

This reverses the full-bleed choice from earlier the same day.
**Alternative considered:** Full-bleed ExpanderList-style blocks (the Figma frames' top/bottom rules).
**Why:** User feedback: edge-to-edge blocks don't read as distinct sections. An inset, rounded coloured area visibly surrounds each collection, as the earlier grey Verktøy box did.

---

## 2026-10-02 — Psykisk helse demo: Artikler in the same light-blue container (psykiskhelse-demo branch)
**Decision:** The Artikler section uses the same container as Selvhjelpsverktøy and Noen å snakke med: a light-blue full-bleed block with a header showing the Publication icon and the title "Artikler". The article cards went from the outline Panel (which rendered a thick grey frame and desktop sizes inside the phone frame) to the same white card shell as the tool cards. The icon and title sit on one row, then the category tag, the description, and the outline "Gå til artikkel →" button.
**Why:** Direct user request. Keeping the old outline cards inside the new container would have mixed two card styles on one page.

---

## 2026-10-02 — Psykisk helse demo: "Veiledningstjenester" becomes "Noen å snakke med" (psykiskhelse-demo branch)
**Decision:** The section uses the same light-blue container as Selvhjelpsverktøy, with the PeopleTalking icon. Both services always show, in the design's order (Mental Helse, then Kirkens SOS).

**Cards** (Figma 402:7929/402:7979 and 402:7954/402:8145) use the same Panel shell as the tool cards, without the favourite star:
- Collapsed:
  - The services' own logos.
  - A live status line: "Åpen - Døgnåpen", "Åpen - Stenger 12:00", or "Stengt - Åpner 12:00" / "Åpner i morgen 10:00" / "Åpner mandag".
  - The design's short description.
  - "Åpne chat ↗" (fill) and "Ring oss ↗" (outline, a `tel:` link) side by side.
- Expanded:
  - Beskrivelse, Bemanning and Telefonnummer.
  - Åpningstider as the real Duolist (line variant, bold first column, pinned to 18px/1.2 with a 112px term column).
  - "Gå til nettside ↗" as the real AnchorLink with `target="_blank"`.

**Opening hours and status:** the hours are copied from the design and stored in `resources.json` (`service` block). The status is computed from them.

**Both sections are now full-bleed** (`margin: 0 -1rem`), which is how an ExpanderList with rules only top and bottom sits. This also gives the cards enough width for the two buttons on one row.

**Assumptions:**
- Chat links: sidetmedord.no (Mental Helse) and soschat.no (Kirkens SOS).
- Website links: the organisations' home pages.
- Title "Mental Helse" (as the organisation writes it) rather than the design's "Mental helse".

**Alternative considered:** Fixed status copy taken from one design frame.
**Why:** The frames show different statuses for the same service (collapsed vs. expanded), so the line is clearly meant to reflect the opening hours rather than be fixed text. Direct user request with Figma.

---

## 2026-10-02 — Psykisk helse demo: "Verktøy" becomes "Selvhjelpsverktøy" (psykiskhelse-demo branch)
**Decision:** On the results page, the Verktøy section follows Figma 402:7239 (section) and 402:7738 (expanded card).
- **Section:** renamed "Selvhjelpsverktøy" and built as a static block styled like an open blueberry ExpanderList item:
  - Header: #CAE7ED with the Toolbox icon and an 18px semibold h2, white bottom border.
  - Body: #E4F7F9, padding 12/16/32/14px.
  - #7D7C79 rules above and below.
  - Cards 16px apart.
- **Not the real ExpanderList:** the design leaves the chevron slot empty, so it's a heading, not something you collapse.
- **Cards** keep the real Panel and its "Se detaljer"/"Skjul detaljer" expander:
  - Square corners.
  - Real tool images where the design has them: the Grubl app icon (with its Figma crop) and the self-help video thumbnail for every "Selvhjelpsvideo(er)…" tool. Other tools keep the coloured placeholder.
  - Descriptions at 18px/1.5 black.
  - Web tools' button is now "Åpne verktøy ↗" (fill + ArrowUpRight), like "Last ned app ↗".
  - "Vis mer om verktøyet" gets its → arrow.
  - 16px between the main button and "Se detaljer".
- **Mobile sizes:** Panel padding, Title and Button sizes are pinned inside `.ph-tool-card`. Otherwise the design-system breakpoints read the real desktop browser width and render desktop sizes inside the phone frame.
- **Not built:** "Faglig ansvarlig" from the expanded design. The data has no such field, and I didn't invent per-tool values. The expanded Beskrivelse still reuses `shortDescription`.

**Alternative considered:** The real ExpanderList (`color="blueberry"`, expanded by default), which would add a collapse chevron the design doesn't have.
**Why:** Direct user request with Figma.

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


## 2026-10-15 — Psykisk helse demo: quiz restarts blank; aborting keeps earlier results
**Decision:** Same change as on `innstillinger` (psykisk-helse): the quiz works on draft answers; "Start quiz" and "Ta quiz på nytt" open a blank form; only completing it replaces the saved answers; Avbryt drops the draft and returns to the earlier results (or the front page if never completed). Demo-specific: "Ta quiz på nytt" no longer clears the "completed" flag, so an aborted rerun also keeps the Forside "Psykisk helse" card (it previously disappeared as soon as a rerun started).
**Alternative considered:** Keeping the flag-clearing on restart (card hidden during any rerun, even an aborted one).
**Why:** User request; flag change agreed so aborting leaves everything as it was.


## 2026-10-16 — Psykisk helse demo: new front-page texts (demo is now the primary prototype)
**Decision:** Same texts as on `innstillinger`: preamble "Det er vanlig å ha det vanskelig i perioder. Det kan være en naturlig reaksjon på det som skjer i livet. … Svar på noen spørsmål og finn noe som passer til din situasjon."; button "Finn verktøy og informasjon som passer for deg" (was "Start quiz"); section "Om quiz" becomes "Om tjenesten Psykisk helse" with the new intro, the list (sove bedre / håndtere stress / få bedre kontroll over følelsene dine) and "Svarene dine sendes ikke til noen og blir ikke lagret." The demo's LinkList (Veiviser til psykisk helsehjelp / Akutt hjelp) is unchanged. From now on, psykiskhelse-demo is the primary Psykisk helse prototype.
**Alternative considered:** —
**Why:** User supplied the texts and asked for them here too.


## 2026-10-20 — Psykisk helse demo: new article card layout
**Decision:** Articles in the results use the Figma layout (Psykisk helse 408:8108, "Artikkelvarianter"): a #DFF9FB card with a 1px #AFDAE3 border (12px/8px padding), a 214px cover photo, the title (title3, 22/1.36), the description (18/1.28), the topic tags, and a borderless "Les artikkel" button with ArrowRight; cards 12px apart inside the grey Artikler section. Replaces the white card with the Publication icon and outline "Gå til artikkel" button. Photos are the Figma frame's placeholders, chosen by topic (people talking → general wellbeing; man in scarf → low mood, anxiety, loneliness; couple walking → stress, sleep, alcohol); the pregnancy photo isn't used. Saved as public/ph-art-*.png.
**Alternative considered:** The previous white article card.
**Why:** User request with the Figma frame.


## 2026-10-20 — Psykisk helse demo: result section headers without the "tab", as H2
**Decision:** The headers of the three result sections (Selvhjelpsverktøy, Artikler, Noen å snakke med) no longer have their darker "tab" bar (#EAE7E7 with a white line under it); they sit directly on the section's grey (#F5F3F3). The heading text uses the H2 style, DS title2 on mobile (SemiBold 1.625rem / 1.938rem, was 18px). The icon stays, vertically centred with the heading.
**Alternative considered:** The tab-style header.
**Why:** Direct user request.


## 2026-10-20 — Psykisk helse demo: quiz back to standard checkboxes
**Decision:** Both quiz steps use the standard DS Checkbox again, one option per row in a list with thin #D6D4D3 dividers (the same as the main Psykisk helse copy), instead of the VisualCheckboxCloud pills (2026-09-22). Answers, the q2 exclusive-option logic and the draft/saved behaviour are unchanged. The old pill CSS (.ph-quiz-cloud--stacked) is left in style.css, unused.
**Alternative considered:** VisualCheckboxCloud pills.
**Why:** Direct user request.


## 2026-10-20 — Psykisk helse demo: results order Verktøy → Noen å snakke med → Artikler
**Decision:** On the results page, Artikler moves to the third section and "Noen å snakke med" to the second (was Verktøy, Artikler, Noen å snakke med).
**Alternative considered:** Articles second.
**Why:** Direct user request.


## 2026-10-20 — Psykisk helse demo: 1rem between result cards and as the section side margin
**Decision:** In all three result sections the cards are 1rem (16px) apart and have 1rem of the section's grey on either side (was 8px sides; articles were 12px apart). Consequence: the two buttons on the "Noen å snakke med" cards ("Åpne chat", "Ring oss") no longer fit on one row and now stack.
**Alternative considered:** The 8px side margin chosen earlier so those buttons would fit side by side.
**Why:** Direct user request.


## 2026-10-20 — Forside demo: "Støtte til din situasjon" as small Tiles
**Decision:** The cards under "Støtte til din situasjon" (Gravid; Psykisk helse once the veiviser is completed) are now the same DS Tile, size and grid as the three under "Tjenester" (Figma Psykisk helse 417:4671): white with a teal border, 48px icon, centred 18px title, three columns. The description line ("Følg svangerskapet ditt uke for uke.") and the hand-rolled card styles are no longer used. Gravid's tile does nothing (no prototype on this branch); Psykisk helse opens the tjeneste. "Psykisk helse" wraps to two lines, so that row is a little taller than the Tjenester row.
**Alternative considered:** The larger hand-rolled cards with icon circle and description.
**Why:** Direct user request.


## 2026-10-20 — Forside demo: Situasjonstjenester between Oversikter and Søknad og refusjon
**Decision:** Under "Se alle tjenester", the Situasjonstjenester group (Psykisk helse, Gravid, Småbarnsliv) now comes right after Oversikter, before Søknad og refusjon (was the last group). Order: Oppfølging i helsetjenesten, Oversikter, Situasjonstjenester, Søknad og refusjon, Kvalitet og styring.
**Alternative considered:** Last in the list.
**Why:** Direct user request.


## 2026-10-20 — Psykisk helse demo: white article cards
**Decision:** The article cards are white (were #DFF9FB from the Figma frame), like the tool and service cards; they keep their #AFDAE3 border, and the result sections stay grey (#F5F3F3).
**Alternative considered:** Light-blue cards (Figma).
**Why:** User request ("Make the psykisk helse blocks white background"; the article cards were the only non-white blocks).


## 2026-10-20 — Psykisk helse demo: article cards use the tool/service card insets and text styles
**Decision:** Article card padding is now 16px 16px 16px 18px, so content sits where it does in the Selvhjelpsverktøy and Noen å snakke med cards (19px from the left edge incl. border, 17px top/right — DS Panel padding plus its status-marker gutter); was 12px 8px. The description uses the same 18px / 1.5 (27px) as those cards (was 1.28). Titles were already the same (title3, 22/29.92). Border stays #AFDAE3 (tool/service cards: #D6D4D3).
**Alternative considered:** The Figma card's 12px/8px padding and 1.28 line height.
**Why:** Direct user request.


## 2026-10-20 — Psykisk helse demo: "Veiviser til psykisk helsehjelp" hidden on the front page (kept in code)
**Decision:** The "Veiviser til psykisk helsehjelp" LinkList row is removed from the Psykisk helse front page; "Akutt hjelp" remains. The row is kept in index.tsx behind `VIS_VEIVISER_LENKE = false` (set to true to bring it back above "Akutt hjelp"), since it will likely be reintroduced. The article page it opened (#artikkel-psykisk-helse) is still reachable from the Forside's "Veiviser til psykisk helsehjelp →" link.
**Alternative considered:** Deleting the row outright.
**Why:** User: remove it from the front page but retain it somewhere.


## 2026-10-20 — Psykisk helse demo: illustrated, colour-coded result section headers
**Decision:** Following Figma Psykisk helse 419:19339 ("MH - Sections"), each result section has its own colour and header instead of the grey box with an icon + H2: Verktøy — blueberry (#E4F7F9, border #AFDAE3) with a 200px illustration area (band in the lower 100px, blueberry blob + "aids" illustration centred); Artikler — cherry (#FFF2EA, border #EEC0A5) with a cherry blob + "learning" illustration; Noen å snakke med — neutral (#F5F3F3, border #D6D4D3) with a 72px band and the DS PeopleTalking icon at 64px. Headings are centred title3 (22/1.36) at the top of the coloured area; "Selvhjelpsverktøy" is now "Verktøy" (Figma wording). Cards keep 1rem spacing and side margins; 32px under the last card. The blobs and illustrations aren't in the design system, so they're SVGs from the Figma file (public/ph-sec-*.svg). Section order unchanged (Verktøy, Noen å snakke med, Artikler; Figma shows Artikler second). Not taken from the frame: its page title "Mental helse" and intro texts.
**Alternative considered:** The grey sections with icon + H2 headers (earlier today).
**Why:** User request with the Figma frame.


## 2026-10-20 — Psykisk helse demo: results order Verktøy → Artikler → Noen å snakke med
**Decision:** Artikler and Noen å snakke med swap places again: the results now show Verktøy, Artikler, Noen å snakke med (as in the Figma sections frame 419:19339). Reverses the order set earlier the same day.
**Alternative considered:** Noen å snakke med second.
**Why:** Direct user request.


## 2026-10-20 — Psykisk helse demo: 1rem more above the Noen å snakke med icon
**Decision:** The neutral section's icon band gets 1rem of extra padding above the PeopleTalking icon (band 88px, icon 24px from the top; was 72px / 8px). Also 1rem extra under its heading "Noen å snakke med" (heading text to first card 28px; the other two sections keep 12px).
**Alternative considered:** The Figma 72px band.
**Why:** Direct user request.


## 2026-10-20 — Psykisk helse demo: a different example photo per article
**Decision:** Article photos are now handed out by position in the list instead of by topic, from five example photos (the three from the Figma article frame plus the two Psykisk helse front-page photos, ph-hero-dark/-warm), so no two articles on the results page share a photo unless more than five are shown. With every quiz option ticked (10 articles) each photo appears twice, five cards apart. The pregnancy photo from the Figma frame is still not used.
**Alternative considered:** Topic-based photos (neighbouring articles often shared one).
**Why:** User: avoid reusing the same photo for multiple articles; they're only example images.


## 2026-10-20 — Psykisk helse demo: cherry-toned Artikler illustration
**Decision:** The Artikler section's "learning" illustration is replaced with the cherry-toned version from Figma 419:18982 (was blue/teal), so it matches the section's cherry colour. Same size and position; band, blob and heading unchanged. (The Figma frame still has a blueberry border on the content area; the prototype keeps the cherry border #EEC0A5.)
**Alternative considered:** The blue/teal illustration.
**Why:** User request with the updated Figma section.


## 2026-10-20 — Psykisk helse demo: cherry outline on article cards
**Decision:** Article cards have a cherry outline (#EEC0A5, the Artikler section's border colour) instead of blueberry #AFDAE3.
**Alternative considered:** Blueberry outline (left over from the Figma card on a blue background).
**Why:** Direct user request.


## 2026-10-20 — Psykisk helse demo: neutral outline on all result cards
**Decision:** All result cards — Verktøy, Artikler and Noen å snakke med — have the neutral #D6D4D3 outline. Only the article cards changed (cherry #EEC0A5 since earlier today); the tool and service cards already had it. Section borders keep their own colours.
**Alternative considered:** A cherry outline on the article cards.
**Why:** Direct user request.


## 2026-10-20 — Psykisk helse demo: "Ta quiz på nytt" → "Endre svarene dine"
**Decision:** The outline button below the results now reads "Endre svarene dine". Behaviour unchanged: the quiz still starts with empty selections, and if it's aborted the previous results are kept.
**Alternative considered:** "Ta quiz på nytt".
**Why:** Direct user request.


## 2026-10-21 — Psykisk helse demo: quiz step 1 and 2 texts
**Decision:** Step 1's subtitle now reads "Gjelder noe av dette for deg?" (was "Gjelder noen av disse for deg?"). Step 2's heading reads "Hva ønsker du å fokusere på?" (dropped "nå"). Its options are short topic labels: Bekymringer og uro (angst), Humør (nedstemthet), Søvn, Stress, Alkohol, rusmidler og tobakk, Pengespilling, Psykisk helse generelt (generell-mestring). Each keeps the tag of the goal-phrased option it replaces, so results scoring is unchanged. "Føle meg mindre ensom eller styrke relasjonene mine" (ensomhet-relasjoner) isn't in the new list, so it's gone. The user's list was lowercase; labels were given a capital first letter.
**Alternative considered:** Goal-phrased options ("Sove bedre", "Håndtere stress på en bedre måte" …).
**Why:** Direct user request.


## 2026-10-21 — Psykisk helse demo: new results ingress
**Decision:** The results page ingress now reads "Basert på svarene dine kan disse verktøyene og artiklene være nyttige for deg. Du velger selv hva du vil bruke. Verktøyene og artiklene er kvalitetssikret av Helsenorge." The typo "Verkøyene" in the requested text was corrected. The old last sentence ("Dine resultater lagres fram til du avslutter tjenesten eller tar veiviseren på nytt.") is gone, and the two identical isEmpty branches collapse into one text.
**Alternative considered:** "…disse ressursene… Du bestemmer selv… Alle ressurser er kvalitetssikret… Dine resultater lagres…".
**Why:** Direct user request.


## 2026-10-21 — Front page: "Situasjonstjenester" → "Støtte til situasjon"
**Decision:** The services group under "Se alle tjenester" (Psykisk helse, Gravid, Småbarnsliv) is now headed "Støtte til situasjon" on every front page: the Psykisk helse demo's Forside, the Frankenstein Forside, and the Gravid onboarding (dhg-onboarding) scenario 1, 3 and 4 front pages. Position unchanged; on the Frankenstein Forside it's still last.
**Alternative considered:** "Situasjonstjenester".
**Why:** Direct user request (applied to all three front pages by choice).


## 2026-10-21 — Psykisk helse demo: photos removed from the front page (kept behind a switch)
**Decision:** The two photos on the Psykisk helse front page are hidden: ph-hero-dark.jpg under the title and ph-hero-warm.jpg above "Om tjenesten". They sit behind `VIS_FORSIDEBILDER = false` in `psykisk-helse-demo/index.tsx`; set it to true to bring them back. The image files and their CSS are untouched. The same two photos are still used as article images on the results page.
**Alternative considered:** Deleting the photos outright.
**Why:** Direct user request, keeping them available in case they're reintroduced.


## 2026-10-21 — Psykisk helse demo: front-page button text; "Artikler" → "Lesestoff"
**Decision:** The front page's main button now reads "Finn verktøy og informasjon tilpasset din situasjon" (was "…som passer for deg"). The results section "Artikler" is now headed "Lesestoff". The request said "Lesestøff", corrected to the standard spelling "Lesestoff". Section colour and illustration (cherry) are unchanged.
**Alternative considered:** Previous texts.
**Why:** Direct user request.


## 2026-10-21 — Psykisk helse demo: "Sliter med angst eller fobier" → "Bekymrer meg mye"
**Decision:** The step 1 option now reads "Bekymrer meg mye". It still carries the `angst` tag, so results are unchanged. This matches step 2's "Bekymringer og uro". The original psykisk-helse prototype keeps the old wording.
**Alternative considered:** "Sliter med angst eller fobier".
**Why:** Direct user request.


## 2026-10-21 — Psykisk helse demo: 3rem less space above Verktøy
**Decision:** The Verktøy section on the results page sits 3rem (48px) higher (`.ph-sec--verktoy { margin-top: -3rem }`). This cancels the page's 48px gap after the ingress, so the section's illustration area starts right below the ingress text. The illustration keeps its own top padding. The spacing between the result sections is unchanged.
**Alternative considered:** 48px gap above every section.
**Why:** Direct user request.


## 2026-10-22 — Psykisk helse demo: "Akutt hjelp" on the front page as a DS Panel
**Decision:** The front page's "Akutt hjelp" is now a design-system outline Panel (Figma node 432:26314; PanelStatic-Text, Outline, no icon), no longer a LinkList row with the EmergencyCall icon. It has the title "Akutt hjelp" (h2, 22px SemiBold), then "116 123" as an underlined SemiBold tel: link, a blank line, and "Ring legevakten på 116 123 ved akutt behov for psykisk helsehjelp. Åpent hele døgnet." (18px/1.5). The hidden Veiviser link (VIS_VEIVISER_LENKE) keeps its own LinkList. The results page's Akutt hjelp row is unchanged. Open question: 116 123 is Mental Helses hjelpetelefon, while legevakt is 116 117; the Figma text pairs "legevakten" with 116 123. Used as given.
**Alternative considered:** The LinkList row.
**Why:** Direct user request (Figma).


## 2026-10-22 — Psykisk helse demo: shareable addresses for the Psykisk helse views
**Decision:** The app shell now opens Psykisk helse for its own view hashes (#forside, #quiz1, #quiz2, #resultater, #avslutt), not just #psykisk-helse-demo. Psykisk helse rewrites the address to those names once open, and before this fix copying or reloading such an address landed on the "Åpne prototype" cover. The root URL still shows the cover, and #forside-demo is still the Helsenorge forside.
**Alternative considered:** Only #psykisk-helse-demo as the deep link.
**Why:** Direct user request (a direct URL to the Psykisk helse front page).


## 2026-10-22 — Psykisk helse demo: "Finn informasjon om psykisk helse" promo above Akutt hjelp
**Decision:** The front page has a DS PromoPanel (blueberry, no illustration; Figma node 432:27541) directly above the Akutt hjelp panel, with 1rem between them. Title: "Finn informasjon om psykisk helse" (h2). Text: "Her finner du informasjon om hva psykisk helse er, hvordan du tar vare på den og hvor du kan få hjelp hvis du eller noen du kjenner har det vanskelig." The design gives no destination yet, so it's a button that does nothing. It isn't an `href="#"` link, because that would rewrite the address to "#" and break reloading.
**Alternative considered:** Linking it to the hidden "Veiviser til psykisk helsehjelp" article.
**Why:** Direct user request (Figma).


## 2026-10-22 — Psykisk helse demo: kommunale tjenester page retitled, ingress added
**Decision:** The page (route #kommunale-tjenester-oslo) is now titled "Helsetjenester kommunen tilbyr", which is also its browser-tab title. It was "Psykisk helse tjenestetilbud i Oslo kommune". A new ingress below the title (18px/1.5) reads: "For å få en helhetlig oversikt over alle helsetjenester Drammen kommune tilbyr, gå til kommunenes nettsider". "kommunenes nettsider" is an underlined link with an ArrowUpRight icon, opening https://www.drammen.kommune.no/ in a new tab (URL chosen by Claude; none was given). The ingress names Drammen while the route and component are still named Oslo. The expander sections are unchanged.
**Alternative considered:** Previous Oslo title with no ingress.
**Why:** Direct user request.


## 2026-10-22 — Psykisk helse demo: kommunale tjenester ingress names Oslo
**Decision:** The ingress now reads "…alle helsetjenester Oslo kommune tilbyr…", and "kommunenes nettsider" links to https://www.oslo.kommune.no/. Drammen was in the original request; Oslo matches the rest of the page.
**Alternative considered:** Drammen.
**Why:** Direct user request.


## 2026-10-22 — Psykisk helse demo: "Konseptskisse" banner removed from the kommunale tjenester page
**Decision:** The yellow "Konseptskisse" banner above the header is gone from "Helsetjenester kommunen tilbyr" (#kommunale-tjenester-oslo). The "Veiviser til psykisk helsehjelp" article page still has its banner.
**Alternative considered:** Keeping the banner.
**Why:** Direct user request.


## 2026-10-22 — Psykisk helse demo: kommunale tjenester page rebuilt from drawing 5a
**Decision:** "Helsetjenester kommunen tilbyr" (#kommunale-tjenester-oslo) now follows drawing 5a in `kommunale-helsetilbud.html`, built with DS components. It replaces the six psychiatric-help expanders.
- **Title and ingress:** kept as set earlier the same day.
- **"Dine kontakter":** Fastlege, Kommunal nettlege and Legevakt as a blueberry `fill` ExpanderList, with icon, title and one-line description. Opening one shows what it helps with, contact lines, links and Fastlege's Bestill time / Skriv melding buttons. Below it is a "Se alle dine helsekontakter →" AnchorLink.
- **"Andre helsetilbud i kommunen":** a VisualRadioCloud with one category at a time (Alle helsetilbud, Barn og familie, Livsstil og aktivitet, Psykisk helse, Rus). Each chip's count is visually hidden for screen readers. Below it is an aria-live "N tilbud" count, then a `line` ExpanderList of the 16 tilbud, each with icon, title, description and DS Tags for its categories. Opened cards show "Hva kan tilbudet hjelpe deg med?", "Dette tilbyr kommunen din" for Psykisk helse, "Slik får du hjelp/tilbud", contact lines, then links (external ones open oslo.kommune.no in a new tab).
- **Content:** all text from the drawing, in `forside-demo/kommunaleHelsetilbud.ts`. Drawing contact details used Drammen, so e-mail domains and post towns were switched to Oslo. Legevakt's phone is 116 117 (the drawing says 116 177).
- **Known deviations from the drawing:** icons are the nearest DS icons; DS Tag is outlined and uppercase where the drawing has plain grey labels; the selected chip shows the DS radio dot, not a check mark.

**Alternative considered:** The previous six expanders about psychiatric help.
**Why:** Direct user request: recreate drawing 5a with Frankenstein components.


## 2026-10-22 — Psykisk helse demo: category chips held at mobile size
**Decision:** The VisualRadioCloud on "Helsetjenester kommunen tilbyr" is pinned to the DS mobile values in `forside-demo/style.css`: 2px/12px gaps, 16px/22px text, pill padding 4px 16px (4px 12px when selected), 44px touch height. Past its own 768px media query the DS switches to 18px text, 48px pills and 24px/16px gaps, which also hit the phone-frame mockup on a wide browser window. Verified identical at 390px and 1280px window width. Same approach as Målinger's VisualCheckboxCloud.
**Alternative considered:** Letting the DS breakpoint apply.
**Why:** Direct user request.


## 2026-10-22 — Psykisk helse demo: 16px text inside opened cards
**Decision:** On "Helsetjenester kommunen tilbyr", all text inside an opened card is 16px/1.5 (was 18px): body, section headings, contact lines, links and the "Dette tilbyr kommunen din" list. This also overrides the DS AnchorLink's 18px default. The card headers themselves are unchanged (title 18px SemiBold, description 16px). The Bestill time / Skriv melding buttons stay at the DS mobile "medium" size (18px, 44px tall), since that is the smallest DS button. They're pinned to it so a wide browser window doesn't grow them to the desktop 20px/50px.
**Alternative considered:** 18px body text.
**Why:** Direct user request.


## 2026-10-22 — Psykisk helse demo: list icons held at mobile size
**Decision:** The icons in "Andre helsetilbud i kommunen" (and, for consistency, "Dine kontakter") are pinned to the DS mobile 38px. The Expander sets its icon to 48px past its desktop breakpoint, both as an attribute and as an inline min-width/height, which also hit the phone-frame mockup on a wide window. Overridden in CSS (`.kt-tilbud` / `.kt-kontakter` `[class*="element-header__icon"] svg`). Verified 38px at both 390px and 1280px window width.
**Alternative considered:** Letting the DS breakpoint apply.
**Why:** Direct user request.


## 2026-10-22 — Psykisk helse demo: "Se alle dine helsekontakter →" arrow centred
**Decision:** The AnchorLink is an inline-flex row (`.kt-arrow-link`, centre-aligned, 4px gap), so the ArrowRight sits on the text's vertical centre and no longer on the baseline. Measured: text and icon centres coincide.
**Alternative considered:** Default inline layout (arrow sat high).
**Why:** Direct user request.


## 2026-10-22 — Psykisk helse demo: kommunale tjenester breadcrumb "Tilbake" → "Psykisk helse"
**Decision:** The breadcrumb on "Helsetjenester kommunen tilbyr" reads "Psykisk helse" and always goes there: to the results if the veiviser is done, else the Psykisk helse front page (`goToTjeneste('psykisk-helse')`). It used to go back to wherever the user came from (`cameFrom`). Opened from a direct link, that meant the Helsenorge forside; from results, the Psykisk helse front page instead of the results. The unused `goBack` is removed; `cameFrom` is still recorded.
**Alternative considered:** "Tilbake" returning to the previous screen.
**Why:** Direct user request.


## 2026-10-22 — Psykisk helse demo: 1rem between the "Dine kontakter" cards
**Decision:** Fastlege, Kommunal nettlege and Legevakt are 1rem (16px) apart, set directly as the list's gap with no item margins. It was already 16px, but as the DS's 8px flex gap plus an 8px margin. Verified at 390px and 1280px, open and closed.
**Alternative considered:** Leaving the 8px + 8px combination.
**Why:** Direct user request.


## 2026-10-22 — Psykisk helse demo: quiz answers as chips (VisualCheckboxCloud)
**Decision:** Steps 1 and 2 show their options as DS VisualCheckboxCloud chips, not stacked Checkboxes. The request named VisualRadioCloud. After a check, the checkbox variant was chosen to keep both steps multi-select, since radio chips allow only one answer and would change the scoring. Each cloud sits in a `role="group"` labelled by the step heading (step 1 also by its "Gjelder noe av dette for deg?" subtitle). Answers, the exclusive-option logic and the results are unchanged. The chips are pinned to DS mobile size in CSS (`.ph-chips`): 16px/22px text, 32px pills, 2px/12px gaps. Verified identical at 390px and 1280px.
**Alternative considered:** VisualRadioCloud (single choice per step); stacked Checkboxes.
**Why:** Direct user request.


## 2026-10-22 — Psykisk helse demo: quiz chips stacked
**Decision:** The step 1 and step 2 chips are stacked one per row (cloud as a left-aligned column), not wrapping side by side. Each chip keeps its own width and the DS mobile size.
**Alternative considered:** Chips wrapping across the row.
**Why:** Direct user request.


## 2026-10-23 — Psykisk helse demo: results link to kommunale tjenester reworded; new page ingress
**Decision:** On the results page, the LinkList item that opens the kommunale tjenester page now reads "Se hvilke helsetilbud kommunen tilbyr", with the subtext "Finn tjenester som kan hjelpe deg med din psykiske helse." It was "Finn kommunale tjenester" / "Psykisk helse tjenestetilbud i din kommune". On "Helsetjenester kommunen tilbyr" the ingress now reads "Du finner en oversikt over helsetilbud i kommunen din på kommunens nettside ↗". "kommunens nettside" is the external link (oslo.kommune.no, new tab), replacing "For å få en helhetlig oversikt … gå til kommunenes nettsider". The equivalent link on the "Veiviser til psykisk helsehjelp" article page is unchanged.
**Alternative considered:** Previous texts.
**Why:** Direct user request.


## 2026-10-23 — Psykisk helse demo: Avslutt tjenesten text shortened
**Decision:** The text on the "Avslutt tjenesten" page now reads "Når du avslutter tjenesten Psykisk helse, slettes dine resultater og alt nullstilles. Du kan når som helst ta tjenesten i bruk igjen." It dropped "starte veiviseren på nytt og".
**Alternative considered:** "…Du kan når som helst starte veiviseren på nytt og ta tjenesten i bruk igjen."
**Why:** Direct user request.


## 2026-10-26 — Psykisk helse demo: kommunale tjenester cards updated from Figma; Smittevern added
**Decision:** Nine tilbud cards follow Figma nodes 438:34904–34912: Svangerskap, Frisklivssentral, Psykisk helse, Helsestasjon for barn, Skolehelsetjenesten, Rus, Helsestasjon for ungdom, Vaksiner og smittevern, and a new Smittevern.
- **Heading:** the first heading reads "Hva kan dette tilbudet hjelpe deg med?". This is applied to every tilbud card for consistency, not just the nine.
- **No municipal specifics:** the Figma cards have none. Psykisk helse's "Dette tilbyr kommunen din" list and contact lines are gone, as are the phone/e-mail/address/opening-hours lines on Frisklivssentral, the two Helsestasjon cards and Vaksiner. The extra external links ("Meld deg på via kommunens skjema", "Meld deg på aktiviteter", "Bestill vaksinetime") are gone too. Each card keeps one "Les mer om …" link.
- **New "Smittevern" card:** placed after Vaksiner og smittevern. It has description "Forebygging og kontroll av smittsomme sykdommer.", the Figma texts, "Les mer om smittevern på Helsenorge", the DS Shield icon and no category tags (shown under "Alle helsetilbud" only, now 17).
- **Typos not carried over:** "smittsome" → "smittsomme", "avhenighet" → "avhengighet".
- **Unchanged:** the other cards (Hjemme, Habilitering, Fysio, Korttid, Demens, Barnekoordinator, Logoped, Læring og mestring) and "Dine kontakter".

**Alternative considered:** Previous drawing-5a content with Oslo contact details.
**Why:** Direct user request (Figma).


## 2026-10-26 — Psykisk helse demo: "Finn informasjon om psykisk helse" promo now links out
**Decision:** The front-page PromoPanel opens https://www.helsenorge.no/psykisk-helse/hva-er-psykisk-helse/ in a new tab (PromoPanel `href` + `target="_blank"`), so the prototype stays open behind it. It replaces the do-nothing button.
**Alternative considered:** Same tab; linking to the prototype's own (hidden) article page.
**Why:** Direct user request (destination supplied).


## 2026-10-26 — Psykisk helse demo: article title is the link
**Decision:** In Lesestoff, each article card's title is now the link: black SemiBold text with a blueberry ArrowRight after the last word, underlined on hover, visible focus ring. It opens the article the same way as before (`openResource`). The borderless "Les artikkel" button at the bottom of the card is removed.
**Alternative considered:** "Les artikkel →" button below the tags.
**Why:** Direct user request.


## 2026-10-27 — Psykisk helse demo: results page uses the front page's Akutt hjelp panel
**Decision:** On the results page, the "Akutt hjelp" LinkList row (EmergencyCall icon, "Ring 116 123 …") is replaced by the same DS outline Panel as the front page: title "Akutt hjelp", the "116 123" tel: link, and "Ring legevakten på 116 123 ved akutt behov for psykisk helsehjelp. Åpent hele døgnet." It sits below the "Se hvilke helsetilbud kommunen tilbyr" link and above "Avslutt tjenesten". Both pages now render one shared `AkuttHjelp` component, so the text can't drift apart. The open question about "legevakten" + 116 123 now applies to both pages.
**Alternative considered:** Keeping the LinkList row on results.
**Why:** Direct user request.


## 2026-10-27 — Psykisk helse demo: article photos to be chosen per article
**Decision:** The user isn't happy with the example photos handed out by position on the article cards. Checked helsenorge.no: none of the nine articles has its own photo (the share image is Helsenorge's generic default; only ABC for god psykisk helse has an illustration), so there's nothing article-specific to reuse. The user chose to keep the photo slot and supply an approved photo per article. Prepared `ARTICLE_IMAGE_BY_ID` in `psykisk-helse-demo/index.tsx`: an entry per article ID (file `public/ph-art-<id>.jpg`) overrides the positional fallback; with no entries yet, nothing visible changes.
**Alternative considered:** Topic icon from the DS on a soft cherry panel; no image at all.
**Why:** Direct user request; option chosen by the user.

#helsenorge
