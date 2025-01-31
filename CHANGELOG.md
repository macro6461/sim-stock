# Changelog

This file tracks released versions with the changes made to this project.

## Version 1.0.6

### Added

- `ChatWindow` to be used with WebSockets backend.
- Added support for `email` in `User` instantion (deriving `username` from `email`).
- Returning `user` object from backend instead of just `username`.

## Version 1.0.5

### Added

- Added Google OAuth as a login using `'@react-oauth/google'`.
- Added `googleAuthLogin` to the `authAtom.ts` atom.
- Added `googleAuthLoginOrRegister` to manage the Google OAuth request to the backend in `authApi.tsx`.
- Added `header` prop for form component.

### Changed

- Renamed `MyForm` to `LogInRegisterForm`.
- Moved `LogInRegisterForm` into the `components/auth` directory.
- Removed `Login` and `Register` components.

## Version 1.0.4

### Added

- Moved `loginOrRegister` API request into `authApi.tsx` and `authAtom.ts` and moved out of components.
- Returning `username` when verifying JWT token and when logging in.
- Improved error handling.

## Version 1.0.3

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
