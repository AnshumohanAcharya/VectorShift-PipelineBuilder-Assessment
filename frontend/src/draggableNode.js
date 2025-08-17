// draggableNode.js

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  // Define colors for different node categories
  const getNodeColor = (nodeType) => {
    const colors = {
      customInput: "#667eea", // Blue for input
      customOutput: "#10b981", // Green for output
      llm: "#8b5cf6", // Purple for LLM
      text: "#f59e0b", // Amber for text
      transform: "#06b6d4", // Cyan for transform
      filter: "#ef4444", // Red for filter
      merge: "#84cc16", // Lime for merge
      conditional: "#f97316", // Orange for conditional
      aggregate: "#ec4899", // Pink for aggregate
    };
    return colors[nodeType] || "#64748b";
  };

  const nodeColor = getNodeColor(type);

  return (
    <div
      className={`draggable-node ${type}`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = "grab")}
      style={{
        cursor: "grab",
        backgroundColor: nodeColor,
        fontWeight: "bold",
        fontSize: "1.2rem",
        color: "white",
      }}
      draggable
    >
      <span className="draggable-node-label">
        {label}
      </span>
    </div>
  );
};
