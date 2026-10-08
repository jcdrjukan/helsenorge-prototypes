# Decisions Log — Prøvesvar

Started 2026-10-08. Records real decisions as they're made — what was chosen, what the alternative was, and why. Oldest entries first.

---

## 2026-10-08 — New static prototype, starting as an empty shell
**Decision:** A new top-level `provesvar/` static HTML folder (same approach as `gravid/` and `dhg-onboarding/`), starting with only the Helsenorge chrome, the title and an ingress. Elements will be added from Figma as needed.
**Alternative considered:** A React view in Frankenstein; forking `prover-og-undersokelser/`; building a results overview / detail view straight away.
**Why:** Direct user request ("option 1", then "empty shell").

## 2026-10-08 — Page header and ingress from the live page's markup
**Decision:** Title, HelpTriggerIcon (xlarge, mobile: 24px icon, 4px margin, help-purple #5C27A1) and the favoritter star sit on one row, followed by the live ingress "Her finner du svar på prøver og undersøkelser, for eksempel blodprøver, røntgen, MR eller CT." PageHeader isn't in the installed design-system package, so the row reuses Gravid's title-row layout; the HelpTriggerIcon follows the package's own styles; the star (standing in for `hn-webcomp-favoritter`) is Gravid's snarvei button. The help trigger doesn't open anything yet.
**Alternative considered:** Keeping the placeholder ingress and a bare title.
**Why:** User supplied the live page's source code for the title and ingress.

## 2026-10-08 — Help trigger removed from the page header
**Decision:** The HelpTriggerIcon next to the title is gone; the title row is now title + favourite star.
**Alternative considered:** Keeping it as in the live page's markup.
**Why:** Direct user request.

## 2026-10-08 — "Velg om du vil få varsel om prøvesvar" help expander under the ingress
**Decision:** Added the live page's HelpExpanderStandalone, rebuilt from the installed design-system styles (HelpTriggerStandalone + standalone HelpDetails, mobile values). It toggles open/closed with ChevronDown/ChevronUp. The opened text is a draft, "Du får ikke automatisk varsel når et prøvesvar er klart. Vil du ha varsel, kan du slå det på i varselinnstillingene dine.", based on the Førstegangsvarsel copy (varsler for prøvesvar now need to be actively switched on).
**Alternative considered:** Leaving the expander's content empty, or lorem ipsum.
**Why:** User supplied the live markup for the trigger; the live markup doesn't include the opened content, so a plausible draft stands in until the real wording is supplied.

## 2026-10-08 — Tabs: Prøvesvar list and Analyseoversikt, from the live markup
**Decision:** Below the help expander: a Spacer (s), then the real Tabs component's white, sticky, full-width variant with "Prøvesvar" and "Analyseoversikt". The Prøvesvar tab has the filter row (FilterButton "Finn ...", result count, FilterSort select) and an outline PanelList of 9 Panels with the live page's test data. Built from the installed design-system styles (Tabs, Spacer, Filter*, Select, PanelList, Panel, PanelTitle, Duolist, borderless Button); the Tabs port reuses gravid/uke-for-uke.html's. The sort select actually re-orders the list (Dato/Område/Rekvirent, asc/desc; default newest first, matching the live order). "Finn ...", "Se resultater" and the Analyseoversikt content are not built yet.
**Alternative considered:** A static, unsortable copy of the list.
**Why:** User supplied the live page's markup and described the two tabs' purposes. Making the sort work costs little and makes the prototype behave as expected when clicked.

## 2026-10-08 — Feedback form and "Personvern for Prøvesvar" link list, from the live markup
**Decision:** After the tabs: Spacer s, the feedback form, Spacer l, title2 "Personvern for Prøvesvar", Spacer m, a LinkList (line, white, medium) with "Logg over bruk" and "Personverninnstillinger", then the existing footer. Spacers, Title, LinkList/ElementHeader and the FormGroup legend use the installed design-system styles. The feedback form's score row isn't in the package, so it's rebuilt from the markup (five 48px plum faces over captions; the chosen one gets a light-purple circle and a bold caption — that selected look is our guess). The live links point to the test environment; here they go to `#`.
**Alternative considered:** Reusing Gravid's hand-built "Personvern for Gravid" link list.
**Why:** User supplied the live markup. The real LinkList styles are available, so they're used instead of Gravid's approximation.

## 2026-10-08 — First detail page (resultat.html) from the live markup
**Decision:** New `resultat.html` for the first result, built from the live markup with the installed design-system styles (Dropdown + SingleSelect, HelpTriggerIcon, Duolist, DictionaryTrigger, HighlightPanel, ExpanderList, borderless left-icon Button, HelpExpanderStandalone). The help trigger is kept next to the title here (per user: "desirable in this context"). Only the first list item links to it so far. Choices of ours: the language picker marks the choice but doesn't translate; the dictionary triggers open an inline help-styled box under the row (a stand-in for the real HelpBubble popover) with draft definitions ("Den som ba om at prøven skulle tas, for eksempel fastlegen din." / "Laboratoriet eller virksomheten som analyserte prøven."); "Tilleggsinformasjon (0)" opens to "Ingen tilleggsinformasjon."; the last title word and the two icons form one non-breaking unit so a long title never leaves the star alone on a line. The eyebrow's own styling isn't in the package; it uses 18px regular text.
**Alternative considered:** A static, non-interactive copy.
**Why:** User supplied the markup for the language picker, eyebrow, header and result content.

## 2026-10-08 — No favourite star on result pages
**Decision:** The favourite (snarvei) star is removed from the result detail pages; the title row there is title + help trigger. The list page (`index.html`) keeps its star.
**Alternative considered:** Keeping the star as in the live markup.
**Why:** Direct user request.

## 2026-10-08 — Detail page is data-driven (?id=N); result 2 added
**Decision:** `resultat.html` now renders its title, eyebrow, Prøvedato/Rekvirert av/Utført av and the "Prøvesvar (n)" undersøkelse blocks from a `RESULTATER` object keyed by `?id=` (matching the list order), instead of one HTML file per result. Result 2 (19.02.2026) uses the supplied results section: S-CRP (with word explanation), "Pasientnær analyse", Laboratorieresultat 21, Måleenhet mg/l (with word explanation). Its "Utført av" ("Evila Øyelegeseter AS") isn't in the supplied markup and follows result 1's pattern; the S-CRP and mg/l explanations are drafts. Word-explanation clicks are handled by delegation so rendered triggers work.
**Alternative considered:** A separate copy of the page per result.
**Why:** User is supplying the results one at a time ("Results section #2"); one template plus data avoids nine near-identical files drifting apart.

## 2026-10-08 — Results 3–9 added; richer data model; reference-range charts
**Decision:** All nine results now have detail pages (`resultat.html?id=1…9`, ids matching the list's records, all linked). The data model moved from one "undersøkelser" list to per-result expanders, each with blocks of [label, value] rows, so the varied live layouts fit: urine dipstick (7 blocks), COVID tests, SARS antigen with Prøvemateriale/Kommentar, cytology/HPV (blocks without a history button, multi-paragraph findings), the 8-analyte blood panel (Referanseområde, avviksmarkør for Us-LH) and urine cultures (Funn, Mengde). Word explanations come from one glossary keyed by term (drafts, ~25 terms). For two-sided reference ranges (FT4, B-Leukocytter, B-Hemoglobin, TSH) the live Highcharts chart is redrawn as a static SVG with the same geometry (band, axis, value dot and bubble, limit labels). Explanation boxes for words inside running text open after the whole text, not mid-sentence.
Assumed (not in the supplied markup): "Utført av" for results 2–9 (the institution from the rekvirent), Cytologi's eyebrow ("Patologi"), the avviksmarkør's styling (plain text under the value), and the content of collapsed expanders other than "Tilleggsinformasjon (0)" (placeholder text).
**Alternative considered:** One static page per result; embedding Highcharts.
**Why:** User supplied the results sections for 3–9. Static SVG keeps the prototype dependency-free and matches the rendered chart.

## 2026-10-08 — Analyseoversikt tab built from the live markup
**Decision:** The second tab now has the live FilterSearch ("Søk i listen"), a Spacer m, and a HorizontalScroll wrapping a sortable Table of 26 analyses (live test data), using the installed design-system styles (FilterSearch, HorizontalScroll incl. edge indicators, Table with blueberry50 sortable head, AnchorLink). Search filters live; headers sort (asc/desc; the arrow follows the live markup's rotate(270) for ascending); each analysis links to the result page with its latest answer. Our choices: the link target (the live markup only has a button), searching across analyse/område/date, an empty-state text, the search icon's position (its rule isn't in the installed package), and a 10.5rem minimum width on the Analyse column so names like "B-Hemoglobin" don't break at the hyphen.
**Alternative considered:** A static, non-interactive table.
**Why:** User supplied the tab's markup.

## 2026-10-08 — Sperre/slette step 1: "Flere valg" menu and Personvernvalg page
**Decision:** Building the vault spec ("Prøvesvar sperre slette spec") in the order it suggests. Step 1: a PopMenu ("Flere valg", VerticalDots) at the right end of the result page's title row (the spec's help text says "øverst til høyre"; the language picker already holds the top-right row) as the only entry point, with "Personvernvalg" as its item; and `personvern.html?id=N` with the spec's §4.4 copy and two plain LinkList rows (title + hint). Shared result data moved into `data.js`. Component mapping for the later steps (agreed in chat): SharingStatus + Lock for the list label, HighlightPanel (neutral, Lock icon) for the blocked banner (NotificationPanel's icon is fixed by variant), NotificationPanel warn/error for the consequence alerts, Modal for unblock, Toast for status messages, Checkbox + Validation for consent. **Consent for deletion uses validation on submit, not a disabled "Slett svaret" button** (user decision).
**Open:** the menu currently holds only Personvernvalg, which makes it more conspicuous than the spec intends; the live page's other secondary actions (print/PDF) should sit above it if they exist [AVKLARES]. No feature flag in the prototype.
**Alternative considered:** a Drawer bottom sheet on mobile; a disabled submit button.
**Why:** User asked to go ahead with step 1 and to use validation.

## 2026-10-08 — Sperre/slette step 2: block and unblock
**Decision:** Built the spec's block flow (§4.5–4.7) and the list label (§4.1) with the agreed component mapping: page with List sections and a warn NotificationPanel; fill "Sperr svaret" with a Loader busy state and double-submit guard; success only after a simulated API call resolves; neutral HighlightPanel + Lock icon as the persistent banner with an outline "Opphev sperring"; Modal for the unblock confirmation (focus trapped, returned to the page title afterwards); Toast (role=status) for "Svaret er sperret for helsepersonell" / "Svaret er synlig for helsepersonell igjen."; SharingStatus (neutral, Lock) under the date in the list — no filter, tab or count. Personvernvalg's first row switches to "Opphev sperring" and opens the unblock dialog on the result page. Block/unblock write log entries ("Du sperret prøvesvaret …", "Du opphevet sperringen av …") for the log page in step 4. Prototype state lives in localStorage; `index.html?nullstill=1` resets it. The [AVKLARES] about akuttilgang is kept as a comment next to the warning text.
**Alternative considered:** NotificationPanel for the banner (can't carry the lock icon); a separate confirmation page for unblocking (spec asks for something lighter).
**Why:** User approved step 2. A toast bug found while testing (the toast collapsed to zero height in its sticky holder) was fixed before committing.

## 2026-10-08 — No Toast: success is confirmed with an inline NotificationPanel
**Decision:** Removed the Toast. Successful operations are now confirmed with a NotificationPanel, success variant (kiwi50 / kiwi900 border, CheckFill), placed in the page flow under the page header, dismissable with ✕ and not on a timer. Focus moves to it (role="status", tabindex="-1") so it's announced after the page change; closing it returns focus to the page title. Used for "Svaret er sperret for helsepersonell." (after blocking) and "Svaret er synlig for helsepersonell igjen." (after unblocking, in the spot the banner left). The same pattern will be used for the deletion message on the list in step 3.
**Alternative considered:** Keeping Toast; announcing via an aria-live region only (unreliable after a full page change, and invisible if missed).
**Why:** User: Toast may no longer be used, on accessibility grounds.

## 2026-10-08 — Sperre/slette step 3: delete with consent, receipt, list update
**Decision:** Built §4.8–4.10. Consent uses **validation on submit** (agreed): "Slett svaret" (destructive Button) stays enabled; submitting without the box ticked shows the design system's ErrorWrapper with "Du må krysse av for at du har lest informasjonen og forstår at svaret slettes for godt.", marks the Checkbox invalid (aria-invalid, aria-describedby) and moves focus to it; ticking clears the error. Success: busy Loader, simulated API, then the receipt page with focus on its heading; the list hides the result in both tabs (in Analyseoversikt, every row linking to that result) and shows the success NotificationPanel (the no-Toast pattern) "**{navn}** ({dato}) er slettet fra Helsenorge.". "Vil du heller sperre svaret?" offers blocking first (principle 4) and is hidden when the result is already blocked. Deleting a blocked result removes the block too (one reading of open question 7). The receipt names the ordering institution as the last part of "Rekvirert av". [AVKLARES] comments for restoring a deleted result and for any permanent trace in the list (§4.10) are left in place. Programmatically focused headings get no focus ring.
**Alternative considered:** a disabled "Slett svaret" until the box is ticked.
**Why:** User approved step 3 and chose validation. A bug found in testing (the institution helper read a non-existent field, which stopped the receipt script and the list message) was fixed before committing.

## 2026-10-08 — Consent: "Slett svaret" disabled until the box is ticked (replaces validation on submit)
**Decision:** The destructive "Slett svaret" button is disabled until the consent checkbox is ticked, and disabled again if it's unticked, using the design system's disabled Button (neutral200 fill, 2px dashed neutral700 inset outline, neutral800 text). The ErrorWrapper validation message is removed. Supersedes the earlier "validation on submit" choice (step 1 and step 3 entries).
**Alternative considered:** Validation on submit (the previous choice: enabled button, error message and focus on the checkbox).
**Why:** User changed their mind: better if the button is disabled until the box is checked. The spec allowed either.

## 2026-10-08 — Sperre/slette step 4: error page, usage log, demo panel
**Decision:** Completed the spec's build order. (1) The simulated API can fail: when switched on, block, unblock and delete go to the §4.11 error page with per-action text adapted to the actual state (e.g. a failed delete of a blocked result says it's still blocked), "Prøv igjen" back to the action and "Tilbake til svaret"; nothing is changed or logged. The spec's "[telefonnummer]" is filled with Veiledning Helsenorge's 23 32 70 00 (already in the footer). (2) `logg.html` shows the usage-log entries in the same plain words as the UI (spec §5), filtered to Pasientens prøvesvar, with an empty state; the list page's "Logg over bruk" link and the receipt now go there. (3) `demo.html`, a control panel outside the patient-facing pages, shows status per result, toggles the API error simulation and resets everything — so testers don't need URL parameters.
**Alternative considered:** URL parameters only for error simulation and reset; demo controls inside the patient pages.
**Why:** User approved step 4. Keeping demo controls off the service pages respects the spec's "discreet by design" principle.

#helsenorge
