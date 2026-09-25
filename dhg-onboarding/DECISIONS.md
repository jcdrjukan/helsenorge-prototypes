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

## 2026-09-25 — S3a rebuild: fixed broken icons, and matched the live reference over the git source where they disagree
**Decision (icons):** First rebuild's icon extraction (`grep -o '"M[^"]*"' | head -1` against each design-system Icon component's compiled JS) silently dropped required sub-`<path>` elements on compound icons (Edit, MentalHealthAdult, MaleDoctorAndPerson, Logout) and `fill-rule="evenodd"` on ~11 single-path icons (Medicine, SharedHealthData, Hospital, Microscope, Vaccine, Laboratory, Toolbox, Bus, Archive, MedicineWarning, HealthWarning) — the latter rendered as solid blobs instead of the real cutout shape. Logout additionally used entirely wrong path data (accidentally reused from an unrelated 38×38 icon already in `gravid/aktiver-helsekort.html`, from before this task). Re-extracted every icon by properly parsing each component's `normal` variant (handles both the `normal/normalHover/xSmall/xSmallHover`-keyed icons and `Bell`'s `isHovered`-ternary shape), preserving every required `<path>` and `fill-rule`.
**Decision (activated Gravid card content):** Removed the "Nytt innhold" badge and teaser bullets ("Uke 32" / "Vise målinger og informasjon") from the post-activation "Støtte til din situasjon" Gravid card — these were pulled from the **git branch's current `data.ts`**, but per direct user correction the actually-**deployed** `psykiskhelse-demo.netlify.app` bundle (confirmed by inspecting its live JS) has no badge/teaser on that entry at all, just `{label, description, icon}` — the deployed site lags the branch. Card now renders icon+title+description only, matching what's really live.
**Why:** User's direct instruction: "the end state frontpage, post activation, should literally be exactly the page I linked to" — the deployed artifact is the source of truth for this scenario's fidelity, not the git branch, whenever the two disagree.

## 2026-09-25 — Landing state refined: uke 1 + questionnaire panel for every "no termindato" scenario, S1 unchanged
**Decision:** `DEFAULT_ACTIVATE_QUERY` (S2/S3a/S3b/S3c/S4 — every scenario with no termindato) changed from `uke=6&panelHelsekort=0` to `uke=1&panelHelsekort=1`: without a termindato there's nothing to calculate a current week from, so she lands on Gravid uke 1 (not an arbitrary uke 6), and sees the "del opplysninger før første svangerskapskontroll" nudge panel since she hasn't shared anything yet. S1 (epj) is unaffected — it already has a (tentative) termindato, so keeps uke=6, panelHelsekort=0.
**Also fixed:** `gravid/index.html` previously trusted `panelFarskap` from the URL/localStorage with no re-validation against the real week, even though the panel's own copy says farskap can only be registered from uke 22 — a latent bug, not onboarding-specific, that would have let a stale dashboard.html selection or hand-edited URL show it at any week. Now gated by `initialWeek >= 22` regardless of source.
**Why:** Direct user request. The farskap fix generalizes past just the onboarding scenarios since it's the same underlying gap panelHelsekort already avoids via dashboard.html's own UI-level check (though that one still isn't re-validated in index.html itself — only farskap was asked for here).

## 2026-09-25 — Dashboard/launcher trimmed to a pure link list; scenario pages open in new tabs
**Decision:** `index.html` (the launcher) lost its intro paragraph and the grey "3a is a standalone mock…" status note under scenario 3's buttons; title shortened to "DHG onboarding"; every scenario link now opens in a new tab (`target="_blank" rel="noopener"`) so the launcher stays open as a home base. S2's card description and S4's title/description updated to user-supplied wording.
**Why:** Direct user request — a cleaner, faster launcher for repeated stakeholder walkthroughs.

## 2026-09-25 — S3b rebuilt from the real Meny overlay + a real search for "Gravid"
**Decision:** `scenario-3-sok.html` replaced with content copied from the live helsenorge.no site: opened the real mobile "Meny" overlay (which merges Meny+Søk into one panel below ~768px — confirmed by resizing rather than assumed), searched "Gravid", and captured the real search-results page (`/sok/?q=Gravid`) — both the header's Meny overlay and the results page render into separate web-component shadow roots (`hn-webcomp-header`, `hn-webcomp-cmsagent`), so the real markup had to be pulled via `shadowRoot.innerHTML`, not a plain page fetch. Real content used verbatim: the pre-filled search input, the real "Vis KI-oppsummering" (Beta) AI-summary toggle panel — a real, current feature neither previously known about nor invented — the bold "170 resultater for 'Gravid'" status text, all 12 real result titles/snippets with their real `<mark>`-highlighted terms, "Viser 12 av 170 treff", and the real "Vis flere" button. The page's own `<h1>Søkeresultater for Gravid</h1>` is genuinely screen-reader-only on the live site (a real `sr-only` utility class) — kept invisible here too rather than shown, since that's how it actually is.
**Scope calls made, not directed:** kept this project's established signed-in header/profile-bar and "Onboarding-scenarioer" breadcrumb (matching every sibling scenario page) rather than switching to the real page's anonymous "Logg inn" header and "Forside" breadcrumb, since the whole demo assumes she's already logged in throughout. Only the first result ("Gravid") is wired to `aktiver-helsekort.html?kilde=sok`; the other 11 real results link to `#` rather than out to the live production site, keeping the demo self-contained rather than risking an accidental navigation away from it mid-walkthrough.
**Why:** Direct user request to consult and copy the real page's HTML for this scenario.

## 2026-09-25 — S3b gets a real intermediate stop: the actual "Gravid" editorial page
**Decision:** The "Gravid" search result no longer links straight to our activation page — it now links to a new `scenario-3-sok-gravid.html`, a replica of the real `https://www.helsenorge.no/gravid/` editorial hub page (the page that search result's real href actually points to). That page's real promo panel — "Bruk tjenesten Gravid og digitalt helsekort", real photo, real copy, real "Illustrasjon: iStock" caption, pulled from the live page's own markup (`._promosection` classes, `helsenorge-cms-web.*.css`) — is the one that's wired into `aktiver-helsekort.html?kilde=sok`; everything else on the page is real content on `#` links, same convention as scenario-3-sok.html's other 11 results. Confirmed on the real site that this content sits in plain light DOM (not a shadow root, unlike the header/search), and that the promo panel renders stacked (photo full-width on top, blueberry-tinted text block below) on mobile widths, not the 2-column grid its CSS shows at ≥768px — checked by actually resizing rather than assumed.
**Scope call:** only a representative slice of the real page (H1+preamble, the promo panel, one more real link+blurb, one real 6-item checklist, the real feedback widget) is reproduced, not all ~25 sections of the actual page — the promo panel is the only piece with real functional weight here. The real photo is hotlinked directly from helsenorge.no's own CDN rather than downloaded/re-hosted.
**Why:** Direct user request — the search result should point to the real editorial page, and that page's own real promo panel (not the search result itself) is what should lead into DHG activation.

#helsenorge
