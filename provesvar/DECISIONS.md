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

## 2026-10-08 — Blocked results in the list use the StatusDot, above the title
**Decision:** The "Sperret for helsepersonell" marker in the list is now the design system's StatusDot v3 from Figma (CLD - Prøvesvar, node 1:496): the DotNoEye icon (exported asset, 24px clipped to a 16px frame) and the text in Mobile/Sublabel (subdued), 16px Source Sans 3 #474745. It sits above the panel's title (the result type) instead of under the date. Replaces the SharingStatus + Lock label.
**Alternative considered:** SharingStatus with a Lock icon (the earlier mapping).
**Why:** Direct user request with Figma.

## 2026-10-08 — Analysis page (analyse.html) from the live markup
**Decision:** New `analyse.html?a=N`, opened from each Analyseoversikt row (previously the rows opened the latest result). Built from the live U-Bakterier dyrkning markup with design-system styles: page header with eyebrow, ingress (the analysis' word explanation + source AnchorLink with the external-link icon), title3 sections "Prøvemateriale" and "Antall prøvesvar", and a compact Table (neutral head; mobile compact sizes) of earlier answers with dates linking to their results. Analyses and their answer history moved into `data.js` so the overview table and the analysis page share them; answers from deleted results are left out of both. The breadcrumb returns to the list with Analyseoversikt open (`?fane=analyse`, new). Our choices: no favourite star (consistent with the result pages, although the live markup has one); Prøvemateriale only where the prototype data knows it; for analyses other than U-Bakterier dyrkning the explanation is the draft glossary text with no source, or none; the analysis rows repeat the live data's quirks (CRP counts the S-CRP answer; HPV rows split per date). Also: `?nullstill=1` now keeps other URL parameters.
**Alternative considered:** Keeping the rows linked to the latest result.
**Why:** User supplied the analysis page markup.

## 2026-10-08 — Word explanations open in a popover, not inside the text
**Decision:** Replaced the in-page explanation boxes with the live behaviour, reconstructed from the supplied markup: the DictionaryTrigger (aria-haspopup="dialog", aria-expanded) opens a PopOver (role="group", aria-label="Hjelpetekst"; white, 1px border-onlight edge, 9px radius, drop shadow, 16px padding, arrow pointing at the word) containing a HelpBubble (18px/28px text, small plum Close in the corner). One popover per page, positioned inside the phone screen under the word, or above it when there's no room below, kept within the screen edges; focus moves to it; Esc, ✕ or a click outside closes it and returns focus to the word; another trigger switches it. Shared in `data.js` and `sperring.css`, driven by `data-ord`. "Utført av:" now uses the live explanation ("Den som tar prøven eller utfører undersøkelsen. …").
**Alternative considered:** The previous inline boxes (under the row, then after the text block).
**Why:** User: the inline approach was "severely broken"; descriptions should show in a pop-up layer, as on the live page.

#helsenorge

## 2026-10-08 — Personvernvalg choices use the boxed LinkList from Figma
**Decision:** The two choices on Personvernvalg ("Sperr svaret for helsepersonell", "Slett svaret fra Helsenorge") now follow the "Sperr Slett" LinkList in CLD - Prøvesvar (Figma 3:4504): 1px #7D7C79 outer border; each row a white element in an 8px #EAE7E7 frame (frames overlap), a line under the header, SemiBold 18/1.2 title, 16/1.2 #474745 hint, teal (#188097) chevron. Implemented as a `link-list--boxed` modifier on this list only; the "Se logg over bruk" list keeps the plain line style. The header's 8px vertical padding is dropped so the rows come out at the Figma instance's height (118px).
**Alternative considered:** The plain line-variant LinkList used until now.
**Why:** User supplied the Figma element and asked for the prototype to match.

## 2026-10-08 — Personvernvalg choices restyled as separate grey cards
**Decision:** Replaces the boxed style above. Following the updated LinkList in the Figma Personvernvalg frame (4:7 → instance 5:111): each choice is its own card, 8px apart, #F5F3F3 background with a 1px #7D7C79 border; no outer frame, no grey 8px frame and no line under the header; the header keeps its 8px top/bottom padding. Title, hint and teal chevron unchanged. Hover/active step to #EAE7E7/#D6D4D3 (our choice; Figma shows only the default state).
**Alternative considered:** The white-in-grey-frame style from the previous entry.
**Why:** User updated the LinkList style in Figma and asked for the prototype to match.

## 2026-10-09 — Working language picker on the list page too
**Decision:** The placeholder Språk/Language button (index.html; the other pages already had it inline. The same files went to gravid/ and dhg-onboarding/) is replaced by the working language picker from the Prøvesvar prototype: Dropdown toggle (teal globe + chevron) that opens a SingleSelect list (Bokmål, Nynorsk, English); choosing marks the language and announces "Språk endret til …" (page text doesn't change); Esc or a click outside closes it. Shared as `sprakvelger.css` + `sprakvelger.js` in the folder, filling a `data-sprakvelger` container.
**Alternative considered:** Keeping the inert placeholder.
**Why:** Direct user request: swap the openable picker in wherever the language selector was only a placeholder.

## 2026-10-09 — "Velg om du vil få varsel om prøvesvar": live help text
**Decision:** The HelpExpander (list page and result pages) now has the live text: "Du får ikke varsler automatisk når et prøvesvar er klart. Hvis du vil ha varsler, må du endre innstillingene dine." + "Gå til Tilpass varsler." (AnchorLink). The link points to `#`: the live target is the test environment's varselinnstillinger, which the prototype doesn't have.
**Alternative considered:** The earlier draft text ("… kan du slå det på i varselinnstillingene dine").
**Why:** User supplied the live markup.

## 2026-10-09 — Eyebrow aligned to the design system
**Decision:** The eyebrow above the title (`pageheader__subtitle`, result and analysis pages) now follows the design system's EyebrowHeader.Subtitle: a paragraph with margin 0 in the DS body style, mobile 18px / 1.688rem (27px). It was 18px / 1.75rem (28px), with no traceable source. The DS step to 20px / 1.875rem at md (768px+) is left out, because it keys off the window width, which on desktop is wider than the phone frame.
**Alternative considered:** Keeping 18/28; including the md step.
**Why:** User asked whether the eyebrow followed a defined Frankenstein style; it didn't exactly, and they asked to align it.

## 2026-10-09 — Personvernvalg breadcrumb: "Tilbake til prøvesvaret"
**Decision:** The back link on the Personvernvalg page reads "Tilbake til prøvesvaret" (was "Prøvesvaret"). Only this page: the steps keep "Personvernvalg", the error page "Prøvesvaret" and the receipt "Prøvesvar".
**Alternative considered:** The bare destination name, as on the other pages.
**Why:** Direct user request.

## 2026-10-09 — "Sperret for helsepersonell" panel uses DotNoEye, not Lock
**Decision:** The icon in the blocked-result HighlightPanel (with "Opphev sperring") is now the design system's DotNoEye (48px, black), replacing Lock. It matches the StatusDot on blocked results in the list.
**Alternative considered:** Lock.
**Why:** Direct user request.

## 2026-10-09 — No success message after blocking; focus goes to the panel
**Decision:** After "Sperr svaret" the result page no longer shows the success NotificationPanel "Svaret er sperret for helsepersonell.". The "Sperret for helsepersonell" HighlightPanel, which states the date ("Du sperret svaret …") and offers "Opphev sperring", is the confirmation; its heading takes focus on arrival so screen readers announce it. Unblocking keeps its success message ("Svaret er synlig for helsepersonell igjen."), since the panel disappears and nothing else confirms it. This departs from the sperre/slette spec, which asks for a success message after blocking.
**Alternative considered:** Keeping both, as in the spec.
**Why:** User: the message isn't needed while the panel is shown; the two said the same thing stacked on top of each other.

## 2026-10-09 — Personvernvalg: new intro text; result name on two lines under the title
**Decision:** Following the Figma Personvernvalg frame (4:7): the intro is one paragraph, "Dersom du ønsker det kan du begrense helsepersonells innsyn i utvalgte prøvesvar. Du må imidlertid være klar over at dette kan føre til at du må ta prøver på nytt, og kan påvirke helsepersonells evne til å gi deg best mulig helsehjelp." (Figma text with two typos fixed at the user's request: "til å" → "til at", missing final full stop), replacing the two "De fleste trenger ikke …" / "Du har likevel rett …" paragraphs. The text under the title is now area and test date on two lines ("Medisinsk biokjemi" / "Prøvedato 18.03.2026"), 16px / 1.2, black, 8px below the title; previously one line at body size joined by "·". The same subtitle style is used on the Sperr and Slett pages.
**Alternative considered:** The previous texts and one-line subtitle.
**Why:** User updated the texts and subtitle styling in Figma and asked for Sperr/Slett to follow.

## 2026-10-09 — Receipt after deleting: new title and body text
**Decision:** Title "Svaret er slettet" (was "Svaret er slettet fra Helsenorge"). Body: "Prøvesvaret er permanent fjernet fra den nasjonale prøvesvar-tjenesten og Helsenorge. Det er fortsatt lagret i journalen hos <ordering organisation> og hos laboratoriet." The organisation stays drawn from each result's data (result 1: "WebMed Test HelseNorge -TREG VOKAL KATT SKORPION", as in the user's text).
**Alternative considered:** The previous wording ("Svaret er fjernet fra Pasientens prøvesvar. …").
**Why:** User supplied the new texts.
