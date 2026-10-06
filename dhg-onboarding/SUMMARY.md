# DHG onboarding-scenarioer

Static HTML prototype demonstrating the four main onboarding paths into **Digitalt helsekort for gravide (DHG)** to stakeholders. A separate demo artefact from the ongoing prototyping of the DHG service itself (`gravid/` / `helsekort-gravide/`) — its only job is to show how a user can arrive at, and activate, DHG via each channel, not to model the service in depth.

## Launcher — `index.html`
Chrome-less scenario picker (same convention as `gravid/dashboard.html`), listing the 4 scenarios with a short description each. Not linked from any patient-facing prototype; `noindex, nofollow`.

## The 4 scenarios
Each scenario starts on a real Forside replica (`scenario-N-frontpage.html`) in the nothing-activated-yet state, except S2, which starts on its booking flow.

1. **S1 — EPJ registration → automatic varsel.** `scenario-1-frontpage.html` (Varsler bell with an unread badge) → `scenario-1-varsel.html`: the Varsler page built from Figma 53:12446. It has a Språk/language button, Tilpass varsler, a sticky "Marker alle som lest / Rediger / N uleste" bar, and the LinkList with separate unread (blueberry, Ulest badge) and read row designs. The top unread row, "Gravid · Digitalt helsekort for gravide" with the normal-weight line "Jordmor eller fastlegen har gitt deg et digitalt helsekort", is the only unread item. Since 2026-10-06 it skips the activation page and goes straight into Gravid in the S1 state (`uke=6&tilknyttet=1&termindato=1&panelHelsekort=1&dokumenter=0&kilde=epj`).
2. **S2 — booking.** `scenario-2-booking.html`: a 4-step Stepper wizard (the real Stepper and StepButtons). Step 3 summary follows Figma 45:5797. The receipt shows a HighlightPanel invitation (only for Gravid + "Første svangerskapskontroll") whose "Kom i gang" (ArrowRight) goes straight into Gravid (`uke=1&tilknyttet=1&termindato=none&panelHelsekort=1&dokumenter=0&kilde=booking`), skipping the activation page since 2026-10-06.
3. **S3 — organic discovery, 3 entries:** `scenario-3-frontpage.html` (Forside tile), `scenario-3-sok.html` (+ `scenario-3-sok-gravid.html`) and `scenario-3-redaksjonelt.html`. All three go to `gravid/aktiver-helsekort-oppdaget.html`, where "Bruk tjenesten Gravid og digitalt helsekort" opens the **"Er du gravid selv?" modal** (Figma 56:27891; 50% grey mask). "Mitt eget svangerskap" → activated Gravid, no termindato. "Noen andres svangerskap" → a second modal, "Du kan dessverre ikke få et digitalt helsekort", whose "Bruk tjenesten Gravid uten digitalt helsekort" → Gravid without DHG, no termindato, no "Del opplysninger" panel (Avbryt closes). Standalone copy of that modal: `gravid/aktiver-helsekort-ikke-tilgjengelig.html`.
4. **S4 — message from the provider.** `scenario-4-frontpage.html` → `scenario-4-varsel.html` (same Varsler design; the only unread item is the top "Melding · Digitalt helsekort for gravide" varsel) → `scenario-4-melding.html` (the Innboks message itself, deep-linked past the overview; Figma 53:6107) → "Gå til tjenesten Gravid" → activation page (`kilde=melding`). The older SMS mock `scenario-4-behandler.html` still exists and links to the activation page with no `kilde`, which is also treated as S4, but nothing in the new S4 path leads to it.

**Unread count is live:** on both Varsler pages the bell badge and "N uleste" are counted from the list, and opening a row or "Marker alle som lest" updates them. The count is remembered for the session and mirrored on that scenario's frontpage bell.

**Every onboarding path lands in Gravid with `dokumenter=0`** (no uploaded papirhelsekort, since she has only just activated). S2–S4 also land with `termindato=none`. S1 lands with a **confirmed, locked** termindato (`termindato=1`), since it was registered by her care provider. All four scenarios show the non-dismissable "Del opplysninger" info message.

## Shared landing pages — `gravid/aktiver-helsekort.html` / `aktiver-helsekort-oppdaget.html`
`?kilde=` drives a context banner (a real NotificationPanel, variant info) and the breadcrumb:
- **`epj`:** "Jordmor eller fastlegen din har gitt deg et digitalt helsekort. Ta i bruk digitalt helsekort og del opplysninger med din fastlege eller jordmor før første svangerskapskontroll."
- **`booking`:** "Du har bestilt time til første svangerskapskontroll. Ta i bruk digitalt helsekort og del opplysninger med din fastlege eller jordmor før timen."
- **`melding` or no `kilde` (S4):** "Jordmor eller fastlegen din har gitt deg tilbud om å bruke digitalt helsekort. Ta i bruk digitalt helsekort og del opplysninger med din fastlege eller jordmor før første svangerskapskontroll."
- **S3 variants:** only the breadcrumb changes.

The activation copy (active selection, no samtykke wording) reflects the intended state once DHG comes under the Kjernejournal forskrift. More detail on the Gravid side is in `helsekort-gravide/SUMMARY.md`.

## Notes
- All new/touched pages reuse the same Helsenorge header/breadcrumb/footer/phone-frame chrome and design-token set as `gravid/aktiver-helsekort.html`, originally generated from a shared Python template (not checked into the repo). Later pages (Varsler, S4 message, frontpages) were built from the Figma nodes named above, with icons exported to `assets/`.
- `noindex, nofollow` on every file in this folder, matching `gravid/dashboard.html`'s convention for non-patient-facing prototype scaffolding.

#helsenorge
