/**
 * Sound Player Module
 *
 * Handles audio feedback for user interactions using HTML5 Audio API.
 * Designed for child-friendly applications with appropriate volume levels.
 */

let successAudio: HTMLAudioElement | null = null;
let isAudioContextUnlocked = false;

/**
 * Unlocks the AudioContext on first user interaction
 * Required for browsers with autoplay restrictions
 */
function unlockAudioContext(): void {
  if (isAudioContextUnlocked) return;

  // Create a silent audio element to unlock audio on mobile browsers
  const silentAudio = new Audio();
  silentAudio
    .play()
    .then(() => {
      isAudioContextUnlocked = true;
      silentAudio.pause();
      silentAudio.currentTime = 0;
    })
    .catch(() => {
      // Audio might be blocked, will retry on next user interaction
      isAudioContextUnlocked = false;
    });
}

/**
 * Preloads audio files for instant playback
 * Call this early in app initialization, ideally on first user interaction
 */
export function preloadSounds(): void {
  if (successAudio) return; // Already preloaded

  try {
    successAudio = new Audio('/sounds/success.mp3');
    successAudio.volume = 0.5; // Child-friendly volume level
    successAudio.preload = 'auto'; // Preload for instant playback

    // Attempt to unlock audio context
    unlockAudioContext();
  } catch (error) {
    console.warn('Failed to preload success sound:', error);
  }
}

/**
 * Plays the success sound effect
 *
 * Automatically handles:
 * - Autoplay restrictions (unlocks audio on first play)
 * - Sound replay (resets to beginning)
 * - Initialization if not preloaded
 *
 * @returns Promise that resolves when sound starts playing
 */
export async function playSuccessSound(): Promise<void> {
  // Initialize audio if not preloaded
  if (!successAudio) {
    preloadSounds();
    if (!successAudio) {
      console.warn('Failed to initialize success sound');
      return;
    }
  }

  try {
    // Reset to beginning for replay
    successAudio.currentTime = 0;

    // Ensure audio context is unlocked
    if (!isAudioContextUnlocked) {
      unlockAudioContext();
    }

    // Play the sound
    await successAudio.play();
  } catch (error) {
    // Handle autoplay restrictions or other errors
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        console.warn(
          'Audio playback blocked by browser. Requires user interaction first.'
        );
      } else {
        console.warn('Failed to play success sound:', error.message);
      }
    } else {
      console.warn('Failed to play success sound:', error);
    }
  }
}

/**
 * Clean up audio resources
 * Call this when shutting down the app or component
 */
export function cleanupSounds(): void {
  if (successAudio) {
    successAudio.pause();
    successAudio.currentTime = 0;
    successAudio = null;
    isAudioContextUnlocked = false;
  }
}
