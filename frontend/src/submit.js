// submit.js
// Handles pipeline submission and analysis
// --------------------------------------------------

import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { useState } from "react";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});



// Results Modal Component
const ResultsModal = ({ isOpen, onClose, results, isLoading, error }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content results-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon">
            {isLoading ? '⏳' : error ? '❌' : '🎯'}
          </div>
          <h2 className="modal-title">
            {isLoading ? 'Analyzing Pipeline...' : error ? 'Analysis Failed' : 'Pipeline Analysis Complete'}
          </h2>
          <p className="modal-subtitle">
            {isLoading ? 'Please wait while we analyze your pipeline structure' : 
             error ? 'There was an error analyzing your pipeline' : 
             'Your pipeline has been successfully analyzed'}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p className="loading-text">
              Processing pipeline data...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-message">
            <p className="error-text">
              {error}
            </p>
          </div>
        )}

        {/* Results */}
        {results && !isLoading && !error && (
          <div className="results-content">
            <div className="results-grid">
              <div className="result-item">
                <div className="result-value">{results.num_nodes}</div>
                <div className="result-label">Nodes</div>
              </div>
              <div className="result-item">
                <div className="result-value">{results.num_edges}</div>
                <div className="result-label">Edges</div>
              </div>
              <div className="result-item">
                <div className={`result-value ${results.is_dag ? 'success' : 'error'}`}>
                  {results.is_dag ? '✓' : '✗'}
                </div>
                <div className="result-label">DAG Status</div>
              </div>
            </div>
            
            <div className="dag-status">
              <div className={`status-badge ${results.is_dag ? 'success' : 'error'}`}>
                {results.is_dag ? 'Valid DAG' : 'Not a DAG'}
              </div>
              <p className="status-description">
                {results.is_dag 
                  ? 'Your pipeline forms a valid Directed Acyclic Graph with no cycles.'
                  : 'Your pipeline contains cycles and cannot be executed sequentially.'
                }
              </p>
            </div>

            <button 
              className="btn btn-secondary copy-btn"
              onClick={() => {
                const text = `Pipeline Analysis Results:\nNodes: ${results.num_nodes}\nEdges: ${results.num_edges}\nDAG Status: ${results.is_dag ? 'Valid' : 'Invalid'}`;
                navigator.clipboard.writeText(text);
              }}
            >
              📋 Copy Results
            </button>
          </div>
        )}

        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      alert("Please add at least one node to the pipeline before submitting.");
      return;
    }

    setIsModalOpen(true);
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      
      // Send data to backend
      const response = await fetch('http://localhost:8001/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodes: nodes.map(node => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: node.data
          })),
          edges: edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const backendResults = await response.json();
      
      // Combine local and backend results
      const finalResults = {
        num_nodes: backendResults.num_nodes,
        num_edges: backendResults.num_edges,
        is_dag: backendResults.is_dag
      };

      setResults(finalResults);
    } catch (err) {
      console.error('Error submitting pipeline:', err);
      setError(err.message || 'Failed to analyze pipeline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="submit-container">
      <button
        onClick={handleSubmit}
        className="btn submit-btn"
        title="Submit pipeline for analysis"
      >
        🚀 Submit Pipeline
      </button>

      <ResultsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        results={results}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};
