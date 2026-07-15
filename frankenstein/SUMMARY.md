# Frankenstein

React + TypeScript + Vite app (real build tooling, unlike the other static-HTML prototypes in this repo) that hosts **four Helsenorge prototypes behind one phone-frame shell**, switchable via a hash route or hostname-based dedicated deploy:

| Prototype | Route/hash | Hostname match | Implementation |
|---|---|---|---|
| Prøver og undersøkelser | `#prover` (default) | — | Inlined directly in `src/App.tsx` |
| Behandlingshjelpemidler | `#behandlingshjelpemidler` | hostname contains "behandling" | `src/behandlingshjelpemidler/` (`OrderWizard.tsx`, `Step1–4.tsx`, `MachinePage.tsx`, `HistoryView.tsx`, `Forside.tsx`, `BhmHeader.tsx`) |
| Psykisk helse | `#psykisk-helse` | hostname contains "psykisk"/"veiviser", or starts with "joyful-blancmange" | `src/psykisk-helse/` (`index.tsx`, `data.ts`, `resources.json`) |
| Sykdom og kritisk informasjon | `#sykdom-kritisk-info` | hostname contains "sykdom"/"kritisk" | `src/sykdom-kritisk-info/` (`index.tsx`, `data.ts`) |

When a dedicated hostname or direct hash link is used, the prototype switcher UI is hidden (`directLink`). No dedicated Netlify site exists yet for Sykdom og kritisk informasjon — it currently only ships as part of Frankenstein's combined deploy, reachable via the `#sykdom-kritisk-info` hash.

## Sykdom og kritisk informasjon
Built from the Obsidian vault spec `Helsenorge/Sykdom og kritisk info.md` and two Figma reference frames (empty state + populated state, file `rBG2uuoQ9iUoPGkpFvAr3f`). Redesigns the "data-heavy and confusing" current Kritisk informasjon view: categories **with** registrations render as full `Panel` cards (tags for gjeldende/avkreftet counts, description, a "Se detaljer" toggle); categories **without** registrations collapse into a plain `Expander` list under a "Sjekk om noe mangler..." heading, split into the same two groups as the Figma source. Ten fixed categories total (`data.ts`), two pre-populated for the demo (Legemiddelreaksjoner, Annet problem med anestesi). A `Sykdomshistorikk` tab sits alongside `Kritisk informasjon` (reusing the self-registered illness list already shown in the `innstillinger` static prototype) since the Figma tab bar shows both, though only Kritisk informasjon had a design to implement.

Open items from the vault spec not yet addressed in this build (still just todos in the note, no design exists for them yet): making empty categories more visually prominent (the current collapse-to-expander pattern arguably under-emphasizes them, which the note itself flags as a tension with the "quality assurance" goal), and a "message your fastlege" feature.

## Psykisk helse ("veiviser")
A mental-health self-assessment wizard: Q1 asks what the user is struggling with (sleep, anxiety, low mood, stress), Q2 asks their goal, both mapped to `Tag`s (sove-bedre, angst, stress, nedstemthet, rus-og-avhengighet, spilleavhengighet, ensomhet-relasjoner, generell-mestring). Results are scored against a `Resource[]` catalog (`resources.json` — verktøy/tools and artikler/articles) and shown as recommended tools + articles, with a fallback list and an Expander hiding results beyond the 4th. This is the most actively developed piece right now (all recent commits on this repo's `main`/prototype work are "Psykisk helse: ..." changes).

## Stack
- [`@helsenorge/designsystem-react`](https://github.com/helsenorge/designsystem) (real component library — `Logo`, `Title`, `Icon`, `Avatar`, `LinkList`, `ElementHeader`, etc.) rather than hand-rolled CSS classes.
- `motion` for animation, `classnames` for conditional classes, `normalize.css`.
- Deployed via its own `.netlify/` config; `README.md` is the untouched Vite template boilerplate (not project-specific documentation).

**Central design system:** intended as a shared resource across all Helsenorge projects, not just Frankenstein — the other static-HTML prototypes currently hand-roll the same design tokens as inline CSS instead of consuming the package directly.

## Notes
- This is the only project with real source-controlled dependencies (`package.json`/`package-lock.json` currently show uncommitted changes per `git status`) — check `npm install` is up to date before running `npm run dev`.

#helsenorge
