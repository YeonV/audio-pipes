import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { Elements, FlowTransform } from "react-flow-renderer";
import { v4 as uuidv4 } from "uuid";
import { useProject } from "context/ProjectContext";
import logo from "logo.svg";

export interface ProjectState {
  elements: Elements;
  id: string;
  onChangeElementFactory: (id: string) => (data: Record<string, any>) => void;
  setElements: Dispatch<SetStateAction<Elements>>;
  setId: Dispatch<SetStateAction<string>>;
  setTransform: Dispatch<SetStateAction<FlowTransform>>;
  transform: FlowTransform;
}

const textareaStyles: React.CSSProperties = {
  fontSize: 12,
  height: "100%",
  resize: "none",
  width: "100%",
};

const controlsStyles: React.CSSProperties = {
  display: "flex",
  position: "absolute",
  right: "100%",
  top: 80,
  transform: "rotate(-90deg)",
  transformOrigin: "bottom right",
};

const topbarStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: "2rem",
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  height: 70,
  backgroundColor: "#0dbedc",
  backgroundSize: "25%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "-5% center",
};

const getDrawerStyles = (visible: boolean): React.CSSProperties => ({
  height: "calc(100% - 70px)",
  padding: 10,
  position: "absolute",
  right: 0,
  top: 70,
  transform: visible ? "translateX(0)" : "translateX(100%)",
  transition: "transform 0.4s ease",
  width: 400,
});

export const getDefaultProject = () => ({
  id: uuidv4(),
  elements: [],
  transform: {
    x: 0,
    y: 0,
    zoom: 1,
  },
});

function Project() {
  const { elements, id, setElements, setId, setTransform, transform } = useProject();
  const [visible, setVisible] = useState(false);
  const drawerStyles = useMemo(() => getDrawerStyles(visible), [visible]);

  // Load project from URL
  useEffect(() => {
    const project = atob(window.location.hash.substr(1));
    try {
      const { elements, id, transform } = JSON.parse(project);
      setElements(elements);
      setId(id ?? uuidv4());
      setTransform(transform);
    } catch (e) {
      console.error(e);
    }
  }, [setElements, setId, setTransform]);

  // Store project in URL
  useEffect(() => {
    window.history.replaceState(
      null,
      document.title,
      "#" +
        btoa(
          JSON.stringify({
            elements: elements.map(element => ({ ...element, __rf: undefined })),
            id,
            transform,
          })
        )
    );
  }, [elements, id, transform]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      try {
        const { elements, id, transform } = JSON.parse(e.target.value ?? "");
        setElements(elements);
        setId(id ?? uuidv4());
        setTransform(transform);
      } catch (e) {
        console.error(e);
      }
    },
    [setElements, setId, setTransform]
  );

  const clearProject = useCallback(() => {
    const defaultProject = getDefaultProject();
    setElements(defaultProject.elements);
    setId(defaultProject.id);
    setTransform(defaultProject.transform);
  }, [setElements, setId, setTransform]);
  const toggleProjectDrawer = useCallback(() => setVisible(visible => !visible), []);

  return (
    <>
      <div style={{ ...topbarStyles, backgroundImage: `url(${logo})` }}>
        <button onClick={()=>{
          document.querySelectorAll('body')[0].classList.toggle('darkmode')
        }}>toggle darkmode</button>
      </div>
      <div style={drawerStyles}>
        <textarea
          onChange={onChange}
          style={textareaStyles}
          value={JSON.stringify(
            {
              elements: elements.map(element => ({ ...element, __rf: undefined })),
              id,
              transform,
            },
            null,
            2
          )}
        />
        <div style={controlsStyles}>
          <button onClick={clearProject} style={{ marginRight: 10 }}>
            clear
          </button>
          <button onClick={toggleProjectDrawer}>{visible ? "hide" : "show"}</button>
        </div>
      </div>
    </>
  );
}

export default Project;
