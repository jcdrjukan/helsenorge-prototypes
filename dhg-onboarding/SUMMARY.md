# DHG onboarding-scenarioer

Static HTML prototype demonstrating the four main onboarding paths into **Digitalt helsekort for gravide (DHG)** to stakeholders. A separate demo artefact from the ongoing prototyping of the DHG service itself (`gravid/` / `helsekort-gravide/`) — its only job is to show how a user can arrive at, and activate, DHG via each channel, not to model the service in depth.

## Launcher — `index.html`
Chrome-less scenario picker (same convention as `gravid/dashboard.html`), listing the 4 scenarios with a short description each. Not linked from any patient-facing prototype; `noindex, nofollow`.

## The 4 scenarios
1. **`scenario-1-varsel.html`** — EPJ registration → automatic "hendelsesvarsel". A single-notification mock of the Varsler screen (adapted pattern from `forstegangsvarsel2/`'s varsel-list), with one unread "Fra Helsenorge" notification ("Digitalt helsekort for gravide er klart for deg").
2. **`scenario-2-booking.html`** — Booking → pre-appointment invitation. A minimal "Bestill time" form with a "Hva gjelder timen?" dropdown pre-set to "Gravid"; submitting reveals a booking confirmation plus an invitation panel to activate DHG and answer kartlegging questions before the appointment. Deliberately a single trigger screen, not a full booking flow (per user decision).
3. **Organic discovery, 3 sub-entries** (`scenario-3-frontpage.html`, `scenario-3-sok.html`, `scenario-3-redaksjonelt.html`) — self-contained mocks of a frontpage "Situasjonstjenester" tile, a global search-results page for "gravid", and an open editorial article ("Gravid og fødsel"). `3a` is a standalone imitation of the tile for this demo, not wired to the real "Gravid" tile that already exists (and is already activated by default) in the Frankenstein `forside` prototype — that real tile isn't currently wired to the activation landing page either; left as-is to avoid touching real product logic for a demo-only need.
4. **`scenario-4-behandler.html`** — the current, still-supported, soon-to-be-phased-out flow: a mock SMS from "Jordmortjenesten" containing the same provider-issued activation URL used today, now pointed at the updated shared landing page.

All 4 scenarios funnel into the **same shared activation landing page**, `gravid/aktiver-helsekort.html`.

## Shared landing page changes — `gravid/aktiver-helsekort.html`
Extended (not replaced) with a `?kilde=` query param (`epj` / `booking` / `frontpage` / `sok` / `redaksjonelt`) that drives:
- A short context banner above the "Aktiver digitalt helsekort" panel, explaining why the user landed here (only for `epj` and `booking` — the 3 discovery variants change only the breadcrumb, no banner, since arriving via search/tile/article needs no extra explanation).
- The breadcrumb label/link, pointing back to whichever scenario screen sent the user in.

No `kilde` param (or an unrecognized one) preserves the page's original behavior exactly — no banner, breadcrumb reads "Gravid" → `index.html`. This is scenario 4's actual behavior: the provider-issued URL carries no `kilde` param.

The page's copy itself (active-selection CTA, no samtykke wording) was **not** reverted — confirmed by the user as the intended real-world behavior once DHG comes under the Kjernejournal forskrift: samtykke falls away, but the user must still make an active selection to create and activate her DHG. The page's role broadened from "scenario 4's page" to "the shared landing page nearly all scenarios use."

## Notes
- All new/touched pages reuse the same Helsenorge header/breadcrumb/footer/phone-frame chrome and design-token set as `gravid/aktiver-helsekort.html`, generated from a shared Python template (`/.claude/jobs/.../gen/build.py`, not checked into the repo) to keep the repeated chrome consistent — not a build step for this repo, just how these 6 files were authored.
- `noindex, nofollow` on every file in this folder, matching `gravid/dashboard.html`'s convention for non-patient-facing prototype scaffolding.

#helsenorge
