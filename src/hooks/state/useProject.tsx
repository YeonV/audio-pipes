import { getDefaultProject } from "utils/defaultProject";
import create from "zustand";
import { ElementId, Elements, FlowElement, FlowTransform, isNode } from "react-flow-renderer";
import { ProjectStateData } from "types/Project";
import { persist } from "zustand/middleware";
import { storage } from "utils/storage";

export type ProjectState = ProjectStateData & {
  set: (data: ProjectStateData) => void;
  setElements: (elements: Elements) => void;
  addElement: (element: FlowElement) => void;
  setId: (ElementId: string) => void;
  setTransform: (transform: FlowTransform) => void;
  clear: () => void;
  onChangeElementFactory: (id: ElementId) => (data: Record<string, any>) => void;
};

const defaultProject = getDefaultProject();

export const useProject = create<ProjectState>(
  persist(
    (set, get) => ({
      elements: defaultProject.elements,
      id: defaultProject.id,
      transform: defaultProject.transform,
      set: data => void set(state => ({ ...state, ...data })),
      setElements: elements => {
        set(state => ({ ...state, elements }));
      },
      addElement: element =>
        set(state => ({
          ...state,
          elements: [...state.elements, element],
        })),
      setId: id => set(state => ({ ...state, id })),
      setTransform: transform =>
        set(state => ({
          ...state,
          transform,
        })),
      clear: () => {
        set(state => ({ ...state, ...defaultProject }));
      },
      onChangeElementFactory: (id: string) => (data: Record<string, any>) => {
        get().setElements(
          get().elements.map(element => {
            if (isNode(element) && element.id === id) {
              return { ...element, data: { ...element.data, ...data } };
            }
            return element;
          })
        );
      },
    }),
    {
      name: "project-storage", // unique name
      getStorage: () => storage,
    }
  )
);
