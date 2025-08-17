// inputNode.js

import { useState } from "react";
import { createNodeComponent } from "./baseNode";
import { useStore } from "../store";

const InputNodeContent = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );
  const [inputType, setInputType] = useState(data?.inputType || "Text");

  const handleNameChange = (e) => {
    const value = e.target.value;
    setCurrName(value);
    useStore.getState().updateNodeField(id, "inputName", value);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setInputType(value);
    useStore.getState().updateNodeField(id, "inputType", value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        flex: 1,
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            fontSize: "12px",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "4px",
          }}
        >
          Name:
        </label>
        <input
          type="text"
          value={currName}
          onChange={handleNameChange}
          style={{
            padding: "8px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            fontSize: "12px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            fontSize: "12px",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "4px",
          }}
        >
          Type:
        </label>
        <select
          value={inputType}
          onChange={handleTypeChange}
          style={{
            padding: "8px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            fontSize: "12px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </div>
  );
};

export const InputNode = createNodeComponent({
  title: "Input",
  inputs: [],
  outputs: [{ id: "value" }],
  content: InputNodeContent,
  width: 300,
  height: 200,
  description: "Input node for data entry",
});
