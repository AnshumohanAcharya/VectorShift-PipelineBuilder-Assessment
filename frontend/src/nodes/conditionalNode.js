import { useState } from "react";
import { createNodeComponent } from "./baseNode";
import { useStore } from "../store";

const ConditionalNodeContent = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.condition || "equals");
  const [threshold, setThreshold] = useState(data?.threshold || "");
  const [trueValue, setTrueValue] = useState(data?.trueValue || "true");
  const [falseValue, setFalseValue] = useState(data?.falseValue || "false");

  const handleConditionChange = (e) => {
    const value = e.target.value;
    setCurrName(value);
    useStore.getState().updateNodeField(id, "condition", value);
  };

  const handleThresholdChange = (e) => {
    const value = e.target.value;
    setThreshold(value);
    useStore.getState().updateNodeField(id, "threshold", value);
  };

  const handleTrueValueChange = (e) => {
    const value = e.target.value;
    setTrueValue(value);
    useStore.getState().updateNodeField(id, "trueValue", value);
  };

  const handleFalseValueChange = (e) => {
    const value = e.target.value;
    setFalseValue(value);
    useStore.getState().updateNodeField(id, "falseValue", value);
  };

  return (
    <div className="node-form">
      <div className="form-group">
        <label className="form-label">
          Condition:
        </label>
        <select
          value={currName}
          onChange={handleConditionChange}
          className="form-select"
        >
          <option value="equals">Equals</option>
          <option value="greater_than">Greater Than</option>
          <option value="less_than">Less Than</option>
          <option value="contains">Contains</option>
          <option value="regex">Regex</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          Threshold:
        </label>
        <input
          type="text"
          value={threshold}
          onChange={handleThresholdChange}
          placeholder="Enter threshold value"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          True Value:
        </label>
        <input
          type="text"
          value={trueValue}
          onChange={handleTrueValueChange}
          placeholder="Value when condition is true"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          False Value:
        </label>
        <input
          type="text"
          value={falseValue}
          onChange={handleFalseValueChange}
          placeholder="Value when condition is false"
          className="form-input"
        />
      </div>
    </div>
  );
};

export const ConditionalNode = createNodeComponent({
  title: "Conditional",
  inputs: [{ id: "input" }],
  outputs: [{ id: "true" }, { id: "false" }],
  content: ConditionalNodeContent,
  width: 350,
  height: 280,
  description: "Conditional node for branching logic",
});
