import { useState } from "react";
import { createNodeComponent } from "./baseNode";
import { useStore } from "../store";

const FilterNodeContent = ({ id, data }) => {
  const [filterCondition, setFilterCondition] = useState(
    data?.filterCondition || "contains"
  );
  const [filterValue, setFilterValue] = useState(data?.filterValue || "");
  const [caseSensitive, setCaseSensitive] = useState(
    data?.caseSensitive || false
  );

  const handleConditionChange = (e) => {
    const value = e.target.value;
    setFilterCondition(value);
    useStore.getState().updateNodeField(id, "filterCondition", value);
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);
    useStore.getState().updateNodeField(id, "filterValue", value);
  };

  const handleCaseChange = (e) => {
    const value = e.target.checked;
    setCaseSensitive(value);
    useStore.getState().updateNodeField(id, "caseSensitive", value);
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
          Filter Condition:
        </label>
        <select
          value={filterCondition}
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
          <option value="contains">Contains</option>
          <option value="starts_with">Starts With</option>
          <option value="ends_with">Ends With</option>
          <option value="equals">Equals</option>
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
          Filter Value:
        </label>
        <input
          type="text"
          value={filterValue}
          onChange={handleValueChange}
          placeholder="Enter filter value"
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

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="checkbox"
          checked={caseSensitive}
          onChange={handleCaseChange}
          style={{ margin: 0 }}
        />
        <label
          style={{
            fontSize: "12px",
            fontWeight: "500",
            color: "#374151",
            margin: 0,
          }}
        >
          Case Sensitive
        </label>
      </div>
    </div>
  );
};

export const FilterNode = createNodeComponent({
  title: "Filter",
  inputs: [{ id: "input" }],
  outputs: [{ id: "output" }],
  content: FilterNodeContent,
  width: 300,
  height: 200,
  description: "Filter node for data filtering",
});
