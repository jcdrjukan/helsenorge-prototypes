# Decisions Log — DHG onboarding-scenarioer

Started 2026-09-25.

---

## 2026-09-25 — Separate prototype, not folded into gravid/dashboard.html
**Decision:** Built as a new top-level prototype folder (`dhg-onboarding/`), structured like `gravid/dashboard.html` (chrome-less launcher), rather than adding more scenario buttons to the existing dashboard.
**Alternative considered:** Extending `gravid/dashboard.html` with additional launch scenarios.
**Why:** User explicitly framed this as "a related but separate activity" from the general DHG tjeneste prototyping, with its own goal (demonstrating onboarding paths to stakeholders) distinct from `dashboard.html`'s job (setting up state for the patient-facing prototype).

## 2026-09-25 — aktiver-helsekort.html's existing "active selection, no samtykke" copy is correct and becomes the shared landing page
**Decision:** Kept the page's copy as-is (not reverted to samtykke-based wording). Broadened its role from "scenario 4's page" to the shared activation landing page that nearly all onboarding scenarios funnel into, via a new `?kilde=` param controlling a per-channel context banner + breadcrumb.
**Alternative considered:** Reverting to consent/samtykke-based copy for scenario 4 specifically (treating it as "today's actual flow"), since it was initially assumed to conflict with a "current, still-supported" framing.
**Why:** Direct user correction — once DHG comes under the Kjernejournal forskrift, samtykke is no longer required, but the user must still make an active selection to create/activate her DHG. This is the real target behavior for the updated page, not a placeholder. Scenario 4 keeps its existing provider-issued URL, just repointed at this same updated page.

## 2026-09-25 — Landing page varies by light per-channel banner, not identical across all entries
**Decision:** `?kilde=` drives a short intro banner (only for `epj`/`booking`, where a "why am I here" explanation adds clarity) and a tailored breadcrumb (all 5 recognized kilde values). No `kilde` (or unrecognized) preserves the original page exactly.
**Alternative considered:** One identical page regardless of entry channel.
**Why:** User's explicit choice — makes each scenario demo read clearly on its own without duplicating the whole page per channel.

## 2026-09-25 — Scenario 2 (booking) is a single trigger screen, not a full booking flow
**Decision:** `scenario-2-booking.html` is one screen — a "Gjelder"-dropdown pre-set to "Gravid" plus a submit button that reveals the resulting invitation inline.
**Alternative considered:** A fuller multi-step booking mock (service → time → confirm).
**Why:** User's explicit choice — enough to demonstrate the trigger without building/maintaining a full booking flow for a stakeholder demo.

## 2026-09-25 — Scenario 3a (frontpage discovery) is a self-contained mock, not wired to the real Frankenstein tile
**Decision:** Built `scenario-3-frontpage.html` as its own standalone imitation of the "Gravid" Situasjonstjenester tile, rather than modifying `frankenstein/src/forside/index.tsx`'s real `goToTjeneste` handler to route through the new activation landing page.
**Alternative considered:** Wiring the real forside's not-yet-activated tile click to `aktiver-helsekort.html?kilde=frontpage`.
**Why:** The real tile currently ships pre-activated by default and routes straight into the Frankenstein `gravid` view — changing that is real product logic with its own tradeoffs (activation-state model, which `gravid` implementation it should point to), out of scope for a stakeholder demo that just needs to show the onboarding moment. Flagged in SUMMARY.md as a real gap if the actual tile→activation wiring is wanted later.

#helsenorge
