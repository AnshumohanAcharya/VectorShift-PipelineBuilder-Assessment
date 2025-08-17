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
      customInput: "#3b82f6", // Blue for input
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
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = "grab")}
      style={{
        cursor: "grab",
        minWidth: "100px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        borderRadius: "8px",
        backgroundColor: nodeColor,
        justifyContent: "center",
        flexDirection: "column",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        border: "2px solid transparent",
      }}
      onMouseEnter={(e) => {
        e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
        e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        e.target.style.borderColor = "transparent";
      }}
      draggable
    >
      <span
        style={{
          color: "#fff",
          fontSize: "12px",
          fontWeight: "500",
          textAlign: "center",
          lineHeight: "1.2",
        }}
      >
        {label}
      </span>
    </div>
  );
};
