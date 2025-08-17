// textNode.js
// Text node with dynamic input handles based on {{variable}} patterns

import React, { useMemo, useState } from "react";
import { Handle, Position } from "reactflow";
import { useStore } from "../store";

export const TextNode = ({ id, data, selected }) => {
  const [text, setText] = useState(data?.text || "{{input}}");
  const { removeNode, updateNodeField } = useStore();

  // Detect variables in text ({{variableName}})
  const variables = useMemo(() => {
    const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  }, [text]);

  // Calculate dynamic dimensions based on text content
  const dimensions = useMemo(() => {
    const minWidth = 350;
    const minHeight = 180;
    const maxWidth = 500;
    const maxHeight = 300;

    const lines = text.split("\n");
    const maxLineLength = Math.max(...lines.map((line) => line.length));

    // Calculate width based on text content
    const charWidth = 8;
    const calculatedWidth = Math.max(
      minWidth,
      Math.min(maxWidth, maxLineLength * charWidth + 80)
    );

    // Calculate height based on number of lines
    const lineHeight = 20;
    const calculatedHeight = Math.max(
      minHeight,
      Math.min(maxHeight, lines.length * lineHeight + 100)
    );

    return { width: calculatedWidth, height: calculatedHeight };
  }, [text]);

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    updateNodeField(id, "text", value);
  };

  const handleRemoveNode = (e) => {
    e.stopPropagation();
    removeNode(id);
  };

  return (
    <div
      className={`node-container text-node ${selected ? 'selected' : ''}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        minWidth: dimensions.width,
        maxWidth: dimensions.width,
        minHeight: dimensions.height,
        maxHeight: dimensions.height,
      }}
    >
      {/* Remove Button */}
      <button
        onClick={handleRemoveNode}
        className="node-remove-btn"
        title="Remove node (or press Delete)"
      >
        ×
      </button>

      {/* Node Title */}
      <div className="node-title">
        Text Node
      </div>

      {/* Text Input Area */}
      <div className="text-node-content">
        <label className="text-node-label">
          Text Content:
        </label>
        <textarea
          value={text}
          onChange={handleTextChange}
          className="text-node-textarea"
          placeholder="Enter text with {{variables}} like {{input}} {{output}}"
        />

        {/* Variables Display */}
        {variables.length > 0 && (
          <div className="variables-display">
            <span className="variables-label">📥 Input Variables:</span>
            <div className="variables-tags">
              {variables.map((varName, index) => (
                <span key={index} className="variable-tag">
                  {varName}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Input Handles for Variables */}
      {variables.map((varName, index) => (
        <Handle
          key={`input-${varName}`}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          className="react-flow__handle target"
          style={{
            top: `${20 + (index * 25)}px`,
            left: '-8px'
          }}
          title={`Input: ${varName}`}
        />
      ))}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="react-flow__handle source"
        style={{
          right: '-8px',
          top: '50%'
        }}
        title="Output"
      />
    </div>
  );
};
