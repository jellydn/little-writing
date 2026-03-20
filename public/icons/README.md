# App Icons

This directory should contain app icons for the Handwriting Tracing App.

## Required Icons for Capacitor iOS

Capacitor requires icons in multiple sizes. Place icons here or in the root public/ directory:

- icon.png - Main app icon (1024x1024 recommended)
- favicon.ico - Browser favicon (32x32)

## iOS Icon Sizes

When building for iOS, Capacitor will automatically generate:

- iPhone App Icon 60x60 (1x, 2x, 3x)
- iPad App Icon 76x76 (1x, 2x)
- iPad Pro App Icon 83.5x83.5 (2x)
- iOS App Store Icon 1024x1024

## Adding Icons

1. Create a 1024x1024 PNG icon for your app
2. Place it here as `icon.png`
3. Run `npx cap sync ios` to update iOS project
4. Or place in `public/` root and update `capacitor.config.ts`

## Tools

- Canva: https://www.canva.com/ (free icon templates)
- Figma: https://www.figma.com/ (design tool)
- AppIconGenerator: https://appicon.co/ (generates all sizes from one image)

## Design Guidelines

- Child-friendly, colorful design
- Simple, recognizable shape (letter, pencil, star)
- No text (scales poorly)
- High contrast for visibility
