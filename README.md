# zag-native

Cross-platform UI components built with [Zag.js](https://zagjs.com) state machines and
[React Strict DOM](https://facebook.github.io/react-strict-dom/), running on iOS, Android,
and web from a single codebase via [Expo](https://expo.dev).

Zag.js provides framework-agnostic, accessible component logic. React Strict DOM lets the
same `html.*` / `css` markup render natively on mobile and as real DOM on web — so one
component implementation works everywhere.

## Components

`accordion` · `button` · `date-picker` · `dialog` · `number-input` · `popover` ·
`progress` · `slider` · `switch`

See them all in the showcase screen at [`app/index.tsx`](app/index.tsx).

## Getting started

```bash
pnpm install

pnpm start      # start the Expo dev server
pnpm ios        # run on iOS simulator
pnpm android    # run on Android emulator
pnpm web        # run in the browser
```

## Project structure

```
app/          Expo Router screens (showcase entry point)
components/   Zag.js + React Strict DOM components
hooks/        Shared React hooks
utils/        Helpers, incl. zag-to-react-strict-dom prop adapter
constants/    Theme and shared constants
```

The key glue is [`utils/zag-to-react-strict-dom.ts`](utils/zag-to-react-strict-dom.ts),
which adapts the props Zag.js emits into ones React Strict DOM accepts across platforms.

## Scripts

| Command       | Description               |
| ------------- | ------------------------- |
| `pnpm start`  | Start the Expo dev server |
| `pnpm lint`   | Run ESLint                |
| `pnpm format` | Format with Prettier      |

## License

[MIT](LICENSE)
