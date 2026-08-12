# CHANGELOG 0.0.2

## 0.0.2

### Added

- Added runtime i18n with a language switcher (Traditional Chinese and English).
- Added a bottom-image URL input so users can load base photos without uploading files.
- Added URL parameter support for preloading images via `frame` and `photo`.
- Added `fated_finds=true` flow to resolve `photo` values through the remote resolver endpoint.
- Added a quick action button to apply the bundled default frame (`assets/frame.png`).
- Added a reset scale and center control for the bottom image; loading a new bottom image also resets scale to 100% and centers the image.

### Changed

- Enhanced drop-zone status feedback to show whether the bottom image came from file upload, browser storage, URL input, or query parameters.
- Refactored image-loading and settings-application flow to keep canvas state updates consistent across upload, URL input, and query-parameter paths.
- Expanded UI layout/styles to support a top-bar language selector and quick-frame action.

### Documentation

- Updated README files to document multilingual UI, URL parameter workflow, and Fated Finds integration.
