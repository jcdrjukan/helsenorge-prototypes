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

#helsenorge
