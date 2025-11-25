# Affirmania

> **"The single greatest misuse of software engineering talent since
> blockchain smoothies."**

Affirmania is a tiny, tongue-in-cheek affirmation app built with Expo &
React Native.\
Pick your **validation tier**, tap **Validate Me!**, and receive the
level of emotional nonsense you truly deserve.

------------------------------------------------------------------------

## Features

-   🎯 Three *scientifically* dubious validation tiers:
   -   **Mildly Noticed**
   -   **Hyper Esteem**
   -   **Delusional Greatness**
-   💬 Hard-coded affirmations with unapologetically unserious tone
-   🎨 Playful UI with cartoonish typography and warm mustard background
-   📱 Works on iOS, Android and web via Expo

------------------------------------------------------------------------

## Tech Stack

-   [Expo](https://expo.dev/) (managed workflow)
-   [React Native](https://reactnative.dev/)
-   [Expo Router](https://expo.github.io/router/)
-   Custom fonts loaded with `expo-font`

------------------------------------------------------------------------

## Getting Started

### Prerequisites

-   **Node.js** ≥ 18
-   **npm** or **yarn**
-   **Expo CLI** (optional)
-   For iOS: Xcode + iOS Simulator\
-   For Android: Android Studio or device

### Install dependencies

``` bash
npm install
```

### Run the app

``` bash
npx expo start
```

------------------------------------------------------------------------

## Project Structure

``` text
affirmania/
  app/
    _layout.tsx
    index.tsx
  src/
    components/
      TierSelector.tsx
    data/
      validationTiers.ts
  assets/
    fonts/
      Baloo2-Bold.ttf
  app.json
  package.json
  tsconfig.json
  README.md
```

------------------------------------------------------------------------

## Customization

### Edit affirmations

Edit `src/data/validationTiers.ts`.

### Change styles

-   Background → `index.tsx`
-   Logo font → `_layout.tsx`
-   Tier buttons → `TierSelector.tsx`

------------------------------------------------------------------------

## Credits

™️ 2025 **Affirmania**\
No emotions were harmed in the making of this app.
