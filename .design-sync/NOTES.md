# @helsenorge/designsystem-react — design-sync notes

Package: `@helsenorge/designsystem-react@15.1.0`  
Last synced: 2026-06-18  
Project: https://claude.ai/design/p/70fb97fc-ae4d-4263-87b0-20447756b637  
Result: 83/83 components rendered clean, validate exit 0, 422 files uploaded.

Previous sync: 14.7.3 → 79 components.

---

## Package quirks

### lib/index.d.ts exports no components
`lib/index.d.ts` only exports hooks and utilities (useSize, useIsVisible, etc.), not the
PascalCase component names. The default heuristic (scan index.d.ts for exported interfaces)
finds ZERO_MATCH. Fix: full `componentSrcMap` in `design-sync.config.json` pointing each
component to its own subdirectory entry. See the config file for all 84 entries.

### Component entries ship uncompiled .scss
Every `lib/components/<Name>/index.js` does `import './styles.module.scss'` (and similar).
esbuild cannot process SCSS natively — bundling fails with a parse error.
Fix: forked `.design-sync/lib/bundle.mjs` adds a `scssStub` esbuild plugin that returns
a Proxy object for `.module.scss` and an empty string for plain `.scss`. Compiled CSS comes
from `lib/designsystem-react.css` (set as `cssEntry`).

### Barrel entry must live inside the package directory
When `--entry` is a path outside the package directory, `package-build.mjs` walks up from
the entry to find the nearest `package.json`, landing on `.ds-sync/package.json` instead of
the helsenorge package. Fix: barrel entry placed at:
`frankenstein/node_modules/@helsenorge/designsystem-react/ds-barrel.mjs`

### HelpDetails and MaxCharacters live in flat lib/ files
These two components have no `lib/components/<Name>/index.js`. They only exist as flat files:
- `lib/HelpDetails.js` — internal export `t`
- `lib/MaxCharacters.js` — internal export `t`

In `componentSrcMap`, the `.d.ts` paths are:
- `"HelpDetails": "lib/components/HelpDetails/HelpDetails.d.ts"` (there IS a subdir with .d.ts)
- `"MaxCharacters": "lib/components/MaxCharacters/MaxCharacters.d.ts"` (same)

In `ds-barrel.mjs`, they must use the internal alias:
```js
export { t as HelpDetails } from './lib/HelpDetails.js';
export { t as MaxCharacters } from './lib/MaxCharacters.js';
```

### Filter has no default export (compound namespace component)
`lib/components/Filter/index.js` exports a namespace of sub-components (Filter.List etc.)
but no default. `export { default as Filter }` fails at runtime with undefined.
Fix: use `export * from './lib/components/Filter/index.js'` in the barrel, then exclude
Filter from componentSrcMap with `null`.

### 5 excluded components (componentSrcMap: null)
- **Filter** — compound namespace, no default export (see above)
- **HelpBubble** — requires a `controllerRef` prop pointing to a live DOM element
- **Highlighter** — zero-size render with no required props discovered; unknown layout requirement
- **Illustration** — requires an explicit `illustrationComponent` class prop to render anything
- **PopMenu** — requires a `LinkList` as a child to render

### node_modules symlink for the forked bundle.mjs
`.design-sync/lib/bundle.mjs` imports `esbuild` which must resolve at runtime.
The fork has no adjacent `node_modules`, so a symlink is needed:
```
.design-sync/node_modules → ../.ds-sync/node_modules
```
This is already in place; don't delete it.

---

## New in 15.1.0
- Added: VisualCheckboxCloud, VisualCheckboxGroup, VisualRadioCloud, VisualRadioGroup
- New dirs present but excluded (null): Icons (1056 individual icon files), Illustrations (87 individual files), Mittens (CSS-only, no JS)
- HelpDetails/MaxCharacters flat-lib workaround unchanged — `t` export alias still correct in 15.x

## Re-sync command

```bash
node .ds-sync/package-build.mjs \
  --config design-sync.config.json \
  --node-modules frankenstein/node_modules \
  --entry frankenstein/node_modules/@helsenorge/designsystem-react/ds-barrel.mjs \
  --out ./ds-bundle
```

If the package version changes, check whether `HelpDetails.js` and `MaxCharacters.js` still
use the `t` export alias (it may change — inspect the file with grep), and update both the
barrel entry and componentSrcMap `.d.ts` paths if the directory structure shifts.
