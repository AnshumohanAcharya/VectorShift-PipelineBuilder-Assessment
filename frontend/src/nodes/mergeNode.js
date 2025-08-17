import { useState } from "react";
import { createNodeComponent } from "./baseNode";
import { useStore } from "../store";

const MergeNodeContent = ({ id, data }) => {
  const [mergeStrategy, setMergeStrategy] = useState(
    data?.mergeStrategy || "concat"
  );
  const [separator, setSeparator] = useState(data?.separator || " ");

  const handleStrategyChange = (e) => {
    const value = e.target.value;
    setMergeStrategy(value);
    useStore.getState().updateNodeField(id, "mergeStrategy", value);
  };

  const handleSeparatorChange = (e) => {
    const value = e.target.value;
    setSeparator(value);
    useStore.getState().updateNodeField(id, "separator", value);
  };

  return (
    <div className="node-form">
      <div className="form-group">
        <label className="form-label">
          Merge Strategy:
        </label>
        <select
          value={mergeStrategy}
          onChange={handleStrategyChange}
          className="form-select"
        >
          <option value="concat">Concatenate</option>
          <option value="join">Join with Separator</option>
          <option value="union">Union (Unique)</option>
          <option value="intersection">Intersection</option>
        </select>
      </div>

      {mergeStrategy === "join" && (
        <div className="form-group">
          <label className="form-label">
            Separator:
          </label>
          <input
            type="text"
            value={separator}
            onChange={handleSeparatorChange}
            placeholder="e.g., space, comma, newline"
            className="form-input"
          />
        </div>
      )}
    </div>
  );
};

export const MergeNode = createNodeComponent({
  title: "Merge",
  inputs: [{ id: "input1" }, { id: "input2" }],
  outputs: [{ id: "output" }],
  content: MergeNodeContent,
  width: 300,
  height: 200,
  description: "Merge node for combining data",
});
