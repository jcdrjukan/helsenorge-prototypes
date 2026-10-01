# Helsekort for gravide

Static HTML prototype work for Helsenorge's digital antenatal health record ("Helsekort for gravide"). Two files in this repo are different views of the **same** project, not separate prototypes:

## Patient view — `gravid/index.html` ("Gravid")
Weekly pregnancy-tracking page for the expectant user themselves:
- Header showing current week (e.g. "Gravid uke 30").
- Progress ring: "Dager igjen" + termindato, with both a confirmed (jordmor/lege-verified) and a mother-editable (unconfirmed) state — toggle via `setTermindatoConfirmed(true|false)`. Remaining/not-yet-elapsed track is a thin grey line, not a thick pastel ring.
- A snarvei (favorite) star after the title, persisted via localStorage. Uses `#08667C` (blueberry-700) — see DECISIONS.md for why that's "green" here.
- "Mål av magen" (belly measurement) tracker — a percentile-band growth chart (solid band fill + white median curve, y-axis 15–45cm) with the mother's own tracked measurements overlaid as a separate teal line/dots, restyled 2026-09-24 to match a real production reference (previously used gridlines + dashed bound lines, which the real version doesn't have). The real chart is Highcharts-driven, so its exact underlying curve data isn't recoverable from CSS alone — this is a hand-approximation from a screenshot, about as close as static markup can get without the chart's actual config. Only shown for users with a DHG connection, and blank before uke 24 (first measurement isn't taken until then).
- "Nyttig å vite i denne perioden" panel (added 2026-09-24): cherry/peach background, three article links (vitamins/minerals, food to avoid, snus/smoking), "Se alle artikler og verktøy" — built to house the Stork illustration (see below), not present before this session. Its illustration overlaps the panel's top edge (background starts halfway up the illustration, not nested inside it) — see DECISIONS.md, this exact effect was only reproducible after the user provided real production markup.
- "Huskelapper" now has the Thinking illustration above its heading (added 2026-09-24).
- Both illustrations (Stork, Thinking) are real assets from the Figma "✏️ F Illustrations" library (same library as the weekly fetal illustrations), saved to `gravid/img/illustrasjoner/`.
- Help triggers ("Hvorfor måles magen?", "Hvem kan se huskelappene mine?") are now a contextual trigger-text row beneath each section heading, not an icon button beside it — see DECISIONS.md. Help copy itself is a placeholder pending real wording.
- Right-pointing CTA arrows are unified to 38px (confirmed exact from real markup, see DECISIONS.md) across every plain-link arrow on the page.
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

### Entrance/onboarding page — `gravid/aktiver-helsekort.html` (added 2026-09-23; see also the next section)
A mobile port of the real "Bruk tjenesten Gravid og digitalt helsekort" editorial page (`helsenorge.no/gravid/tjeneste-for-gravide/`), with content adapted for a described future state: once digitalt helsekort for gravide is folded into Kjernejournal, the legal "samtykke" requirement falls away, so this page's copy was rewritten from consent-transaction framing to one-step "aktivering," keeping an opt-out/reservasjon safety net — flagged in its own code comments as a first-draft interpretation for review, not finalized text. Its two CTAs simulate the onboarding outcomes: activating links to `index.html?tilknyttet=1&termindato=1&panelHelsekort=0`, declining links to `index.html?tilknyttet=0`.

### Entrance/onboarding pages — `gravid/aktiver-helsekort.html` + `aktiver-helsekort-oppdaget.html`
Since the DHG onboarding work (see `dhg-onboarding/SUMMARY.md`) these two pages are the activation landing pages for all onboarding scenarios:
- **`aktiver-helsekort.html`** serves DHG onboarding S1 (`kilde=epj`), S2 (`booking`) and S4 (`melding`, or no `kilde` = the provider URL). `?kilde=` drives a real NotificationPanel (info) banner and the breadcrumb. S4 shows "Jordmor eller fastlegen din har gitt deg tilbud om å bruke digitalt helsekort. Ta i bruk digitalt helsekort og del opplysninger med din fastlege eller jordmor før første svangerskapskontroll."
- **`aktiver-helsekort-oppdaget.html`** serves the three S3 discovery variants (`frontpage`/`sok`/`redaksjonelt`). Its "Bruk Gravid uten digitalt helsekort" opt-out section was removed on 2026-09-30, so no activation page has it now. "Bruk tjenesten Gravid og digitalt helsekort" opens the **"Er du gravid selv?" modal** (Figma 56:27891): "Mitt eget svangerskap" → activated Gravid page; "Noen andres svangerskap" → Gravid without digitalt helsekort.
- Every onboarding path lands in Gravid with no uploaded document (`dokumenter=0`). Every path except S1 also lands with no termindato registered (`termindato=none`). S1 lands at uke 6 with a confirmed (locked) termindato and the "Del opplysninger" panel, and the paths without DHG also hide the "Del opplysninger" panel.

### Termindato pages — `gravid/beregn-termindato.html` + `registrer-termindato.html` (added 2026-09-29)
From Figma 53:27367 / 53:27371 (flat screenshots; components rebuilt from the design-system source: Label, Input/DatePicker, fill/outline Button, HelpTrigger).
- **Beregn termindato:** first day of last menstruation + **283 days**. Opened from "Beregn termindato" in the ring's no-termindato state.
- **Registrer termindato:** manual entry. Also used when editing an existing termindato (the date/pencil in the ring), pre-filled.
- Both carry the Gravid page's URL state through and return `termindato=0&termindatoDato=YYYY-MM-DD`. The ring then shows the real date, days left and "uke W dag D" (elapsed = 283 − days left).
- Help-expander texts are placeholders, and the error messages aren't from Figma.

### Svangerskapsjournal — `gravid/svangerskapsjournal.html` (added 2026-09-30)
Rebuilt from the real page's rendered markup: "Lagre til Dokumenter" (outline Button, not wired), "Sist oppdatert", then an **ExpanderHierarchy** of ten sections in the real order. Om deg, Oppfølging i svangerskapet, Helseutfordringer/sykdom, Ditt svangerskap, Levevaner and Legemidler have data (Duolist, title4, DictionaryTrigger "ordforklaring" with a help bubble). Tidligere svangerskap, Svangerskapskontroller, Andre prøvesvar and Mål av magen show the real dashed EmptyState ("Det er foreløpig ikke registrert opplysninger."). The data is plausible data for the prototype user Tora Hansen (fastlege Knut Andersen, Ekeberg legekontor), not the real test account's. "Termin" follows the Gravid page's termindato state. **Placeholders:** the ingress and the ordforklaring texts.

### Siste prøver og målinger — `gravid/prover-og-malinger.html` (added 2026-09-30)
Rebuilt from real markup: PageHeader (title1, snarvei star, the real ingress) and an **ExpanderList** (line/white, ElementHeader rows). It lists only categories that have results; currently just "Andre prøvesvar". **Placeholder:** that section's expanded content (typical first-kontroll blood tests), because the capture was collapsed. It also contradicts the journal's empty "Andre prøvesvar"; to be reconciled when the real expanded markup arrives.

Both pages are linked from the front page's quick links ("Se hele svangerskapsjournal", "Siste prøver og målinger"). Those links are hidden without digitalt helsekort (`tilknyttet=0`), together with "Mål av magen".

### Kartlegging før første svangerskapskontroll — `gravid/kartlegging.html` (added 2026-09-30)
Rebuilt from the real Skjemautfyller page's rendered markup: 23 questions in 8 sections (Personopplysningar, Svangerskap, Levevanar, Kosttilskot og medisinar, Sjukdommar og tilstandar, Arbeidssituasjon, Anna, Urinprøve), verbatim nynorsk with real options, tags, help triggers, a 250-character textarea, kg/cm fields and full country/language dropdowns.
- **Styled by Helsenorge's own CSS:** the real Skjemautfyller stylesheets (downloaded from static.hn.test.nhn.no into `gravid/css/skjema/`). A generator (`.playwright-mcp/build_kartlegging.py`) emits the same DOM and hashed class names as the capture. The downloaded CSS has its `@font-face` rules and wider-screen `@media (min-width)` blocks removed, so the real mobile styles always apply in the phone frame. Re-download to update; don't edit by hand.
- **Flow:** opened from "Fortsett utfylling" in the front page's "Del opplysninger" panel. "Gå vidare" opens the **"Sendt" success modal** (Figma 66:28297; green success variant over a 50% grey mask). OK, X, Esc or a click on the mask then returns to Gravid with `panelHelsekort=0&kartlegging=sendt` (panel gone). "Lagre" shows a toast. "Avbryt" and the breadcrumb return unchanged.
- **Placeholders:** help texts and the "Slik tar du en urinprøve" content. Conditional follow-up questions (if any) aren't included, because only the untouched form was captured.

### URL state (`index.html` and the pages that carry it)
| Param | Values | Effect |
|---|---|---|
| `uke` | 1–42 | Current week (default 30, or last dashboard choice) |
| `tilknyttet` | 1 / 0 | Has digitalt helsekort. 0 hides Mål av magen and the journal/prøver links |
| `termindato` | 1 / 0 / none | Confirmed / editable (mother's own) / not registered ("Termindato ikke registrert" + "Beregn termindato", no week bubble). `none` is honored with or without a connection |
| `termindatoDato` | YYYY-MM-DD | A registered termindato (from the termindato pages); overrides `uke` |
| `panelHelsekort` | 1 / 0 | "Del opplysninger før første svangerskapskontroll" (info NotificationPanel, not dismissable, "Påminn meg om en uke" toggle, "Fortsett utfylling" primary button) |
| `panelFarskap` | 1 / 0 | "Registrer farskap hos Nav" (info NotificationPanel, only from uke 22) |
| `dokumenter` | 0 | Hides the uploaded-document block (reference design shown by default) |
| `kilde` | epj/booking/melding/frontpage/sok/redaksjonelt | DHG onboarding origin (breadcrumbs, banners) |
| `kartlegging` | sendt | Set by the Kartlegging form's "Gå vidare" (with `panelHelsekort=0`); informational, nothing reads it yet |

`dashboard.html` sets most of these, including a "Har lastet opp papirhelsekort" checkbox for `dokumenter`.

### Other front-page changes since 2026-09-25
- **No-termindato state:** "Termindato / ikke registrert" (20px regular) above the real Frankenstein mobile fill Button, whose label wraps onto two lines ("Beregn / termindato").
- **"Del opplysninger" panel:** the same NotificationPanel as the farskap panel, variant **info**, not dismissable. Below the body text is a real Toggle, "Påminn meg om en uke"; when on, its sublabel reads "Påminnelse sendes <today + 7 days>" (not saved across reloads). Then a primary button "Fortsett utfylling →" (ArrowRight after the text) with 1rem of space below it.
- **Mål av magen:** the chart is a 1:1 rebuild of the real Highcharts output (no visible title, "Visualisering av magemål over tid" kept as the aria-label; cm/uke axis titles, real band/median paths, plain white). Her own measurements are drawn in its coordinate system, and there is no "–" placeholder when there's no measurement yet.
- **Breadcrumb row:** identical on every Gravid page (46px, 4px indent, #D6D4D3 divider inset 1rem), matched to the front page on 2026-09-30.

### Phone-frame mockup (added 2026-09-24)
`index.html`, `avslutt.html`, `uke-for-uke.html`, `aktiver-helsekort.html` and every page added since (termindato, journal, prøver pages) are wrapped in the same phone-bezel graphic used in the Frankenstein React app (ported from `frankenstein/src/App.css`) — a desktop browser sees a realistic phone frame around the content; a real phone viewport (≤480px) sees it collapse to nothing, unchanged from before. `dashboard.html` deliberately excluded — it's the chrome-less control panel, not part of the simulated device experience.

## Clinical/record view — `helsekort-gravide/helsekort-gravide.html`
Full tabbed antenatal record: Personalia → Medisinsk bakgrunn (nationality/language, heart & circulation, endocrinology, psychiatric health, other conditions) → Tidligere svangerskap → Nåværende svangerskap (progression vs. due date) → Svangerskapskontroller (checkups, latest blood pressure) → Blodprøver & lab → Ultralyd → Fødsel (contractions/opening phase, perineum) → Barselperiode.
- Own visual style (dark blue `--blue: #003057` header/tab bar, Helvetica Neue) — does **not** use the shared design-system tokens; don't copy its CSS into other projects by default.
- Sticky header with a print button — meant to be reviewed/printed as a document, not navigated as an app shell.
- Only one commit in history (`66b57e6 reorganize into per-project subdirectories`) — moved here from elsewhere in the repo, not built in place.

## Notes
- These two files were previously documented as separate/unrelated prototypes; they're actually two views of the same Helsekort for gravide effort (patient-facing screen vs. full clinical record), per direct correction from the user (2026-07-14).
- The two files still don't share any code or styling — if that ever needs to change, log it as a real decision in this project's `DECISIONS.md`, don't assume convergence.

#helsenorge
