import { ProjectStateData } from "types/Project";
import { v4 as uuidv4 } from "uuid";

export const getDefaultProject = (): ProjectStateData => ({
  id: uuidv4(),
  elements: [],
  transform: {
    x: 0,
    y: 0,
    zoom: 1,
  },
});
