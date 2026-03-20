# Sounds Directory

Place audio files for the handwriting tracing app in this directory.

## Required Files

- `success.mp3` - Success sound effect played when a child completes a tracing exercise

## Audio Guidelines

- **Format**: MP3
- **Duration**: 1-2 seconds (short and pleasant)
- **Volume**: The app sets volume to 0.5 (50%) to be child-friendly
- **Style**: Cheerful, encouraging, and appropriate for young children
- **File Size**: Keep small for quick loading (<50KB recommended)

## Usage

The sound is played automatically through the `playSuccessSound()` function in:
`src/lib/feedback/soundPlayer.ts`
