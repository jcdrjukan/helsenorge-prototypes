# Decisions Log — Frankenstein

Started 2026-07-14. Records real decisions as they're made — what was chosen, what the alternative was, and why — so the reasoning isn't lost the way it was for earlier work (see `SUMMARY.md` for what had to be reconstructed from file/git archaeology instead). Newest entries at the top.

---

<!-- Template for new entries:

## YYYY-MM-DD — Short decision title
**Decision:** what was chosen
**Alternative considered:** what else was on the table
**Why:** the reason this one won

-->

## 2026-07-15 — Built Sykdom og kritisk informasjon inside Frankenstein, not as a static-HTML prototype
**Decision:** New prototype lives at `src/sykdom-kritisk-info/` as a Frankenstein React page, using real `@helsenorge/designsystem-react` components (Panel, Tag, Expander, EmptyState, Tabs, Title).
**Alternative considered:** A hand-rolled static HTML/CSS folder at the repo root, matching the convention used by `behandlingshjelpemidler/`, `egenregistreringer/`, etc.
**Why:** User explicitly chose "use Frankenstein" when Figma's Code Connect step found no codebase match for the design outside of Frankenstein's design-system dependency. Code Connect mapping itself failed server-side ("published component not found") since these components were never registered via Figma's publish flow — abandoned that path and built directly from `get_design_context` output instead.

## 2026-07-15 — No dedicated Netlify site for Sykdom og kritisk informasjon yet
**Decision:** Shipped only via Frankenstein's existing combined deploy (reachable at `#sykdom-kritisk-info`); did not create a new Netlify site.
**Alternative considered:** Provision a new site the way `psykisk-helse` and `behandlingshjelpemidler` each got their own hostname-detected dedicated deploy.
**Why:** Creating a new Netlify site is an external, harder-to-reverse action — deferred until the user confirms they want a standalone shareable link for this prototype.

#helsenorge
