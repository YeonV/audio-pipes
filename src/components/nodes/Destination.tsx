import React, { useEffect, useState } from "react";
import { NodeProps } from "react-flow-renderer";
import Node from "components/Node";
import useDestinationNode from "hooks/nodes/useDestinationNode";

function Destination({ id, type, selected }: NodeProps) {
  useDestinationNode(id);
  const [devices, setDevices] = useState<Array<any>>([]);
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (dev) {
        dev.length && setDevices(dev.filter(d => d.kind === "audiooutput"));
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }, []);

  return (
    <Node id={id} inputs={["input"]} type={type} title={`Destination: Audio Device`}>
      {selected && devices.length > 0 && (
        <select>{devices && devices.map(d => <option>{d.label}</option>)}</select>
      )}
    </Node>
  );
}

export default React.memo(Destination);
