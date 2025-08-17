// toolbar.js

import { DraggableNode } from "./draggableNode";

export const PipelineToolbar = () => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "white",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          margin: "0 0 20px 0",
          fontSize: "24px",
          fontWeight: "600",
          color: "#1f2937",
          textAlign: "center",
        }}
      >
        Vector Shift Pipeline Builder
      </h2>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "16px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#6b7280",
              margin: "0 0 8px 0",
            }}
          >
            Input/Output
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <DraggableNode type="customInput" label="Input" />
            <DraggableNode type="customOutput" label="Output" />
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#6b7280",
              margin: "0 0 8px 0",
            }}
          >
            Processing
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <DraggableNode type="llm" label="LLM" />
            <DraggableNode type="text" label="Text" />
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#6b7280",
              margin: "0 0 8px 0",
            }}
          >
            Data Operations
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <DraggableNode type="transform" label="Transform" />
            <DraggableNode type="filter" label="Filter" />
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#6b7280",
              margin: "0 0 8px 0",
            }}
          >
            Flow Control
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <DraggableNode type="merge" label="Merge" />
            <DraggableNode type="conditional" label="Conditional" />
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#6b7280",
              margin: "0 0 8px 0",
            }}
          >
            Analytics
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <DraggableNode type="aggregate" label="Aggregate" />
          </div>
        </div>
      </div>
    </div>
  );
};
