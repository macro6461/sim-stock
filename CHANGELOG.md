# Changelog

This file tracks released versions with the changes made to this project.

## Version 1.0.4

### Added

- Added authentication logic to coincide with MongoDB backend.
- Added authAtom store and logic.
- Added new `MyForm` component which can be interchanged between Registering and Logging in.
- Added `authApi` to handle authentication API requests. So far just verifying token but will move more into it.
- Added robust routing and protected routing for via `AuthProvider` and `react-router-dom`.
- Added a `Header` component to be used for navigation and logging out.
- Added `SavedSims` component which will be used for saved simulations (TO DO).

## Version 1.0.2

### Added

- Adding allocation table and allocation calculation logic.

## Version 1.0.1

### Added

- Replaced `redux` with `jotai`.
- Added data sanitization for stocks response.
  - Removing characters like `"01. "` from results.
  - Converting response stock objects to `StockData` types.

## Version 1.0.0

### Added

- First release!
