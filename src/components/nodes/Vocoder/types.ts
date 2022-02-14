import { TBiquadFilterType } from "utils/audioContext";

export interface FilterDescription {
  hz: number;
  type: TBiquadFilterType;
  gainDb: number;
  q: number;
}

export interface BandResponse {
  frequencies: Float32Array;
  magResponse: Float32Array;
  phaseResponse: Float32Array;
}

export interface BandStyle {
  freqColor: string;
  responseColor: string;
}
