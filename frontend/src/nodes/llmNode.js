// llmNode.js

import { createNodeComponent } from "./baseNode";

const LLMNodeContent = () => {
  return (
    <div
      style={{
        fontSize: "12px",
        color: "#6b7280",
        textAlign: "center",
        padding: "16px",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      This is an LLM node for processing text inputs and generating responses.
    </div>
  );
};

export const LLMNode = createNodeComponent({
  title: "LLM",
  inputs: [{ id: "system" }, { id: "prompt" }],
  outputs: [{ id: "response" }],
  content: LLMNodeContent,
  width: 300,
  height: 200,
  description: "LLM node for text processing",
});
