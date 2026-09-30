# Decisions Log — Helsekort for gravide

Started 2026-07-14. Records real decisions as they're made — what was chosen, what the alternative was, and why — so the reasoning isn't lost the way it was for earlier work (see `SUMMARY.md` for what had to be reconstructed from file/git archaeology instead). Newest entries at the top.

---

## 2026-09-24 — Real production markup/CSS, when available, beats a screenshot for fidelity checks
**Decision:** When the user can paste a test environment's actual rendered HTML and/or its compiled CSS bundle URLs (fetchable directly even for an authenticated page, since static asset URLs aren't themselves auth-gated), use that as the source of truth over a Figma screenshot approximation — grep the CSS for the real class names/values, and where real markup reveals structure a screenshot can't (e.g. an illustration overlapping a panel edge), rebuild to match it.
**Alternative considered:** Keep approximating purely from Figma screenshots, as had been done for the rest of `index.html`'s Mål av magen chart and the Nyttig å vite panel.
**Why:** Concretely corrected three approximations this session: the Mål av magen chart's padding/border were estimated wrong (real HighlightPanel--cherry has a border the screenshot didn't make obvious), the right-arrow icon size was a screenshot-measured 32px guess vs. a confirmed real 38px, and the Stork illustration's panel-overlap effect (background starting halfway up the illustration) wasn't reproducible from a flat screenshot at all — the real markup showed it's two sibling elements with a negative-margin/z-index overlap, not a nested illustration. Real markup/CSS should be requested and used whenever the user can get it, not treated as a nice-to-have.

---

## 2026-09-24 — "Nyttig å vite i denne perioden" panel built to house the Stork illustration, even though it wasn't originally asked for
**Decision:** Added a new panel (cherry/peach background, three article links, "Se alle artikler og verktøy") to `gravid/index.html` specifically to give the Stork illustration a real placement, matching where it sits in the production reference.
**Alternative considered:** Place the Stork illustration somewhere in the existing page structure instead of building a new section.
**Why:** The reference screenshot showed Stork specifically tied to this panel, and no equivalent section existed yet in the prototype — the illustration wouldn't have anywhere sensible to go without it. Flagged to the user as scope added beyond the literal request rather than assumed silently.

---

## 2026-09-24 — Help triggers moved from an icon button beside the section heading to a standalone "trigger text" row beneath it
**Decision:** `.help-trigger-text` — a purple "?" icon + label text + chevron, on its own line under the `<h2>`, toggling a collapsed help-copy panel — replaces the old `.help-trigger` icon-only button that sat inline next to the heading. Applied to Mål av magen ("Hvorfor måles magen?") and Huskelapper ("Hvem kan se huskelappene mine?"). The actual help copy is a placeholder ("Hjelpetekst kommer.") pending real wording from the user.
**Alternative considered:** Keep the icon-button-beside-header pattern already in place.
**Why:** Direct user request, referencing the production reference screenshot's own pattern.

---

## 2026-09-24 — Right-pointing CTA arrows settled at 38px, superseding an earlier 32px estimate
**Decision:** Every plain-link right-arrow on `gravid/index.html` (was a mix of 20px/24px, then unified to a screenshot-measured 32px earlier this session) is now 38px, using the exact `ArrowRight` icon path confirmed from real pasted markup.
**Alternative considered:** Leave the 32px estimate in place.
**Why:** The 32px figure was a reasonable but approximate read of a screenshot's arrow-to-text-cap-height ratio; real markup gave an exact `width="38" height="38"` value, which is now the confirmed number.

---

## 2026-09-22 — Prototype scenarios (week, helsekort-connection status) are set via a dashboard page, not hand-edited init calls
**Decision:** `gravid/dashboard.html` — a plain control panel outside the patient-facing chrome — lets you pick the svangerskapsuke and whether the user has a digital helsekort connection, then launches `index.html` with that state via query params, falling back to localStorage on any page opened without them.
**Alternative considered:** Keep editing the hardcoded init call at the bottom of each page's script (the existing pattern for `updateWeek(30)` and `setTermindatoConfirmed(true)`) whenever a different scenario needs testing.
**Why:** The user's stated "grand vision" is a growing set of scenario parameters (helsekort connection today; possibly "Kartlegging for første svangerskapskontroll" submitted, and others not yet decided) — worth a real control surface now rather than more hand-edited call sites piling up per parameter.

---

