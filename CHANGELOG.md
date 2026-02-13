# Changelog

## [1.1.0] - 2026-02-13

### Changed
- Updated Node.js runtime from `node12` to `node20` (fixes deprecation warnings)
- Removed dependency on `@actions-rs/core` which required private GitHub registry access
- Simplified implementation by using `@actions/core` and `@actions/exec` directly
- Updated all dependencies to latest versions

### Fixed
- Fixed CI/CD workflow that was failing due to npm registry authentication issues
- Removed deprecated `::add-matcher::` command
- Migrated ESLint configuration to v9 format
- Removed private npm registry configuration

### Technical Details
- Replaced `@actions-rs/core` with native `@actions/exec`
- Updated `@zeit/ncc` to `@vercel/ncc`
- Updated TypeScript to 5.7.2
- Migrated from `.eslintrc.json` to `eslint.config.mjs`
- Updated `package.json` dependencies and devDependencies

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2019-11-24

### Fixed

- Rustup installer for Windows VMs is downloaded via HTTPS

## [1.0.2] - 2019-11-09

### Added

- Problem matcher which will highlight warnings and errors in the cargo output

### Changed

- Use `@action-rs/core` package for cargo/cross execution

## [1.0.1] - 2019-09-15

### Added

- First public version
