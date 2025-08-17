// toolbar.js

import { DraggableNode } from "./draggableNode";

export const PipelineToolbar = () => {
  return (
    <div className="pipeline-toolbar">
      <h2 className="toolbar-title">
        Vector Shift Pipeline Builder
      </h2>

      <div className="toolbar-grid">
        <div className="toolbar-category">
          <h3 className="category-title">
            Input/Output
          </h3>
          <div className="category-nodes">
            <DraggableNode type="customInput" label="Input" />
            <DraggableNode type="customOutput" label="Output" />
          </div>
        </div>

        <div className="toolbar-category">
          <h3 className="category-title">
            Processing
          </h3>
          <div className="category-nodes">
            <DraggableNode type="llm" label="LLM" />
            <DraggableNode type="text" label="Text" />
          </div>
        </div>

        <div className="toolbar-category">
          <h3 className="category-title">
            Data Operations
          </h3>
          <div className="category-nodes">
            <DraggableNode type="transform" label="Transform" />
            <DraggableNode type="filter" label="Filter" />
          </div>
        </div>

        <div className="toolbar-category">
          <h3 className="category-title">
            Flow Control
          </h3>
          <div className="category-nodes">
            <DraggableNode type="merge" label="Merge" />
            <DraggableNode type="conditional" label="Conditional" />
          </div>
        </div>

        <div className="toolbar-category">
          <h3 className="category-title">
            Analytics
          </h3>
          <div className="category-nodes">
            <DraggableNode type="aggregate" label="Aggregate" />
          </div>
        </div>
      </div>
    </div>
  );
};
