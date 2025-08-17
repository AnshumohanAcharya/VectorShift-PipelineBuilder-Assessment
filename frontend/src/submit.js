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

// Check if the pipeline forms a Directed Acyclic Graph (DAG)
const checkIsDAG = (nodes, edges) => {
  if (!nodes.length) return true;

  // Create adjacency list and in-degree count
  const graph = {};
  const inDegree = {};
  
  // Initialize
  nodes.forEach(node => {
    graph[node.id] = [];
    inDegree[node.id] = 0;
  });

  // Build graph
  edges.forEach(edge => {
    if (graph[edge.source] && inDegree[edge.target] !== undefined) {
      graph[edge.source].push(edge.target);
      inDegree[edge.target]++;
    }
  });

  // Topological sort using Kahn's algorithm
  const queue = [];
  const visited = new Set();
  
  // Add nodes with no incoming edges
  Object.keys(inDegree).forEach(nodeId => {
    if (inDegree[nodeId] === 0) {
      queue.push(nodeId);
    }
  });

  let count = 0;
  while (queue.length > 0) {
    const current = queue.shift();
    visited.add(current);
    count++;

    // Reduce in-degree of neighbors
    graph[current].forEach(neighbor => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }

  return count === nodes.length;
};

// Results Modal Component
const ResultsModal = ({ isOpen, onClose, results, isLoading, error }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {isLoading ? '⏳' : error ? '❌' : '🎯'}
          </div>
          <h2 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            {isLoading ? 'Analyzing Pipeline...' : error ? 'Analysis Failed' : 'Pipeline Analysis Complete'}
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#6b7280', 
            fontSize: '16px' 
          }}>
            {isLoading ? 'Please wait while we analyze your pipeline structure' : 
             error ? 'There was an error analyzing your pipeline' : 
             'Your pipeline has been successfully analyzed'}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Processing pipeline data...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '8px', 
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{ 
              margin: 0, 
              color: '#dc2626', 
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Results */}
        {results && !isLoading && !error && (
          <div style={{ marginBottom: '24px' }}>
            {/* Success Badge */}
            <div style={{
              backgroundColor: '#d1fae5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <span style={{ 
                color: '#059669', 
                fontSize: '14px', 
                fontWeight: '600' 
              }}>
                ✅ Pipeline Analysis Successful
              </span>
            </div>

            {/* Results Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Node Count */}
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', color: '#3b82f6', marginBottom: '8px' }}>
                  {results.num_nodes}
                </div>
                <div style={{ fontSize: '14px', color: '#1e40af', fontWeight: '600' }}>
                  Nodes
                </div>
              </div>

              {/* Edge Count */}
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', color: '#10b981', marginBottom: '8px' }}>
                  {results.num_edges}
                </div>
                <div style={{ fontSize: '14px', color: '#047857', fontWeight: '600' }}>
                  Edges
                </div>
              </div>

              {/* DAG Status */}
              <div style={{
                backgroundColor: results.is_dag ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${results.is_dag ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '32px', 
                  color: results.is_dag ? '#10b981' : '#dc2626', 
                  marginBottom: '8px' 
                }}>
                  {results.is_dag ? '✓' : '✗'}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: results.is_dag ? '#047857' : '#dc2626', 
                  fontWeight: '600' 
                }}>
                  {results.is_dag ? 'Valid DAG' : 'Not a DAG'}
                </div>
              </div>
            </div>

            {/* DAG Explanation */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '14px', 
                color: '#374151',
                fontWeight: '600'
              }}>
                What is a DAG?
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: '13px', 
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                A Directed Acyclic Graph (DAG) is a pipeline structure where data flows in one direction 
                without any circular dependencies. This ensures your pipeline can execute without getting stuck in loops.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center' 
        }}>
          {!isLoading && (
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#6b7280';
              }}
            >
              Close
            </button>
          )}
          
          {results && !isLoading && !error && (
            <button
              onClick={() => {
                // Copy results to clipboard
                const resultText = `Pipeline Analysis Results:
Nodes: ${results.num_nodes}
Edges: ${results.num_edges}
Valid DAG: ${results.is_dag ? 'Yes' : 'No'}`;
                navigator.clipboard.writeText(resultText);
                alert('Results copied to clipboard!');
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
              }}
            >
              📋 Copy Results
            </button>
          )}
        </div>
      </div>

      {/* CSS Animation for Loading Spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
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
      // Perform local DAG check
      const isDAG = checkIsDAG(nodes, edges);
      
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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      width: '100%'
    }}>
      <button
        onClick={handleSubmit}
        style={{
          padding: '16px 32px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#059669';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#10b981';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}
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
