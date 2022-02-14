import NumericStepper from "components/controls/NumericStepper";
import React, { useCallback } from "react";
import { dbToFloat32, float32toDb } from "utils/units";
import { BandStyle, FilterDescription } from "./types";

type GainChangeHandler = (gain: number) => void;
type QChangeHandler = (q: number) => void;

interface Props {
  bandStyle: BandStyle;
  filterDesc: FilterDescription;
  onGainChange: GainChangeHandler;
  onQChange: QChangeHandler;
}

export function BandStrip({ filterDesc, bandStyle, onGainChange, onQChange }: Props) {
  const gainHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onGainChange(float32toDb(e.target.valueAsNumber));
    },
    [onGainChange]
  );

  return (
    <div className="vocoderNode_bandStrip">
      <div className="centerHz">{filterDesc.hz}</div>
      <div className="colorSwatch" style={{ background: bandStyle.freqColor }}></div>
      <input
        type="range"
        onChange={gainHandler}
        value={dbToFloat32(filterDesc.gainDb)}
        max={3}
        min={0.0001}
        step={0.001}
      />
      <NumericStepper value={filterDesc.q} min={0} max={60} onChange={onQChange} />
    </div>
  );
}
