import React, { useCallback, useMemo, useState } from "react";
import { NodeProps } from "react-flow-renderer";
import { useAudioContext } from "../../hooks/state/useAudioContext";
import Node from "../../components/Node";
import useWaveShaperNode from "../../hooks/nodes/useWaveShaperNode";

// See: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode#Example
const distortion = `const k = 50;
const samples = curve.length;
const deg = Math.PI / 180;
for (let i = 0; i < samples; i++) {
  const x = (i * 2) / samples - 1;
  curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
}
return curve;`;

function WaveShaper({ data, id, selected, type }: NodeProps) {
  const { onChange, oversample } = data;
  const [curveFn, setCurveFn] = useState(data.curveFn ?? distortion);
  const [lastValidCurveFn, setLastValidCurveFn] = useState(curveFn);

  const { audioContext } = useAudioContext();
  const curve = useMemo(() => {
    const curve = new Float32Array(audioContext.sampleRate);
    // eslint-disable-next-line no-new-func
    return new Function("curve", lastValidCurveFn)(curve);
  }, [audioContext.sampleRate, lastValidCurveFn]);

  // AudioNode
  useWaveShaperNode(id, { curve, oversample });

  const updateCurve = useCallback(() => {
    try {
      // eslint-disable-next-line no-new-func
      new Function("curve", curveFn)(new Float32Array(audioContext.sampleRate));

      setLastValidCurveFn(curveFn);
      onChange({ curveFn });
    } catch (e) {
      console.error(e);
    }
  }, [audioContext.sampleRate, curveFn, onChange]);

  return (
    <Node id={id} inputs={["input"]} outputs={["output"]} type={type}>
      {selected && (
        <div className="customNode_editor nodrag">
          <div className="customNode_item" style={{ flexWrap: "wrap" }}>
            <textarea
              onChange={e => setCurveFn(e.target.value)}
              rows={8}
              style={{ width: "100%" }}
              title="Curve function"
              value={curveFn}
            />
            <button onClick={updateCurve}>save</button>
          </div>
          <div className="customNode_item">
            <select
              onChange={e => onChange({ oversample: e.target.value })}
              title="Oversample"
              value={oversample}
            >
              <option value="none">none</option>
              <option value="2x">2x</option>
              <option value="4x">4x</option>
            </select>
          </div>
        </div>
      )}
    </Node>
  );
}

export default React.memo(WaveShaper);
