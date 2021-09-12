# Ionic Native Inspector

## Building

1. clone this repo and cd into it
1. `npm ci`
1. `npm run build`

This creates a `check.js` file.

## Running

- `node check`
- `npm run test`


## Builds
Build for xcode:
// Search for .xcworkspace files
// List schemes
// Build all schemes
xcodebuild -workspace App.xcworkspace -scheme App -showdestinations
xcodebuild -workspace App.xcworkspace -scheme App -destination "platform=iOS Simulator,id=4C837354-BE2D-4092-A4D4-3BC13405175B"  