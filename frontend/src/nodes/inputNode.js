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
          value={inputType}
          onChange={handleTypeChange}
          className="form-select"
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
