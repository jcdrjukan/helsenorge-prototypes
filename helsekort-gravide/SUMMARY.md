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

The tabs are a static HTML/CSS/JS translation of the actual `@helsenorge/designsystem-react` Tabs/TabList/TabPanel component (same classnames, DOM shape, and mobile-width CSS values as the component's own source) rather than a hand-rolled underline bar — see DECISIONS.md, this was a direct user request over the earlier Figma-eyeballed version. Below the tab content: a week-navigation row (← Uke X / Uke Y →, real ArrowLeft/ArrowRight icons) that carries the currently-open tab along, and the same black footer as `index.html`/`avslutt.html` — this page was the one missing it.

### Dashboard — `gravid/dashboard.html` (added 2026-09-22)
A prototype control panel, not part of the patient-facing flow — deliberately skips the Helsenorge header/footer chrome. Lets you pick the svangerskapsuke (1–42) and whether the user "Har digitalt helsekort for gravide" (the service is usable without being connected to a jordmor/lege in the ordning — relevant for partners/pårørende, or before one's own provider joins). Without a connection there's no one to confirm the termindato via ultrasound, so that sub-toggle hides and the ring is forced into the unconfirmed/editable state regardless of its last saved value.

"Åpne prototypen" launches `index.html` with the chosen state via query params (`?uke=&tilknyttet=&termindato=`); `index.html`/`uke-for-uke.html` fall back to whatever was last saved to localStorage when opened without those params, so a chosen scenario persists across ordinary navigation too. See DECISIONS.md — this replaces the earlier pattern of hand-editing hardcoded init calls (`updateWeek(30)`, `setTermindatoConfirmed(true)`) per scenario. More parameters are expected (the user's described this as a "grand vision" still being fleshed out) — e.g. whether "Kartlegging for første svangerskapskontroll" has been submitted.

**Known bug, surfaced by testing the dashboard's disconnected state, not yet fixed:** at some weeks (e.g. uke 25) the unconfirmed-termindato block visually overlaps the week bubble — its "date + pencil" inline layout is wider than the confirmed state's two stacked lines, and collides at some bubble angles. Needs a layout decision (e.g. stacking date/pencil vertically), not a quick fix.

## Clinical/record view — `helsekort-gravide/helsekort-gravide.html`
Full tabbed antenatal record: Personalia → Medisinsk bakgrunn (nationality/language, heart & circulation, endocrinology, psychiatric health, other conditions) → Tidligere svangerskap → Nåværende svangerskap (progression vs. due date) → Svangerskapskontroller (checkups, latest blood pressure) → Blodprøver & lab → Ultralyd → Fødsel (contractions/opening phase, perineum) → Barselperiode.
- Own visual style (dark blue `--blue: #003057` header/tab bar, Helvetica Neue) — does **not** use the shared design-system tokens; don't copy its CSS into other projects by default.
- Sticky header with a print button — meant to be reviewed/printed as a document, not navigated as an app shell.
- Only one commit in history (`66b57e6 reorganize into per-project subdirectories`) — moved here from elsewhere in the repo, not built in place.

## Notes
- These two files were previously documented as separate/unrelated prototypes; they're actually two views of the same Helsekort for gravide effort (patient-facing screen vs. full clinical record), per direct correction from the user (2026-07-14).
- The two files still don't share any code or styling — if that ever needs to change, log it as a real decision in this project's `DECISIONS.md`, don't assume convergence.

#helsenorge
