import { ElementId, Elements, FlowTransform } from "react-flow-renderer";

export type ProjectStateData = {
  id: ElementId;
  elements: Elements;
  transform: FlowTransform;
};
