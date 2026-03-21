# Sound Assets

This directory contains audio files for the Little Writing app.

## Required Sounds

### success.mp3

A cheerful, child-friendly success sound played when a character is traced correctly.

**Recommended sources:**

- [Freesound.org](https://freesound.org/) - Search for "success chime" or "positive ding"
- [Zapsplat.com](https://www.zapsplat.com/) - Free sound effects library
- Create your own using online tools like [SFXR](https://sfxr.me/)

**Specifications:**

- Format: MP3
- Duration: 1-2 seconds
- Style: Cheerful, encouraging, not too loud
- Volume: Already normalized to 50% in code

## How to Add

1. Download or create a suitable sound effect
2. Place it in this directory as `success.mp3`
3. The app will automatically load it from `/sounds/success.mp3`

## Current Implementation

The `soundPlayer.ts` module handles:

- Preloading on first user interaction
- Browser autoplay restrictions
- Volume management (set to 50%)
- Replay support
