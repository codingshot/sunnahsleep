// Global audio manager to ensure only one audio plays at a time
let currentAudio: HTMLAudioElement | null = null;
let onStopCallback: (() => void) | null = null;

export function registerAudio(audio: HTMLAudioElement, onStop?: () => void) {
  // Stop any currently playing audio
  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    onStopCallback?.();
  }
  currentAudio = audio;
  onStopCallback = onStop || null;
}

export function unregisterAudio(audio: HTMLAudioElement) {
  if (currentAudio === audio) {
    currentAudio = null;
    onStopCallback = null;
  }
}

export function stopAllAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    onStopCallback?.();
    currentAudio = null;
    onStopCallback = null;
  }
}
