import React from "react";
import { Handle, Position } from "reactflow";
import { useStore } from "../store";

export class BaseNode {
  constructor(config) {
    this.config = {
      width: 200,
      height: 80,
      title: "Node",
      inputs: [],
      outputs: [],
      content: null,
      ...config,
    };
  }

  render({ id, data, selected }) {
    const { width, height, title, inputs, outputs, content } = this.config;

    return (
      <div
        className="node-container"
        style={{
          width: width,
          height: height,
          border: selected ? "2px solid #3b82f6" : "2px solid #e2e8f0",
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: selected
            ? "0 0 0 2px rgba(59, 130, 246, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          position: "relative",
          minWidth: width,
          minHeight: height,
          maxWidth: width,
          maxHeight: height,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Remove Button */}
        <button
          onClick={() => {
            const { removeNode } = useStore.getState();
            removeNode(id);
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#ef4444",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            lineHeight: "1",
            opacity: 0.8,
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = "0.8";
          }}
          title="Remove node (or press Delete)"
        >
          ×
        </button>

        {/* Input Handles */}
        {inputs.map((input, index) => (
          <Handle
            key={`input-${index}`}
            type="target"
            position={Position.Left}
            id={`${id}-${input.id}`}
            style={{
              top:
                inputs.length === 1
                  ? "50%"
                  : `${((index + 1) * 100) / (inputs.length + 1)}%`,
              background: "#3b82f6",
              border: "2px solid white",
              width: "12px",
              height: "12px",
              left: "-6px",
            }}
          />
        ))}

        {/* Title */}
        <div
          className="node-title"
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "12px",
            textAlign: "center",
            flexShrink: 0,
            paddingRight: "20px", // Make room for remove button
          }}
        >
          {title}
        </div>

        {/* Content */}
        <div
          className="node-content"
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {content
            ? content({ id, data })
            : this.renderDefaultContent({ id, data })}
        </div>

        {/* Output Handles */}
        {outputs.map((output, index) => (
          <Handle
            key={`output-${index}`}
            type="source"
            position={Position.Right}
            id={`${id}-${output.id}`}
            style={{
              top:
                outputs.length === 1
                  ? "50%"
                  : `${((index + 1) * 100) / (outputs.length + 1)}%`,
              background: "#10b981",
              border: "2px solid white",
              width: "12px",
              height: "12px",
              right: "-6px",
            }}
          />
        ))}
      </div>
    );
  }

  renderDefaultContent({ id, data }) {
    return (
      <div
        style={{
          fontSize: "12px",
          color: "#6b7280",
          textAlign: "center",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {this.config.description || "No content"}
      </div>
    );
  }
}

// Higher-order component to create node components
export const createNodeComponent = (config) => {
  const baseNode = new BaseNode(config);
  return (props) => baseNode.render(props);
};
