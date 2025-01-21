# Changelog

This file tracks released versions with the changes made to this project.

## Version 1.0.1

### Added

- Replaced `redux` with `jotai`.
- Added data sanitization for stocks response.
  - Removing characters like `"01. "` from results.
  - Converting response stock objects to `StockData` types.

## Version 1.0.0

### Added

- First release!
