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
        className={`node-container ${selected ? 'selected' : ''}`}
        style={{
          width: width,
          height: height,
          minWidth: width,
          minHeight: height,
          maxWidth: width,
          maxHeight: height,
        }}
      >
        {/* Remove Button */}
        <button
          onClick={() => {
            const { removeNode } = useStore.getState();
            removeNode(id);
          }}
          className="node-remove-btn"
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
            className="react-flow__handle target"
            style={{
              top:
                inputs.length === 1
                  ? "50%"
                  : `${((index + 1) * 100) / (inputs.length + 1)}%`,
              left: "-8px",
            }}
          />
        ))}

        {/* Title */}
        <div className="node-title">
          {title}
        </div>

        {/* Content */}
        <div className="node-content">
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
            className="react-flow__handle source"
            style={{
              top:
                outputs.length === 1
                  ? "50%"
                  : `${((index + 1) * 100) / (outputs.length + 1)}%`,
              right: "-8px",
            }}
          />
        ))}
      </div>
    );
  }

  renderDefaultContent({ id, data }) {
    return (
      <div className="node-default-content">
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
