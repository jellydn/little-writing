/**
 * Sound Player Module
 *
 * Handles audio feedback for user interactions using Web Audio API.
 * Designed for child-friendly applications with appropriate volume levels.
 *
 * Uses Web Audio API with fetch to load audio files.
 * Compatible with Capacitor iOS by using protocol-relative URLs.
 */

let audioContext: AudioContext | null = null;
let successBuffer: AudioBuffer | null = null;
let isLoaded = false;

// Use relative path that works in both web and Capacitor
const SUCCESS_SOUND_PATH = "./sounds/success.mp3";

/**
 * Gets or creates the AudioContext
 */
function getAudioContext(): AudioContext | null {
	if (audioContext) return audioContext;

	try {
		audioContext = new (
			window.AudioContext ||
			// @ts-expect-error - webkitAudioContext is Safari-specific
			window.webkitAudioContext
		)();
		return audioContext;
	} catch {
		return null;
	}
}

/**
 * Loads the success sound into an AudioBuffer
 */
async function loadSuccessSound(): Promise<AudioBuffer | null> {
	if (successBuffer) return successBuffer;

	const ctx = getAudioContext();
	if (!ctx) return null;

	try {
		// Use XMLHttpRequest instead of fetch for better Capacitor compatibility
		const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", SUCCESS_SOUND_PATH, true);
			xhr.responseType = "arraybuffer";

			xhr.onload = () => {
				if (xhr.status === 200 || xhr.status === 0) {
					resolve(xhr.response);
				} else {
					reject(new Error(`Failed to load sound: ${xhr.status}`));
				}
			};

			xhr.onerror = () => {
				reject(new Error("Failed to load sound"));
			};

			xhr.send();
		});

		successBuffer = await ctx.decodeAudioData(arrayBuffer);
		isLoaded = true;
		return successBuffer;
	} catch (error) {
		console.warn("Failed to load success sound:", error);
		return null;
	}
}

/**
 * Preloads audio files for instant playback
 * Call this early in app initialization, ideally on first user interaction
 */
export async function preloadSounds(): Promise<void> {
	if (isLoaded) return;
	await loadSuccessSound();
}

/**
 * Unlocks the AudioContext on first user interaction
 * Required for iOS which suspends audio context until user interaction
 */
function unlockAudioContext(): void {
	const ctx = getAudioContext();
	if (!ctx) return;

	if (ctx.state === "suspended") {
		ctx.resume().catch(() => {
			// Ignore errors, will retry on next interaction
		});
	}
}

/**
 * Plays the success sound effect
 *
 * Automatically handles:
 * - Autoplay restrictions (unlocks audio on first play)
 * - Sound replay (creates new buffer source each time)
 * - Initialization if not preloaded
 *
 * @returns Promise that resolves when sound starts playing
 */
export async function playSuccessSound(): Promise<void> {
	// Ensure audio context is unlocked (important for iOS)
	unlockAudioContext();

	const ctx = getAudioContext();
	if (!ctx) {
		console.warn("Web Audio API not supported");
		return;
	}

	// Load sound if not already loaded
	const buffer = await loadSuccessSound();
	if (!buffer) {
		console.warn("Success sound not loaded");
		return;
	}

	try {
		// Create a new buffer source for each playback
		const source = ctx.createBufferSource();
		source.buffer = buffer;

		// Create gain node for volume control
		const gainNode = ctx.createGain();
		gainNode.gain.value = 0.5; // Child-friendly volume level

		// Connect: source -> gain -> destination
		source.connect(gainNode);
		gainNode.connect(ctx.destination);

		// Play the sound
		source.start(0);
	} catch (error) {
		console.warn("Failed to play success sound:", error);
	}
}

/**
 * Clean up audio resources
 * Call this when shutting down the app or component
 */
export function cleanupSounds(): void {
	if (audioContext) {
		audioContext.close().catch(() => {
			// Ignore close errors
		});
		audioContext = null;
	}
	successBuffer = null;
	isLoaded = false;
}
