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
    <div className="node-form">
      <div className="form-group">
        <label className="form-label">
          Transform Type:
        </label>
        <select
          value={transformType}
          onChange={handleTypeChange}
          className="form-select"
        >
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
          <option value="reverse">Reverse</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {transformType === "custom" && (
        <div className="form-group">
          <label className="form-label">
            Custom Function:
          </label>
          <input
            type="text"
            value={customTransform}
            onChange={handleCustomChange}
            placeholder="e.g., x => x.replace('a', 'b')"
            className="form-input"
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
