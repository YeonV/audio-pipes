import React, { useEffect, useMemo, useState } from "react";
import { useProject } from "../hooks/state/useProject";
import logo from "../logo.svg";
import { ProjectStateData } from "../types/Project";

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

function Project() {
  const {
    elements,
    id,
    setElements,
    setId,
    setTransform,
    transform,
    clear,
    set: setProject,
  } = useProject();
  const [visible, setVisible] = useState(false);
  const drawerStyles = useMemo(() => getDrawerStyles(visible), [visible]);

  // Load project from URL
  useEffect(() => {
    if (window.location.hash) {
      const project = atob(window.location.hash?.substr(1));
      try {
        setProject(JSON.parse(project) as ProjectStateData);
      } catch (e) {
        console.error(e);
      }
    }
  }, [setProject]);

  // Store project in URL
  useEffect(() => {
    console.log(
      "share link",
      `${window.location.href}/#${btoa(JSON.stringify({ elements, id, transform }))}`
    );
    // window.history.replaceState(
    //   null,
    //   document.title,
    //   "#" +
    //     btoa(
    //       JSON.stringify({
    //         elements: elements.map(element => ({ ...element, __rf: undefined })),
    //         id,
    //         transform,
    //       })
    //     )
    // );
  }, [elements, id, transform]);

  return (
    <>
      <div style={{ ...topbarStyles, backgroundImage: `url(${logo})` }}>
        <button
          onClick={() => {
            document.querySelectorAll("body")[0].classList.toggle("darkmode");
          }}
        >
          toggle darkmode
        </button>
      </div>
      <div style={drawerStyles}>
        <textarea
          onChange={e => {
            try {
              const { elements, id, transform } = JSON.parse(e.target.value ?? "");
              setElements(elements);
              setId(id);
              setTransform(transform);
            } catch (e) {
              console.error(e);
            }
          }}
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
          <button onClick={() => clear()} style={{ marginRight: 10 }}>
            clear
          </button>
          <button onClick={() => setVisible(visible => !visible)}>
            {visible ? "hide" : "show"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Project;
