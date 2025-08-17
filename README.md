# VectorShift Frontend Technical Assessment

A React-based pipeline builder with drag-and-drop nodes, built for VectorShift's technical assessment.

## Features

### ✅ Part 1: Node Abstraction
- **Base Node Class**: Created a flexible abstraction that reduces code duplication
- **5 New Node Types**: 
  - Transform Node (uppercase, lowercase, capitalize, reverse, custom)
  - Filter Node (contains, starts_with, ends_with, equals, regex)
  - Merge Node (concatenate, join, union, intersection)
  - Conditional Node (equals, greater_than, less_than, contains, regex)
  - Aggregate Node (sum, average, count, min, max, custom)

### ✅ Part 2: Styling
- **Modern Design**: Clean, unified design with consistent color scheme
- **Interactive Elements**: Hover effects, smooth transitions, and visual feedback
- **Responsive Layout**: Organized toolbar with categorized node groups
- **Professional UI**: Shadow effects, rounded corners, and modern typography

### ✅ Part 3: Text Node Logic
- **Dynamic Sizing**: Node width and height adjust based on text content
- **Variable Detection**: Automatically detects `{{variableName}}` patterns
- **Dynamic Handles**: Creates input handles for each detected variable
- **Real-time Updates**: Handles update as you type

### ✅ Part 4: Backend Integration
- **FastAPI Backend**: Python backend with pipeline analysis
- **DAG Detection**: Checks if pipeline forms a directed acyclic graph
- **Pipeline Analysis**: Counts nodes and edges
- **User-friendly Alerts**: Displays results in formatted alerts
- **Fallback Support**: Local analysis if backend is unavailable

## Project Structure

```
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── nodes/           # Node components
│   │   │   ├── baseNode.js  # Base node abstraction
│   │   │   ├── inputNode.js
│   │   │   ├── outputNode.js
│   │   │   ├── llmNode.js
│   │   │   ├── textNode.js
│   │   │   ├── transformNode.js
│   │   │   ├── filterNode.js
│   │   │   ├── mergeNode.js
│   │   │   ├── conditionalNode.js
│   │   │   └── aggregateNode.js
│   │   ├── App.js           # Main app component
│   │   ├── ui.js            # Pipeline UI
│   │   ├── toolbar.js       # Node toolbar
│   │   ├── submit.js        # Submit button with backend integration
│   │   ├── store.js         # Zustand state management
│   │   └── index.css        # Global styles
│   └── package.json
├── backend/                  # Python FastAPI backend
│   ├── main.py              # API endpoints
│   └── requirements.txt     # Python dependencies
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will run on http://localhost:3000

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run on http://localhost:8000

## How to Use

1. **Build a Pipeline**: Drag nodes from the toolbar to the canvas
2. **Connect Nodes**: Click and drag from output handles to input handles
3. **Configure Nodes**: Click on nodes to configure their settings
4. **Text Variables**: Use `{{variableName}}` in text nodes to create dynamic inputs
5. **Analyze Pipeline**: Click "Analyze Pipeline" to check DAG validity

## Node Types

### Core Nodes
- **Input**: Data entry points with configurable types
- **Output**: Data display endpoints
- **LLM**: Language model processing node
- **Text**: Text processing with variable support

### Data Operation Nodes
- **Transform**: Apply transformations to data
- **Filter**: Filter data based on conditions
- **Merge**: Combine multiple data streams
- **Conditional**: Apply conditional logic
- **Aggregate**: Perform data aggregation

## Technical Implementation

### Node Abstraction
The `BaseNode` class provides:
- Consistent styling and layout
- Automatic handle positioning
- Configurable inputs/outputs
- Flexible content rendering

### DAG Detection
Uses topological sorting algorithm to detect cycles:
1. Build adjacency list from edges
2. Calculate in-degrees for each node
3. Process nodes with 0 in-degree
4. Check if all nodes are visited

### State Management
- Zustand for global state
- ReactFlow for pipeline visualization
- Real-time updates and synchronization

## API Endpoints

- `GET /`: Health check
- `POST /pipelines/parse`: Analyze pipeline structure

## Future Enhancements

- Node validation and error handling
- Pipeline templates and saving
- Real-time collaboration
- Advanced node configurations
- Performance optimizations

## Technologies Used

- **Frontend**: React, ReactFlow, Zustand
- **Backend**: Python, FastAPI, Pydantic
- **Styling**: CSS-in-JS with modern design principles
- **Build Tools**: Create React App, npm
