export function greedybfs(grid, startNode, finishNode) {
  makeWallsVisitedNodes(grid);
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = [];
  unvisitedNodes.push(startNode);
  visitedNodesInOrder.push(startNode);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes, finishNode);
    const closestNode = unvisitedNodes.shift();
    if (closestNode === finishNode) return visitedNodesInOrder;
    const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
   
    for (const neighbor of unvisitedNeighbors) {
      neighbor.previousNode = closestNode;
      if (neighbor.isVisited === false) {
        neighbor.isVisited = true;
        unvisitedNodes.push(neighbor);
      }
    }
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
  }
  return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes, finishNode) {
  unvisitedNodes.sort((nodeA, nodeB) => heuristic(nodeA, finishNode) - heuristic(nodeB, finishNode));
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
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