// Inspired by Clément Mihailescu's pathfinding project.
// All algorithms written independently with only certain functions used from 
// Mihailescu's Youtube tutorial.

export function dijkstra(grid, startNode, finishNode) {
  makeWallsVisitedNodes(grid);
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
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

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
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