## 2026-09-22 — Uke-for-uke tabs use the real Frankenstein Tabs component, not a hand-rolled underline bar
**Decision:** `gravid/uke-for-uke.html`'s tabs are a static HTML/CSS/JS translation of `@helsenorge/designsystem-react`'s actual Tabs/TabList/TabPanel component — same classnames, DOM shape (`ul`/`li`/`button`), and mobile-width CSS values, pulled directly from the package's own source.
**Alternative considered:** The underline-style tab bar built earlier by eyeballing the Figma screenshot (Figma showed a plain underline, not the component's boxed/raised-tab look).
**Why:** Direct user request — use the real Frankenstein component instead of a visual approximation, even though the two look different (boxed/raised vs. underline).

---

## 2026-09-22 — "Clickable green" on Gravid is blueberry-700 (#08667C), not kiwi
**Decision:** The editable-termindato affordance and the snarvei star on `gravid/index.html` use `#08667C` (already in the palette as `--blueberry-700`).
**Alternative considered:** Kiwi-700 (`#0CA161`, the palette's actual green swatch) — used first, since it was the only "green" token in this hand-rolled CSS and no other clickable element on the page was styled green to compare against.
**Why:** Per direct user correction, #08667C is the real Helsenorge color used for clickable elements — not a green at all in the palette's own naming, but that's the one meant by "green." Worth checking before assuming kiwi on any other prototype where "green" comes up for something clickable.

---

## 2026-07-14 — Merge Gravid and Helsekort for gravide documentation
**Decision:** Document `gravid/index.html` and `helsekort-gravide/helsekort-gravide.html` as two views of one project ("Helsekort for gravide") under a single `SUMMARY.md`/`DECISIONS.md` pair, dropping the separate `gravid/` docs.
**Alternative considered:** Keep them as two separately-documented prototypes (how they were originally written up).
**Why:** They're one and the same effort — patient-facing weekly tracker and clinical antenatal record are two views of the same feature, not two unrelated prototypes — per direct correction from the user.

---

<!-- Template for new entries:

## YYYY-MM-DD — Short decision title
**Decision:** what was chosen
**Alternative considered:** what else was on the table
**Why:** the reason this one won

-->

## 2026-09-29 — "Del opplysninger" panel now uses the same NotificationPanel as "Registrer farskap"
**Decision:** On `gravid/index.html`, the "Del opplysninger før første svangerskapskontroll" panel was a blueberry box with a separate title, a compact warn-outline NotificationPanel inside it and a borderless button. It is now the same real NotificationPanel (info variant, dismissable, with a close button) as the farskap panel. Title: "Del opplysninger før første svangerskapskontroll". Body: "Du har ikke delt opplysningene i ditt digitale helsekort ennå." CTA underneath: "Fortsett utfylling", the same link style as the farskap panel's link but semibold, with the design system's ArrowRight icon after it.
**Why:** Direct user request.
**Follow-up (same day):** switched to the warning variant ("warn"), per direct request: real banana800 border (#AB7C00), banana50 background (#FDF8DF) and the warning-sign icon. Otherwise it keeps the same dismissable layout, text and CTA as the farskap panel.

## 2026-09-29 — "Beregn termindato" is the real Frankenstein mobile fill Button; empty-state message enlarged
**Decision:** The button inside the ring (termindato "none" state) was a compact custom button: 14px text, about 25px tall. It now uses the real `@helsenorge/designsystem-react` Button, "fill" variant at the mobile (medium) size. The design system only has medium and large, so medium is its smallest regular size: 18px/1.375rem semibold white text, 44px min-height, 0 1.5rem padding, 0.5rem radius, blueberry500 fill, and on hover blueberry700 plus a 0.25rem ring. At full width on one line it looked too heavy inside the 270px ring, so per direct request the label wraps onto two centered lines ("Beregn / termindato"), making the button about 135px wide. The "Termindato ikke registrert" message above it is now 20px regular (it was the 16px caption), centered, and breaks after "Termindato". Nothing collides, because the week bubble is hidden in this state.
**Why:** The user asked whether the button used the real Frankenstein mobile style (it didn't), then gave direct layout and size corrections after viewing it locally.

## 2026-09-29 — Beregn termindato and Registrer termindato pages
**Decision:** New `gravid/beregn-termindato.html` (Figma "CLD - Gravid" node 53:27367) and `gravid/registrer-termindato.html` (node 53:27371). Both Figma frames are flat screenshots, so layout and copy come from the images, and component values come from the real `@helsenorge/designsystem-react` source: Label and sublabel mixins, Input (2px neutral700 border, 48px), a DatePicker-style calendar button (real Calendar icon, backed by a native date picker), fill and outline Buttons at medium size, and the HelpTriggerStandalone/HelpDetails already used on index.html.
- **Beregn:** termindato = first day of last menstruation + 283 days (per direct request). "Registrer termindato manuelt" opens the manual page.
- **Registrer:** manual entry, also used when editing an existing termindato (the pencil/date on index.html now links here, pre-filled with the current date). "Avbryt" returns to the Gravid page. "gå tilbake og beregne datoen" opens the calculator.
- **Round trip:** both pages carry index.html's URL state through and back (tilknyttet, panels, kilde…). Saving returns `termindato=0&termindatoDato=YYYY-MM-DD`, and index.html then shows the real date, the real days left, and "uke W dag D" derived with the same 283-day length (elapsed = 283 − days left).
- **Validation (not specified in Figma):** the date must be a real date. For the LMP: not in the future, and not so old that the termindato has already passed. For a manual termindato: not in the past and at most 283 days ahead.
- **Deviations/placeholders:** the breadcrumb reads "Gravid" on both pages. The Figma calculator frame says "Forside", but the page is reached from and returns to the Gravid page. The help-expander texts ("Hvordan beregnes termindato?", "Om termindato ved IVF") aren't in the Figma frames, so short placeholder copy was written. The footer is this prototype's existing footer, not the newer one in the screenshots.
**Why:** Direct user request with Figma links for both pages.

## 2026-09-29 — Uploaded-document block made optional (?dokumenter=0); hidden in DHG onboarding S1
**Decision:** In "Papirhelsekortet og dokumentasjon" on `gravid/index.html`, the uploaded-document part is now wrapped in `#uploadedDocs`: "Sist opplastet papirhelsekort", the real DokPanelItem card and "Se alle dine Gravid-dokumenter". It's hidden with `?dokumenter=0`. The heading, description and the two upload buttons always show. It's **shown by default**, so the design is kept as the reference for the other Gravid prototypes. DHG onboarding S1 (`kilde=epj`) now activates into `...&dokumenter=0`, since a user who has just activated DHG after an EPJ-triggered varsel can't already have uploaded anything. `dashboard.html` gets a matching "Har lastet opp papirhelsekort" checkbox (default on). The setting is URL-only, not persisted to localStorage, so a scenario link can't leave later default visits without the reference design.
**Why:** Direct user request: "it doesn't make sense that there would already be a document uploaded there. But retain the design for this somewhere."
**Follow-up (same day):** extended to S2–S4 per direct request. That covers both activation pages' default and fallback links, S3's "Bruk Gravid uten digitalt helsekort" opt-out link, and the Forside "Gravid" tile links on the S1/S3/S4 frontpages. Every onboarding path into the Gravid page now carries `dokumenter=0`.

## 2026-09-30 — Svangerskapsjournal and Prøver og målinger: first empty-state versions
**Decision:** Added `gravid/svangerskapsjournal.html` and `gravid/prover-og-malinger.html`, linked from the Gravid front page's "Se hele svangerskapsjournal" / "Siste prøver og målinger" quick links (previously `href="#"`). Both are in the "nothing registered yet" state. The source the user pasted for the real Svangerskapsjournal was the client-rendered page shell only (empty `#main-content-wrapper`), so there was no real content or layout to port, and the user chose an empty-state first version instead.
- **Structure (both pages):** the Gravid page frame (header, "Gravid" breadcrumb, Språk/Language, footer), H1, a short intro, **one** EmptyState, a "Dette vil du finne her" list of what will appear (with a one-line explanation each), and a cross-link to the other page. A single empty state was chosen over a stack of empty expanders, where each would have to be opened to find "nothing" inside.
- **EmptyState** is the real `@helsenorge/designsystem-react` component (type "dashed", size "normal", mobile): 1px dashed #62625f border, 16px radius, 16px padding/gap. Its own `EmptyBoxBeeSmall` illustration was converted from the component's JSX to `gravid/img/empty-box-bee-small.svg`. Title uses title4 (mobile) and the additional text uses body.
- **Journal sections** follow the existing clinical `helsekort-gravide` prototype's tabs: Medisinsk bakgrunn, Tidligere svangerskap og fødsler, Nåværende svangerskap, Svangerskapskontroller, Ultralydundersøkelser, Fødsel og barseltid. The lab tab moved to Prøver og målinger. **Prøver og målinger** lists Blodtrykk, Vekt, Urinprøve, Hemoglobin, Blodtype og antistoffer, Mål av magen.
- **Copy** (intros, empty-state text, list explanations) is a first draft for review, not sourced.
- **URL state:** the breadcrumb, cross-links and front-page quick links carry the Gravid page's URL state (uke/tilknyttet/kilde…), so a scenario survives the round trip.
**Follow-up (same day):** per the user, the two quick links are hidden for users without digitalt helsekort (`tilknyttet=0`). They're hidden together with "Mål av magen" in `setSfSectionVisibility()`. The user also flagged this Svangerskapsjournal draft as "far from where it needs to be" and is gathering real sectional source code, so treat its content and structure as a placeholder.
**Why:** Direct user request.

## 2026-09-30 — Svangerskapsjournal rebuilt from the real page's rendered markup
**Decision:** The placeholder empty-state journal was replaced with a rebuild of the real page, from outerHTML the user pasted (everything below the ingress). Structure: "Lagre til Dokumenter" (outline Button, medium, real download icon) → "Sist oppdatert: 31.08.2026" → an **ExpanderHierarchy** of ten level-1 Expanders, in the real order and with the real titles: Om deg · Oppfølging i svangerskapet · Tidligere svangerskap · Helseutfordringer/sykdom · Ditt svangerskap · Levevaner · Legemidler · Svangerskapskontroller · Andre prøvesvar · Mål av magen. Component styling comes from the design system's own SCSS (ExpanderHierarchy expander.module.scss level 1: title2, neutral500 rules, neutral100 hover/expanded; Duolist "collapsed" and "non-formatted"; DictionaryTrigger dotted help underline; title4; the dashed EmptyState with the real "Det er foreløpig ikke registrert opplysninger." text).
- **Data:** the real page's test-account data was replaced with plausible data for the prototype's own user (Tora Hansen; fastlege Knut Andersen, Ekeberg legekontor, the same as DHG onboarding S2). The four sections that were empty in the real capture stay empty (Tidligere svangerskap, Svangerskapskontroller, Andre prøvesvar, Mål av magen); the other six are populated, mirroring the real field set.
- **Termin** follows the same state as the Gravid page: a registered `termindatoDato`, "Ikke registrert" for `termindato=none`, or the default derived from `uke`.
- **Links:** "Resepter" and "Sykdom og kritisk informasjon" point to this repo's own Legemiddelliste and Sykdom og kritisk info prototypes (the real page links to tjenester.hn…).
- **Ordforklaring (DictionaryTrigger):** in the real page these open a HelpBubble whose content wasn't in the capture. Here they open a simple help bubble with **placeholder** explanations (Yrkesaktiv siste 6 måneder, Vekt, KMI, Røyk, Alkohol, Snus, Folat) that should be replaced with the service's real word list.
- **Deviations/fixes:** "Helseutfordringer/sykdom" gets a `<wbr>` after the slash, since at 344px it otherwise overflows its chevron. A title4 wrapped in a DictionaryTrigger (Røyk/Alkohol/Snus) keeps its 2rem top spacing. The expanded state is toggled on the title (`--expanded`) like the real component. The ingress is still the earlier draft, because the real ingress text wasn't in the capture. "Lagre til Dokumenter" is not wired up.
**Why:** Direct user request, with the real rendered markup.

## 2026-09-30 — "Siste prøver og målinger" rebuilt from the real page's rendered markup
**Decision:** `gravid/prover-og-malinger.html` was rebuilt from outerHTML the user pasted for the page header and one collapsed section. This replaces the earlier empty-state draft.
- **PageHeader:** H1 "Siste prøver og målinger" (title1 2rem/2.375rem 600), the snarvei star beside it (this prototype's existing favourite button, own localStorage key), and the real ingress text as preamble (1.25rem/1.625rem): "Her finner du resultater fra prøver du har tatt under graviditeten din. Du ser også en oversikt over målinger fra svangerskapskontroller, som blodtrykk og andre målinger." The real `<hn-webcomp-infopanel>` slot was empty in the capture, so it's omitted.
- **ExpanderList,** variant "line", colour "white", with ElementHeader rows (values from the components' SCSS: #7d7c79 rules, 1.125rem/1.75rem link text, 600 when open, #f5f3f3 hover/open, content padding 0.75rem 1rem 2rem 1.5rem, 38px chevron). The page supports several sections (the user noted there can be several); only categories with results are listed. For now there's the one from the capture, "Andre prøvesvar".
- **PLACEHOLDER:** the expanded content of "Andre prøvesvar" wasn't in the capture (the item was collapsed). It shows typical first-kontroll blood tests (blodtype, irregulære antistoffer, Hb with reference range, hepatitt B, HIV, syfilis; "Tatt 14.08.2026 hos Ekeberg legekontor") as a Duolist, to be replaced with the real expanded markup.
- **Known inconsistency:** the Svangerskapsjournal's own "Andre prøvesvar" section shows the empty state (as in its real capture), while this page lists results. The two should be reconciled once the real expanded content is known.
**Why:** Direct user request with the real rendered markup.

## 2026-09-30 — Breadcrumb row on Svangerskapsjournal / Siste prøver og målinger matched to the front page
**Decision:** Both pages had inherited the activation page's breadcrumb styles: 8px top and 12px side padding, and a full-width #BDBAB9 divider 8px below. That made the row taller than the Gravid front page's. They now use the front page's exact rules: `.breadcrumb { padding: 0 4px }` and a divider of 1px #D6D4D3, inset 1rem, directly below. Measured identical to index.html (46px row, 4px link indent, same divider gap, width and colour). The fix lives in both pages' generator scripts, so a regeneration keeps it.
**Follow-up (same day):** per direct request, the same rules were applied to aktiver-helsekort, aktiver-helsekort-oppdaget, beregn-termindato, registrer-termindato and avslutt. All nine Gravid pages with a breadcrumb now measure identically (46px row, 4px indent, 4px gap, 328px #D6D4D3 divider). The pages generated from aktiver-helsekort.html inherit the fix on regeneration.
**Why:** Direct user request.

## 2026-09-30 — "Kartlegging før første svangerskapskontroll" rebuilt with Helsenorge's own form CSS
**Decision:** New `gravid/kartlegging.html`, rebuilt from the real Skjemautfyller page's rendered markup (the user's first paste, the page source, was only the empty client-rendered shell). All 23 questions in 8 sections (+ intro and urinprøve info) are verbatim nynorsk from the capture, with their real options, "Vel ein"/"(valfritt)" tags, help triggers, the 250-character textarea, kg/cm quantity fields and the full country/language dropdowns.
- **Real stylesheets, not hand-copied values:** the page's CSS bundles are public on static.hn.test.nhn.no, so the component stylesheet (`language-provider.*.css`, which holds every hashed component class used: Button, RadioButton, Checkbox, Textarea, Input, Select, Label, FormFieldTag, HelpTrigger, Expander, Title) and `skjemautfyller.*.css` were downloaded to `gravid/css/skjema/`. The generator (`.playwright-mcp/build_kartlegging.py`) emits the same DOM and class names as the capture, so Helsenorge's own CSS styles it.
- **Adjustments to the downloaded CSS:** `@font-face` rules stripped (their font URLs are relative to the Helsenorge host; the prototype loads Source Sans Pro itself). All wider-screen `@media (min-width)` blocks were removed (205 + 18), so the real **mobile** styles always apply inside the phone-frame mockup; otherwise desktop sizes (e.g. a 48px title) showed in the 390px frame on a desktop browser. The page-wide core `helsenorge.css` reset was not included, to protect the prototype's own chrome; the few resets the form needs (fieldset, heading margins, form controls inheriting the font) are added scoped to `.kl`.
- **Behaviour:** radios are pure CSS (`:has(:checked)`). Checkboxes get the real `--checked` class plus a tick icon on change, as the React component does. The character counter, the "Slik tar du en urinprøve" expander, help boxes, a "Lagre" toast, and "Gå vidare" (back to Gravid with `panelHelsekort=0&kartlegging=sendt`, so the "Del opplysninger" panel disappears) all work. "Avbryt" and the breadcrumb return with the scenario state.
- **Entry point:** the "Del opplysninger" panel's "Fortsett utfylling" link on the Gravid page now opens this form (it used to point at the activation page).
- **Data:** personal details are the prototype user's (Tora Hansen, fastlege Knut Andersen, Ekeberg legekontor), not the test account's.
- **PLACEHOLDERS:** the help texts (skjema, vekt, folat før/under, slekt, landbakgrunn) and the urinprøve expander content weren't in the capture. Conditional follow-up questions, if the real form has any, aren't included because only the initial state was captured.
**Why:** Direct user request with the rendered markup.

## 2026-09-30 — "Del opplysninger" panel back to the info variant
**Decision:** The "Del opplysninger før første svangerskapskontroll" NotificationPanel on `gravid/index.html` was switched from the warning variant (banana, set on 2026-09-29) back to **info** (blueberry), with the info icon, matching the farskap panel and the activation pages' banners. Text, close button and the "Fortsett utfylling →" link (which now opens the Kartlegging form) are unchanged. The warn CSS rules stay, unused.
**Follow-up (same day):** per direct request the panel is **no longer dismissable**: the close button is removed, and it uses the standard (non-dismissable) NotificationPanel padding. It stays until the kartlegging is sent ("Gå vidare" → `panelHelsekort=0`). The farskap panel keeps its close button.
**Why:** Direct user request: in the DHG onboarding flow it should be a green "info" message like the others.

#helsenorge
