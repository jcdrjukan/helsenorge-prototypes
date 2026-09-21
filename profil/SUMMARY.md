# Profil (→ now the "Innstillinger" prototype)

**Folder name is legacy** — it was originally added as the "Profil" prototype (`79615ba Add Profil prototype...`), but current content and active development (current branch: `innstillinger`) have repurposed it into the **Innstillinger (Settings)** hub. The `<title>` tag itself reads "Innstillinger – Helsenorge". Don't be misled by the directory name when navigating this repo.

## Structure
Single-page app with slide-navigation between screens (`id="screen-*"`):
- **`screen-settings`** — top-level Innstillinger menu: Kontaktopplysninger, Tilgjengelighet og kommunikasjon (incl. a tolk/interpreter language-search widget), Personverninnstillinger, Kjernejournal, Donorkort, Egne helsekontakter (with sample contact "Shasta Dawn"), Pårørende (Anne/Tora/Annike Hansen, relationships like Ektefelle/Datter), Endre samtykke for informasjonskapsler.
- **`screen-egenregistreringer`** — the current/refined Egenregistreringer flow (supersedes the standalone `egenregistreringer/` prototype), including expander list, a "tilg-" (tilgjengelighet) shared registration form, and a summary/read view.
- **`screen-okonomi`** — Refusjonskonto og utbetalinger (reimbursement account & payouts) section.

## Notes
- Single file, no build step; uses `hn-shell.css` for shared chrome.
- Recent commit history is entirely on this settings work: adding "Egne helsekontakter", refining Egenregistreringer subtitle/preamble text, tolk widget styling, PlusLarge icon on Registrer buttons.

#helsenorge
