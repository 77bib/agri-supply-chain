# Internationalization (fr/ar)

This app now supports French and Arabic. English is not used.

## How it works
- We use a lightweight i18n provider (`lib/i18n.tsx`) and JSON dictionaries in `locales/`.
- Locale is stored in a `locale` cookie (default `fr`). Middleware ensures it exists on first request.
- The `<html>` `lang` and `dir` attributes update automatically (`ar` uses `dir="rtl"`).
- A floating language switcher appears in the bottom-right; you can move it into your header.

## Files
- `locales/fr.json`, `locales/ar.json` — translation dictionaries.
- `lib/i18n.tsx` — React client provider and `useI18n()` hook with `t(key, vars)`.
- `lib/i18n-server.ts` — server helper used in `app/layout.tsx` to load initial messages.
- `app/layout.tsx` — wraps the app with `I18nProvider` and sets `lang/dir`.
- `components/language-switcher.tsx` — UI to toggle languages.
- `middleware.ts` — ensures the `locale` cookie is always set.

## Usage in components
```tsx
"use client"
import { useI18n } from "@/lib/i18n"

export function MyComponent() {
  const { t } = useI18n()
  return <h1>{t("site.title")}</h1>
}
```

For variables:
```tsx
{t('hero.welcome', { name: user.name })}
```

## Adding new strings
1. Add a key to both `locales/fr.json` and `locales/ar.json` with the translated values.
2. Use `t('your.key')` in your components.

## Notes
- To translate all pages, replace hard-coded English strings incrementally with `t()`.
- If you want URL prefixes (`/fr` and `/ar`) later, we can migrate to a locale segment or `next-intl` with minimal changes.
