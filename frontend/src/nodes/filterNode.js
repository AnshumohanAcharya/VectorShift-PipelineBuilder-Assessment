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
    <div className="node-form">
      <div className="form-group">
        <label className="form-label">
          Filter Condition:
        </label>
        <select
          value={filterCondition}
          onChange={handleConditionChange}
          className="form-select"
        >
          <option value="contains">Contains</option>
          <option value="starts_with">Starts With</option>
          <option value="ends_with">Ends With</option>
          <option value="equals">Equals</option>
          <option value="regex">Regex</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          Filter Value:
        </label>
        <input
          type="text"
          value={filterValue}
          onChange={handleValueChange}
          placeholder="Enter filter value"
          className="form-input"
        />
      </div>

      <div className="form-group checkbox-group">
        <input
          type="checkbox"
          checked={caseSensitive}
          onChange={handleCaseChange}
          id={`case-sensitive-${id}`}
          className="form-checkbox"
        />
        <label htmlFor={`case-sensitive-${id}`} className="form-label checkbox-label">
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
