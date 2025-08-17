// llmNode.js

import { createNodeComponent } from "./baseNode";

const LLMNodeContent = () => {
  return (
    <div className="node-default-content">
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
