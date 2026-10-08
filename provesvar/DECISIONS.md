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

#helsenorge
