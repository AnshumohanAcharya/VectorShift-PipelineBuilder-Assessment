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
    <div className="node-form">
      <div className="form-group">
        <label className="form-label">
          Name:
        </label>
        <input
          type="text"
          value={currName}
          onChange={handleNameChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Type:
        </label>
        <select
          value={outputType}
          onChange={handleTypeChange}
          className="form-select"
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
