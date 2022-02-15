import React, { useEffect, useState } from "react";
import { NodeProps } from "react-flow-renderer";
import Node from "components/Node";
import { useNode } from "context/NodeContext";
import { getMedia } from "../../utils/getMedia";
// import { AudioBufferSourceNode } from "utils/audioContext";

function AudioDeviceSource({ id, type, selected }: NodeProps) {
  // const activeBufferSource = useRef<AudioBufferSourceNode>();

  const [devices, setDevices] = useState<Array<any>>([]);
  const [clientDevice, setClientDevice] = useState(null);
  const [label, setLabel] = useState();
  const node = useNode(id, context => context.createGain());

  let s: any;

  const play = () => {
    console.log(clientDevice);
    getMedia(clientDevice).then((stream: any) => {
      s = stream;
      const source = node.context.createMediaStreamSource(stream);
      source.connect(node);
    });
  };
  const stop = () => {
    if (node.context) {
      s.getTracks().forEach((track: any) => track.stop());
      node.context.close();
      window.location.reload();
    }
  };

  useEffect(() => {
    if (clientDevice) {
      setLabel(clientDevice["label"]);
    }
  }, [clientDevice]);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (dev) {
        dev.length && setDevices(dev.filter(d => d.kind === "audioinput"));
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }, []);

  console.log(devices);
  return (
    <Node id={id} outputs={["output"]} type={type} title={`Source: AudioDevice`}>
      <div className="customNode_editor nodrag">
        <div className="customNode_item">
          <button onClick={() => play()}>▶</button>
          <button onClick={() => stop()}>◽</button>
        </div>
      </div>
      {selected && devices.length > 0 && (
        <select
          value={label}
          onChange={e => setClientDevice(devices.find(d => d.label === e.target.value))}
        >
          {devices && devices.map((d, i) => <option key={i}>{d.label}</option>)}
        </select>
      )}
    </Node>
  );
}

export default React.memo(AudioDeviceSource);
