// import * as sac from "standardized-audio-context";
import create from "zustand";
import { AudioContext } from "utils/audioContext";

type AudioContextStore = {
  audioContext: AudioContext;
};

export const useAudioContext = create<AudioContextStore>(() => ({
  audioContext: new AudioContext(),
}));
