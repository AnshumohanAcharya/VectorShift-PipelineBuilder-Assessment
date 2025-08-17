import { useState } from "react";
import { createNodeComponent } from "./baseNode";
import { useStore } from "../store";

const TransformNodeContent = ({ id, data }) => {
  const [transformType, setTransformType] = useState(
    data?.transformType || "uppercase"
  );
  const [customTransform, setCustomTransform] = useState(
    data?.customTransform || ""
  );

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setTransformType(value);
    useStore.getState().updateNodeField(id, "transformType", value);
  };

  const handleCustomChange = (e) => {
    const value = e.target.value;
    setCustomTransform(value);
    useStore.getState().updateNodeField(id, "customTransform", value);
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
          Transform Type:
        </label>
        <select
          value={transformType}
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
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
          <option value="reverse">Reverse</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {transformType === "custom" && (
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
            value={customTransform}
            onChange={handleCustomChange}
            placeholder="e.g., x => x.replace('a', 'b')"
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

export const TransformNode = createNodeComponent({
  title: "Transform",
  inputs: [{ id: "input" }],
  outputs: [{ id: "output" }],
  content: TransformNodeContent,
  width: 300,
  height: 200,
  description: "Transform node for data transformation",
});
