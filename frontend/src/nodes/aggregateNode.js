import { useState } from "react";
import { createNodeComponent } from "./baseNode";
import { useStore } from "../store";

const AggregateNodeContent = ({ id, data }) => {
  const [aggregateType, setAggregateType] = useState(
    data?.aggregateType || "sum"
  );
  const [groupBy, setGroupBy] = useState(data?.groupBy || "");
  const [customFunction, setCustomFunction] = useState(
    data?.customFunction || ""
  );

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setAggregateType(value);
    useStore.getState().updateNodeField(id, "aggregateType", value);
  };

  const handleGroupByChange = (e) => {
    const value = e.target.value;
    setGroupBy(value);
    useStore.getState().updateNodeField(id, "groupBy", value);
  };

  const handleCustomChange = (e) => {
    const value = e.target.value;
    setCustomFunction(value);
    useStore.getState().updateNodeField(id, "customFunction", value);
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
          Aggregate Type:
        </label>
        <select
          value={aggregateType}
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
          <option value="sum">Sum</option>
          <option value="average">Average</option>
          <option value="count">Count</option>
          <option value="min">Minimum</option>
          <option value="max">Maximum</option>
          <option value="custom">Custom</option>
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
          Group By:
        </label>
        <input
          type="text"
          value={groupBy}
          onChange={handleGroupByChange}
          placeholder="Field to group by (optional)"
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

      {aggregateType === "custom" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label
            style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "4px",
            }}
          >
            Custom Function:
          </label>
          <input
            type="text"
            value={customFunction}
            onChange={handleCustomChange}
            placeholder="e.g., arr => arr.reduce((a, b) => a + b, 0)"
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
      )}
    </div>
  );
};

export const AggregateNode = createNodeComponent({
  title: "Aggregate",
  inputs: [{ id: "input" }],
  outputs: [{ id: "output" }],
  content: AggregateNodeContent,
  width: 300,
  height: 200,
  description: "Aggregate node for data aggregation",
});
