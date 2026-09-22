# Decisions Log — Helsekort for gravide

Started 2026-07-14. Records real decisions as they're made — what was chosen, what the alternative was, and why — so the reasoning isn't lost the way it was for earlier work (see `SUMMARY.md` for what had to be reconstructed from file/git archaeology instead). Newest entries at the top.

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
