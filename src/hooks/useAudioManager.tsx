import { createContext, useContext, useEffect, useRef, useState } from "react";

type AudioManager = {
  playAudio: (file: string, force?: boolean) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
};

const AudioManagerContext = createContext<AudioManager | null>(null);

export const AudioManagerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const lastAudioPlayed = useRef(new Date().getTime());
  const playAudio = (file: string, force = false) => {
    if (!audioEnabled) {
      return;
    }
    if (!force && new Date().getTime() - lastAudioPlayed.current < 100) {
      return;
    }
    lastAudioPlayed.current = new Date().getTime();
    const audio = new Audio(`/audios/${file}.mp3`);
    audio.play();
  };

  const bgAudio = useRef(new Audio("/audios/bg.mp3"));

  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    if (audioEnabled) {
      bgAudio.current.play();
      bgAudio.current.loop = true;
    } else {
      bgAudio.current.pause();
    }
  }, [audioEnabled]);

  return (
    <AudioManagerContext.Provider
      value={{ playAudio, audioEnabled, setAudioEnabled }}
    >
      {children}
    </AudioManagerContext.Provider>
  );
};

export const useAudioManager = () => {
  const audioManager = useContext(AudioManagerContext);
  if (!audioManager) {
    throw new Error(
      "useAudioManager must be used within a AudioManagerProvider"
    );
  }
  return audioManager;
};
