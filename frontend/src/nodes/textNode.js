// textNode.js
// Text node with dynamic input handles based on {{variable}} patterns

import React, { useState, useEffect, useMemo } from "react";
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
      style={{
        width: dimensions.width,
        height: dimensions.height,
        border: selected ? '3px solid #3b82f6' : '2px solid #e2e8f0',
        borderRadius: '12px',
        backgroundColor: 'white',
        boxShadow: selected
          ? '0 0 0 2px rgba(59, 130, 246, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        position: 'relative',
        minWidth: dimensions.width,
        maxWidth: dimensions.width,
        minHeight: dimensions.height,
        maxHeight: dimensions.height,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Remove Button */}
      <button
        onClick={handleRemoveNode}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: '#ef4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          lineHeight: '1',
          opacity: 0.8,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => { e.target.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.target.style.opacity = '0.8'; }}
        title="Remove node (or press Delete)"
      >
        ×
      </button>

      {/* Node Title */}
      <div
        style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '12px',
          textAlign: 'center',
          paddingRight: '28px' // Make space for remove button
        }}
      >
        Text Node
      </div>

      {/* Text Input Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <label
          style={{
            fontSize: '12px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}
        >
          Text Content:
        </label>
        <textarea
          value={text}
          onChange={handleTextChange}
          style={{
            padding: '8px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '12px',
            width: '100%',
            minHeight: '60px',
            resize: 'vertical',
            fontFamily: 'monospace',
            flex: 1,
            boxSizing: 'border-box',
            backgroundColor: '#f9fafb',
            color: '#1f2937',
            lineHeight: '1.4'
          }}
          placeholder="Enter text with {{variables}} like {{input}} {{output}}"
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.backgroundColor = '#ffffff';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.backgroundColor = '#f9fafb';
          }}
        />

        {/* Variables Display */}
        {variables.length > 0 && (
          <div
            style={{
              fontSize: '11px',
              color: '#059669',
              backgroundColor: '#d1fae5',
              padding: '6px 8px',
              borderRadius: '4px',
              border: '1px solid #a7f3d0',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{ fontWeight: '600' }}>📥 Input Variables:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {variables.map((varName, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '500'
                  }}
                >
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
          style={{
            background: '#10b981',
            border: '2px solid white',
            width: '12px',
            height: '12px',
            top: `${20 + (index * 25)}px`,
            left: '-6px'
          }}
          title={`Input: ${varName}`}
        />
      ))}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          background: '#3b82f6',
          border: '2px solid white',
          width: '12px',
          height: '12px',
          right: '-6px',
          top: '50%'
        }}
        title="Output"
      />
    </div>
  );
};
