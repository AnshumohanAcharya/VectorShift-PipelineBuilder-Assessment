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
          Condition:
        </label>
        <select
          value={currName}
          onChange={handleConditionChange}
          style={{
            padding: "8px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            fontSize: "12px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <option value="equals">Equals</option>
          <option value="greater_than">Greater Than</option>
          <option value="less_than">Less Than</option>
          <option value="contains">Contains</option>
          <option value="regex">Regex</option>
        </select>
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
          Threshold:
        </label>
        <input
          type="text"
          value={threshold}
          onChange={handleThresholdChange}
          placeholder="Enter threshold value"
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
          True Value:
        </label>
        <input
          type="text"
          value={trueValue}
          onChange={handleTrueValueChange}
          placeholder="Value when condition is true"
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
          False Value:
        </label>
        <input
          type="text"
          value={falseValue}
          onChange={handleFalseValueChange}
          placeholder="Value when condition is false"
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
    </div>
  );
};

export const ConditionalNode = createNodeComponent({
  title: "Conditional",
  inputs: [{ id: "input" }],
  outputs: [{ id: "true" }, { id: "false" }],
  content: ConditionalNodeContent,
  width: 300,
  height: 220,
  description: "Conditional node for branching logic",
});
