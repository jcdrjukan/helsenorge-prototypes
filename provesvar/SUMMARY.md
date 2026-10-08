# Prøvesvar

Static HTML prototype for the Helsenorge **Prøvesvar** (test results) service. Started 2026-10-08 as an empty shell; content will be built up partly from Figma.

## Current state
- `index.html`: the Helsenorge chrome only: header with profile bar, "Forside" breadcrumb (goes nowhere yet), Språk/Language switcher, the title "Prøvesvar", a placeholder ingress ("Her finner du svar på prøver og undersøkelser du har tatt hos fastlegen, på sykehuset eller andre steder."), the black footer, and the desktop phone frame.
- The chrome and design tokens are copied from `gravid/avslutt.html`. No shared CSS with other prototypes.
- `favicon.svg` copied from `prover-og-undersokelser/` ("P" on blueberry).
- Not deployed yet (no Netlify site).

## Related
- `prover-og-undersokelser/`: the older static "Prøver og undersøkelser" prototype (results + requisitions); the root of the Førstegangsvarsel prototypes.
- Research in the vault: Førstegangsvarsel brukertest 1 and 2 (users go straight for their results and overlook info messages; clear reference ranges and graphs helped understanding), and Måledata (for Prøvesvar, open with one series and make comparison a deliberate act; reference bands come from the record, never invented).
