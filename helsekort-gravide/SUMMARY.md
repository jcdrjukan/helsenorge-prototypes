# Helsekort for gravide

Static HTML prototype work for Helsenorge's digital antenatal health record ("Helsekort for gravide"). Two files in this repo are different views of the **same** project, not separate prototypes:

## Patient view — `gravid/index.html` ("Gravid")
Weekly pregnancy-tracking page for the expectant user themselves:
- Header showing current week (e.g. "Gravid uke 30").
- Progress ring: "Dager igjen" + termindato, with both a confirmed (jordmor/lege-verified) and a mother-editable (unconfirmed) state — toggle via `setTermindatoConfirmed(true|false)`. Remaining/not-yet-elapsed track is a thin grey line, not a thick pastel ring.
- A snarvei (favorite) star after the title, persisted via localStorage. Uses `#08667C` (blueberry-700) — see DECISIONS.md for why that's "green" here.
- "Mål av magen" (belly measurement) tracker.
- Weekly article section (sourced from a specific Figma design, node 26:598), with the real MeasuringTape design-system icon next to the size/weight caption.
- "Papirhelsekortet og dokumentasjon" (paper health record / documentation) links.
- "Huskelapper" (reminders/notes) and a "Personvern for Gravid" (privacy) section.
- Header/breadcrumb matches every other Helsenorge prototype: white profile bar (not tinted), "Forside" breadcrumb + divider beneath it.
- Uses the shared Helsenorge design-system CSS token set (palette, spacing), same approach as `behandlingshjelpemidler`.
- File was renamed from `gravid-app.html` to `index.html` so Netlify would serve it as the site root (`c358632`); deployed at its own Netlify site (`helsenorge-gravid` — as of 2026-09-22 the only Netlify site for this view; a stale duplicate site, `helsekortforgravide`, was deleted).

### Sub-page — `gravid/uke-for-uke.html` (added 2026-09-22)
Reached via "Les mer om hva som skjer i uke X", driven by a `?uke=NN` query param (Figma nodes 43:483–485). Three tabs:
- **Barn** — unique content per exact week (`BARN_CONTENT`, keyed 1–42).
- **Mor** / **Svangerskapskontroll** — content repeats across week *ranges* instead of per week, so these are keyed by `{from, to}` range objects (`MOR_CONTENT` / `KONTROLL_CONTENT`), not by single week numbers.

Only week 30 is seeded so far (transcribed from Figma as a working example, not final copy). Real content for the rest of weeks 1–42 is being filled in via CSV templates at `content-templates/gravid/` (outside the deployed `gravid/` folder, so it never ships) — see that folder's README for the exact column layout per tab.

## Clinical/record view — `helsekort-gravide/helsekort-gravide.html`
Full tabbed antenatal record: Personalia → Medisinsk bakgrunn (nationality/language, heart & circulation, endocrinology, psychiatric health, other conditions) → Tidligere svangerskap → Nåværende svangerskap (progression vs. due date) → Svangerskapskontroller (checkups, latest blood pressure) → Blodprøver & lab → Ultralyd → Fødsel (contractions/opening phase, perineum) → Barselperiode.
- Own visual style (dark blue `--blue: #003057` header/tab bar, Helvetica Neue) — does **not** use the shared design-system tokens; don't copy its CSS into other projects by default.
- Sticky header with a print button — meant to be reviewed/printed as a document, not navigated as an app shell.
- Only one commit in history (`66b57e6 reorganize into per-project subdirectories`) — moved here from elsewhere in the repo, not built in place.

## Notes
- These two files were previously documented as separate/unrelated prototypes; they're actually two views of the same Helsekort for gravide effort (patient-facing screen vs. full clinical record), per direct correction from the user (2026-07-14).
- The two files still don't share any code or styling — if that ever needs to change, log it as a real decision in this project's `DECISIONS.md`, don't assume convergence.

#helsenorge
