import { useState, useRef, useCallback } from 'react';
import { registerAudio, unregisterAudio } from '@/lib/audioManager';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string, id: string) => {
    // If same audio is playing, pause it
    if (currentAudioId === id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setCurrentAudioId(null);
      if (audioRef.current) unregisterAudio(audioRef.current);
      return;
    }

    // Stop any currently playing audio (including from other components)
    if (audioRef.current) {
      audioRef.current.pause();
      unregisterAudio(audioRef.current);
    }

    // Create new audio element
    audioRef.current = new Audio(audioUrl);
    audioRef.current.onended = () => {
      setIsPlaying(false);
      setCurrentAudioId(null);
    };
    audioRef.current.onerror = () => {
      setIsPlaying(false);
      setCurrentAudioId(null);
      console.error('Error playing audio');
    };

    // Register with global manager (stops other audio)
    registerAudio(audioRef.current, () => {
      setIsPlaying(false);
      setCurrentAudioId(null);
    });

    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setCurrentAudioId(id);
    }).catch((error) => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    });
  }, [currentAudioId, isPlaying]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      unregisterAudio(audioRef.current);
    }
    setIsPlaying(false);
    setCurrentAudioId(null);
  }, []);

  return {
    isPlaying,
    currentAudioId,
    playAudio,
    stopAudio,
  };
}
