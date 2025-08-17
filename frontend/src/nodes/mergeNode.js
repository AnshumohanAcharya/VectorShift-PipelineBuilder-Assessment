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
          Merge Strategy:
        </label>
        <select
          value={mergeStrategy}
          onChange={handleStrategyChange}
          style={{
            padding: "8px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            fontSize: "12px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <option value="concat">Concatenate</option>
          <option value="join">Join with Separator</option>
          <option value="union">Union (Unique)</option>
          <option value="intersection">Intersection</option>
        </select>
      </div>

      {mergeStrategy === "join" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label
            style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "4px",
            }}
          >
            Separator:
          </label>
          <input
            type="text"
            value={separator}
            onChange={handleSeparatorChange}
            placeholder="e.g., space, comma, newline"
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

export const MergeNode = createNodeComponent({
  title: "Merge",
  inputs: [{ id: "input1" }, { id: "input2" }],
  outputs: [{ id: "output" }],
  content: MergeNodeContent,
  width: 300,
  height: 200,
  description: "Merge node for combining data",
});
