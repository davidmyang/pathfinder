export function astar(grid, startNode, finishNode) {
  makeWallsVisitedNodes(grid);
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes, finishNode);
    const closestNode = unvisitedNodes.shift();
    const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);

    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;

    for (const neighbor of unvisitedNeighbors) {
      const alt = closestNode.distance + 1;
      if (alt < neighbor.distance) {
          neighbor.distance = alt;
          neighbor.previousNode = closestNode;
      }
    }
  }
  return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes, finishNode) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance
                                        + heuristic(nodeA, finishNode) - heuristic(nodeB, finishNode));
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

function makeWallsVisitedNodes(grid) {
  for (const row of grid) {
    for (const node of row) {
      if (node.isWall) node.isVisited = true;
    }
  }
}

function heuristic(currentNode, finishNode) {
  return (Math.abs(currentNode.row - finishNode.row) + 
          Math.abs(currentNode.col - finishNode.col));
}
