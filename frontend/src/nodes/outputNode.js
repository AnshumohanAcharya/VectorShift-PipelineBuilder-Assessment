// outputNode.js

import { useState } from "react";
import { createNodeComponent } from "./baseNode";
import { useStore } from "../store";

const OutputNodeContent = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_")
  );
  const [outputType, setOutputType] = useState(data?.outputType || "Text");

  const handleNameChange = (e) => {
    const value = e.target.value;
    setCurrName(value);
    useStore.getState().updateNodeField(id, "outputName", value);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setOutputType(value);
    useStore.getState().updateNodeField(id, "outputType", value);
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
          value={outputType}
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
          <option value="File">Image</option>
        </select>
      </div>
    </div>
  );
};

export const OutputNode = createNodeComponent({
  title: "Output",
  inputs: [{ id: "value" }],
  outputs: [],
  content: OutputNodeContent,
  width: 300,
  height: 200,
  description: "Output node for data display",
});
