import { useState, useEffect, useCallback } from "react";
import './App.css'
import ReactFlow, {
    Controls,
    Background,
    Panel,
    applyNodeChanges,
    applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';

import useFetchData from "./hooks/useFetchData.js";
import getFlowNodes from "./utils/getFlowNodes.js";
import getFlowEdges from "./utils/getFlowEdges.js";
import { filterElementsByConnection } from "./utils/index.js";

function App() {
  const { data, loading, error } = useFetchData("https://gist.githubusercontent.com/ondrejbartas/1d1f070808fe582475a752fd8dd9bc5c/raw/03ff2c97e5b9576017be7ad70fa345ecf7dafc94/example_data.json");
  const initialNodes = getFlowNodes(data);
  const initialEdges = getFlowEdges(data);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [data]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    const nodeClickHandler = (e, node) => {
        const updatedNodes = filterElementsByConnection(node.id, initialNodes, initialEdges);
        setNodes(updatedNodes);
        setSelectedNode(node);
    }

    const resetNodes = () => {
        setNodes(initialNodes);
        setSelectedNode(null);
    }

  return (
    <>
        { loading && <div>...Loading</div>}
        { error && <div style={{color: '#ff0000'}}>Error: {error.message}</div>}
        { data && <div style={{ width: '100%', height: '100vh' }}>
            <ReactFlow
                nodes={ nodes }
                edges={ edges }
                onNodeClick={ nodeClickHandler }
                onNodesChange={ onNodesChange }
                onEdgesChange={ onEdgesChange }
                fitView
            >
                <Panel position="top-center">
                    { selectedNode && <button className="reset-btn" onClick={resetNodes}>Reset state</button> }
                </Panel>
                <Controls />
                <Background variant="lines" gap={12} size={1} />
            </ReactFlow>
        </div> }

    </>
  )
}

export default App
