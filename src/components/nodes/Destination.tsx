import React, {useState} from "react";
import { NodeProps } from "react-flow-renderer";
import Node from "components/Node";
import useDestinationNode from "hooks/nodes/useDestinationNode";

function Destination({ id, type, selected }: NodeProps) {
  useDestinationNode(id);
  const [devices, setDevices]=useState<Array<any>>([])
  navigator.mediaDevices.enumerateDevices()
  .then(function (dev) {
    setDevices(dev.filter(d=>d.kind === 'audiooutput'))
  })
  .catch(function (err) {
    console.log(err.name + ": " + err.message);
  });
  return <Node id={id} inputs={["input"]} type={type} >
    {selected && <select>
      {devices && devices.map(d=><option>{d.label}</option>)}
    </select>}
    </Node>
    ;
}

export default React.memo(Destination);
