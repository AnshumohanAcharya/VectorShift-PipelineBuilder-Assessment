// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";
import { TransformNode } from "./nodes/transformNode";
import { FilterNode } from "./nodes/filterNode";
import { MergeNode } from "./nodes/mergeNode";
import { ConditionalNode } from "./nodes/conditionalNode";
import { AggregateNode } from "./nodes/aggregateNode";

import "reactflow/dist/style.css";

const gridSize = 20;
const nodeSpacing = 200; // Increased from 150 to accommodate larger nodes
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  transform: TransformNode,
  filter: FilterNode,
  merge: MergeNode,
  conditional: ConditionalNode,
  aggregate: AggregateNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  removeNode: state.removeNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    removeNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if user is typing in an input field, textarea, or contenteditable element
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.contentEditable === 'true' ||
        activeElement.isContentEditable
      );

      // Only handle Delete/Backspace for node deletion when NOT typing
      if ((event.key === "Delete" || event.key === "Backspace") && !isTyping) {
        event.preventDefault();
        // Get selected nodes from ReactFlow
        if (reactFlowInstance) {
          const selectedNodes = reactFlowInstance
            .getNodes()
            .filter((node) => node.selected);
          selectedNodes.forEach((node) => {
            removeNode(node.id);
          });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [reactFlowInstance, removeNode]);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  // Function to find a good position for a new node that doesn't overlap
  const findGoodPosition = useCallback((dropPosition, existingNodes) => {
    // Convert screen coordinates to flow coordinates
    const flowPosition = reactFlowInstance.project({
      x: dropPosition.x,
      y: dropPosition.y,
    });

    // If this is the first node, place it at the center
    if (existingNodes.length === 0) {
      return { x: 0, y: 0 };
    }

    // Try to place the node at the drop position first
    let candidatePosition = { x: flowPosition.x, y: flowPosition.y };
    
    // Check if this position is too close to existing nodes
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
      let tooClose = false;
      
      for (const existingNode of existingNodes) {
        const distance = Math.sqrt(
          Math.pow(candidatePosition.x - existingNode.position.x, 2) +
          Math.pow(candidatePosition.y - existingNode.position.y, 2)
        );
        
        if (distance < nodeSpacing) {
          tooClose = true;
          break;
        }
      }
      
      if (!tooClose) {
        break; // Found a good position
      }
      
      // Try a different position with increasing offset
      attempts++;
      const angle = (attempts * Math.PI * 2) / maxAttempts;
      const radius = nodeSpacing * (1 + attempts / 10);
      
      candidatePosition = {
        x: flowPosition.x + Math.cos(angle) * radius,
        y: flowPosition.y + Math.sin(angle) * radius
      };
    }
    
    // Snap to grid for better alignment
    candidatePosition.x = Math.round(candidatePosition.x / gridSize) * gridSize;
    candidatePosition.y = Math.round(candidatePosition.y / gridSize) * gridSize;
    
    return candidatePosition;
  }, [reactFlowInstance]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return;
        }

        // Calculate position relative to the drop location
        const dropPosition = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        // Find a good position that doesn't overlap with existing nodes
        const finalPosition = findGoodPosition(dropPosition, nodes);

        console.log('Dropping node at:', {
          dropPosition,
          finalPosition,
          existingNodes: nodes.length
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position: finalPosition,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode, getInitNodeData, nodes, findGoodPosition]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Memoize ReactFlow props to prevent unnecessary re-renders
  const reactFlowProps = useMemo(() => ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
    onInit: setReactFlowInstance,
    nodeTypes,
    proOptions,
    snapGrid: [gridSize, gridSize],
    connectionLineType: "smoothstep",
    defaultEdgeOptions: {
      style: { stroke: "#64748b", strokeWidth: 2 },
      animated: true,
      type: "smoothstep",
    },
    // Disable fitView to prevent automatic positioning
    fitView: false,
    deleteKeyCode: "Delete",
    multiSelectionKeyCode: "Shift",
    // Prevent automatic behaviors that could cause positioning issues
    autoConnect: false,
    autoPanOnNodeDrag: false,
    autoPanOnConnect: false,
    fitViewOnAdd: false,
    fitViewOnResize: false,
    // Control viewport manually
    minZoom: 0.1,
    maxZoom: 4,
  }), [nodes, edges, onNodesChange, onEdgesChange, onConnect, onDrop, onDragOver, nodeTypes]);

  return (
    <>
      <div
        ref={reactFlowWrapper}
        style={{
          width: "100vw",
          height: "70vh",
          backgroundColor: "#f8fafc",
          position: 'relative'
        }}
      >
        {/* Debug Panel */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '8px 16px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          title="Toggle debug panel"
        >
          🐛 Debug
        </button>

        {/* Debug Info */}
        {showDebug && (
          <div style={{
            position: 'absolute',
            top: '60px',
            left: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 1000,
            maxWidth: '300px',
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            <h4 style={{ margin: '0 0 12px 0' }}>Debug Info</h4>
            <div><strong>Nodes:</strong> {nodes.length}</div>
            <div><strong>Edges:</strong> {edges.length}</div>
            <div><strong>Grid Size:</strong> {gridSize}px</div>
            <div><strong>Node Spacing:</strong> {nodeSpacing}px</div>
            <div style={{ marginTop: '12px' }}>
              <strong>Node Positions:</strong>
              {nodes.map((node, index) => (
                <div key={index} style={{ marginLeft: '8px', marginTop: '4px' }}>
                  {node.type}: ({node.position.x.toFixed(0)}, {node.position.y.toFixed(0)})
                </div>
              ))}
            </div>
          </div>
        )}

        <ReactFlow {...reactFlowProps}>
          <Background color="#e2e8f0" gap={gridSize} size={1} />
          <Controls
            style={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <MiniMap
            style={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
            nodeColor="#3b82f6"
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
        </ReactFlow>
      </div>
    </>
  );
};
