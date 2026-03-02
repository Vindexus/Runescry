# Runescry

A Diablo II runeword search tool. Filter and explore runewords by runes, base item type, tags, and more.

**Live site:** https://vindexus.github.io/Runescry/

## Search Syntax

| Filter | Description | Examples |
|--------|-------------|---------|
| keyword | Match name, runes, or attributes | `teleport`, `conviction` |
| rune name | Find runewords containing a rune | `jah`, `ber` |
| `base:` | Filter by item type | `base:sword`, `base:melee`, `base:shield` |
| `os:` | Filter by number of runes | `os:4`, `os>=3`, `os<=2` |
| `has:` | Filter by attribute tag | `has:fcr`, `has:ias`, `has:aura`, `has:mf` |
| `ladder` / `rotw` | Filter by flag | `ladder`, `rotw` |
| `-` prefix | Negate any filter | `-jah`, `-ladder`, `-base:sword` |
| `or` | Either condition | `(ber or jah) base:armor` |

Base categories expand automatically — `base:melee` matches swords, axes, polearms, etc. `base:weapon` matches all weapon types.

## Development

```bash
npm install
npm run dev
```

## Stack

- React 19 + TypeScript
- Vite
- nuqs (URL query state)
