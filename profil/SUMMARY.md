# Profil (→ now the "Innstillinger" prototype)

**Folder name is legacy** — it was originally added as the "Profil" prototype (`79615ba Add Profil prototype...`), but current content and active development (current branch: `innstillinger`) have repurposed it into the **Innstillinger (Settings)** hub. The `<title>` tag itself reads "Innstillinger – Helsenorge". Don't be misled by the directory name when navigating this repo.

## Structure
Single-page app with slide-navigation between screens (`id="screen-*"`):
- **`screen-settings`** — top-level Innstillinger menu, in order: Helsenorge for deg, Kontaktopplysninger, Varsler, Egenregistreringer, Personverninnstillinger i helsesektoren, Tjenester du har brukt, Få hjelp fra pårørende, Økonomi, Inn- og utlogging. Below that, a secondary "Lurer du på noe annet?" list (Tilgjengelighetserklæring, Endre samtykke for informasjonskapsler, Personvernerklæring, Kontakt oss) and Logg ut.
- **`screen-egenregistreringer`** — the current/refined Egenregistreringer flow (supersedes the standalone `egenregistreringer/` prototype): Pårørende (Anne/Tora/Annike Hansen, relationships like Ektefelle/Datter), Egne helsekontakter (sample contact "Shasta Dawn"), Egenregistrert sykdomshistorikk, Tilgjengelighet og kommunikasjon (incl. a tolk/interpreter language-search widget), Donorkort.
- **`screen-okonomi`** — Refusjonskonto og utbetalinger (reimbursement account & payouts) section.

## Notes
- Single file, no build step; uses `hn-shell.css` for shared chrome.
- Menu was reworked 2026-09-21: dropped the "Velg språk" entry (no longer relevant), added a new "Tjenester du har brukt" entry (visibility into services used and external tool/app data-sharing permissions) directly below Kontaktopplysninger, and reordered the full top-level list to the sequence shown above.

#helsenorge
