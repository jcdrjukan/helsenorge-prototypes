# Frankenstein

React + TypeScript + Vite app (real build tooling, unlike the other static-HTML prototypes in this repo) that hosts **five Helsenorge prototypes behind one phone-frame shell**, switchable via a hash route or hostname-based dedicated deploy:

| Prototype | Route/hash | Hostname match | Implementation |
|---|---|---|---|
| Prøver og undersøkelser | `#prover` (default) | — | Inlined directly in `src/App.tsx` |
| Behandlingshjelpemidler | `#behandlingshjelpemidler` | hostname contains "behandling" | `src/behandlingshjelpemidler/` (`OrderWizard.tsx`, `Step1–4.tsx`, `MachinePage.tsx`, `HistoryView.tsx`, `Forside.tsx`, `BhmHeader.tsx`) |
| Psykisk helse | `#psykisk-helse` | hostname contains "psykisk"/"veiviser", or starts with "joyful-blancmange" | `src/psykisk-helse/` (`index.tsx`, `data.ts`, `resources.json`) |
| Sykdom og kritisk informasjon | `#sykdom-kritisk-info` | hostname contains "sykdom"/"kritisk" | `src/sykdom-kritisk-info/` (`index.tsx`, `data.ts`) |
| Legemiddelliste | `#legemiddelliste` | hostname contains "legemid"/"resept" | `src/legemiddelliste/` (`index.tsx`, `data.ts`) |

When a dedicated hostname or direct hash link is used, the prototype switcher UI is hidden (`directLink`). Sykdom og kritisk informasjon has its own dedicated Netlify site: `melodic-cobbler-ba99e4.netlify.app` (site id `c18ae988-3e38-4933-a1a8-83909dec5ff5`) — see [[project_helsenorge_prototypes]] memory for the deploy command. Legemiddelliste has its own dedicated Netlify site: `legemiddelliste.netlify.app` (site id `c158e569-8eaf-4f5c-94f6-df10738e1d06`, renamed from the auto-assigned `marvelous-torte-1933a7` in the dashboard 2026-07-16).

## Sykdom og kritisk informasjon
Built from the Obsidian vault spec `Helsenorge/Sykdom og kritisk info.md` and two Figma reference frames (empty state + populated state, file `rBG2uuoQ9iUoPGkpFvAr3f`). Redesigns the "data-heavy and confusing" current Kritisk informasjon view: categories **with** registrations render as full `Panel` cards (tags for gjeldende/avkreftet counts, description, a "Se detaljer" toggle); categories **without** registrations collapse into a plain `Expander` list under a "Sjekk om noe mangler..." heading, split into the same two groups as the Figma source. Ten fixed categories total (`data.ts`), two pre-populated for the demo (Legemiddelreaksjoner, Annet problem med anestesi). Category titles and descriptions come verbatim from the vault note's "Kategori-tekster" section (added 2026-07-15), not invented copy. A `Sykdomshistorikk` tab sits alongside `Kritisk informasjon` (reusing the self-registered illness list already shown in the `innstillinger` static prototype) since the Figma tab bar shows both, though only Kritisk informasjon had a design to implement.

**Empty vs. populated state:** these are two separate Figma frames, so each gets its own URL via an internal hash route rather than an in-page toggle — `#populert` (default) and `#tom`, handled inside `SykdomKritiskInfo` the same way `psykisk-helse` manages its own sub-view hashes (`window.location.hash` + a `hashchange` listener, independent of App.tsx's top-level prototype routing). On the dedicated site: `melodic-cobbler-ba99e4.netlify.app/#tom` for the empty state.

Open items from the vault spec not yet addressed in this build (still just todos in the note, no design exists for them yet): a "message your fastlege" feature.

## Legemiddelliste
Built from the Obsidian vault note `Helsenorge/Legemidler.md`. The note describes patient confusion between two overlapping-but-different services: **Resepter** (transactional — what can I pick up/refill at the pharmacy) and **Pasientens legemiddelliste/PLL** (clinical — what should I actually be taking, doctor-approved). Landing page (`#legemiddelliste`) uses the umbrella name from the note's "Design proposal" and reframes the choice as two plain-language questions instead of service jargon: "Hva kan jeg hente på apoteket?" → Resepter (`#resepter`) vs. "Hva skal jeg bruke, og hvordan?" → PLL (`#pll`).

Resepter view implements the specific UX wrinkle the note calls out: a "Vis kun aktive resepter" checkbox, unchecked by default, so "utekspederte" (used-up) prescriptions clutter the list until filtered — reproducing the real product's known tradeoff rather than hiding it.

**PLL view (2026-07-16 redesign):** the initial build was a flat mock; rebuilt to match a real reference design the user shared from Figma (file `UAhljteF5I4yI9lwrpxta7`, node `3393:7599` — "PLL_mobil_v3.0"). Content is now transcribed from that reference rather than invented: medications grouped "Disse tar du fast" / "Disse tar du ved behov" inside a gray card, each row showing Virkestoff (active ingredient), Sist utlevert (brand last dispensed), an indication tag (MOT EPILEPSI, BLODFORTYNNENDE, HJERTEMEDISIN, MOT SMERTER), dosage, and a MULTIDOSE badge where applicable; two collapsible sections below ("Avsluttet legemidler", "Legemiddelreaksjoner") each with a count badge, matching the reference's exact expand/collapse visual treatment (header darkens, body goes to a lighter gray, white content card inside). Header now also shows "Sist oppdatert [dato] av [lege]" per the reference.

`data.ts` was restructured so Resepter and PLL share one medication catalog instead of separate invented lists — the same patient's real medications (Lamotrigin, Rivaroksaban, Metoprolol, Kandesartan, Paracetamol, Valporinsyre) now appear consistently in both views. This replaced the earlier custom "discrepancy" warning box (Ibux, flagged inline with a cross-link) with a data-driven equivalent: Valporinsyre has an active, refillable resept in the Resepter view, but sits under "Avsluttet legemidler" in the PLL — the same conceptual-divide case as before, now demonstrated by the two real views actually disagreeing rather than a bespoke callout not grounded in any reference design. Still includes the "Send melding til fastlegen" CTA (mocked, no-op) per the note's third design idea.

Resepter view was lightly extended for consistency with the new PLL fidelity (added a Virkestoff line to each card) but has no Figma reference of its own yet.

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
