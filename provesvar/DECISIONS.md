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

#helsenorge
