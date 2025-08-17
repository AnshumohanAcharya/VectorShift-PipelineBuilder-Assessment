from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class Edge(BaseModel):
    id: str
    source: str
    target: str
    type: str = "smoothstep"

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse', response_model=PipelineResponse)
def parse_pipeline(pipeline: Pipeline):
    """
    Analyze a pipeline to determine:
    - Number of nodes
    - Number of edges  
    - Whether it forms a directed acyclic graph (DAG)
    """
    try:
        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)
        
        # Check if the pipeline is a DAG using topological sort
        is_dag = check_is_dag(pipeline.nodes, pipeline.edges)
        
        return PipelineResponse(
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analyzing pipeline: {str(e)}")

def check_is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the pipeline forms a directed acyclic graph using topological sort.
    Returns True if it's a DAG, False if it contains cycles.
    """
    if not nodes:
        return True
    
    # Create adjacency list and in-degree counter
    graph = {}
    in_degree = {}
    
    # Initialize
    for node in nodes:
        graph[node.id] = []
        in_degree[node.id] = 0
    
    # Build graph from edges
    for edge in edges:
        if edge.source in graph and edge.target in in_degree:
            graph[edge.source].append(edge.target)
            in_degree[edge.target] += 1
    
    # Topological sort to detect cycles
    queue = []
    visited = set()
    
    # Add nodes with 0 in-degree to queue
    for node_id, degree in in_degree.items():
        if degree == 0:
            queue.append(node_id)
    
    count = 0
    while queue:
        current = queue.pop(0)
        visited.add(current)
        count += 1
        
        # Reduce in-degree of neighbors
        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we visited all nodes, it's a DAG
    # If count < len(nodes), there are cycles
    return count == len(nodes)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
