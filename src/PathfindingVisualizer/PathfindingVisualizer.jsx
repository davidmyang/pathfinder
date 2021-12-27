import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {astar} from '../algorithms/astar';
import {dfs} from '../algorithms/dfs';
import {bfs} from '../algorithms/bfs';
import {greedybfs} from '../algorithms/greedybfs';
import './PathfindingVisualizer.css';

const num_grid_rows = window.innerHeight/48;
const num_grid_cols = window.innerWidth/30;

const START_NODE_ROW = Math.floor(num_grid_rows/2);
const START_NODE_COL = Math.floor(num_grid_cols/5);
const FINISH_NODE_ROW = Math.floor(num_grid_rows/2);
const FINISH_NODE_COL = Math.floor(num_grid_cols/5*4);

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  resetGrid(grid) {
    const newGrid = clearGrid(grid);
    this.setState({newGrid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 20 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 20 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAstar() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDFS() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeBFS() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeGreedyBFS() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = greedybfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {grid, mouseIsPressed} = this.state;
  
    return (
      <>
        
        <button className="algBtn" onClick={() => this.visualizeDijkstra()}>
          Dijkstra's Algorithm
        </button>
        <button className="algBtn" onClick={() => this.visualizeAstar()}>
          A* Algorithm
        </button>
        <button className="algBtn" onClick={() => this.visualizeDFS()}>
          DFS Algorithm
        </button>
        <button className="algBtn" onClick={() => this.visualizeBFS()}>
          BFS Algorithm
        </button>
        <button className="algBtn" onClick={() => this.visualizeGreedyBFS()}>
          Greedy BFS Algorithm
        </button>

        <button className="clearBtn" onClick={() => this.resetGrid(this.state.grid)}>
          Clear Board
        </button>
  
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

// Building the grid
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < num_grid_rows; row++) {
    const currentRow = [];
    for (let col = 0; col < num_grid_cols; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const clearGrid = (grid) => {
  for (const row of grid) {
    for (const node of row) {
      if (node.row === START_NODE_ROW && node.col === START_NODE_COL) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-start';
      }
      else if (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-finish';
      }
      else {
        document.getElementById(`node-${node.row}-${node.col}`).className =
        'node';
      }
      node.isWall = false;
      node.isVisited = false;
      node.previousNode = null;
      node.distance = Infinity;
    }
  }
  
};

// Creating each node on the grid
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === Math.floor(START_NODE_ROW) && col === Math.floor(START_NODE_COL),
    isFinish: row === Math.floor(FINISH_NODE_ROW) && col === Math.floor(FINISH_NODE_COL),
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

