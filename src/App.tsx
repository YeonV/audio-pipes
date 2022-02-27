import { ReactFlowProvider } from "react-flow-renderer";
import Audio from "./components/Audio";
import ContextMenu from "./components/ContextMenu";
import Flow from "./components/Flow";
import Project from "./components/Project";
import { useProject } from "./hooks/state/useProject";

function App() {
  const project = useProject();

  return (
    <Audio>
      <ReactFlowProvider>
        <ContextMenu>
          <div
            style={{
              alignItems: "stretch",
              display: "flex",
              height: "100vh",
            }}
          >
            <Flow key={project.id} />
            <Project />
          </div>
        </ContextMenu>
      </ReactFlowProvider>
    </Audio>
  );
}

export default App;
