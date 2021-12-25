export function dfs(grid, startNode, finishNode) {
  makeWallsVisitedNodes(grid);
  const visitedNodesInOrder = [];
  const unvisitedNodes = [];
  unvisitedNodes.push(startNode);

  while (!!unvisitedNodes.length) {
    const currentNode = unvisitedNodes.pop();
    visitedNodesInOrder.push(currentNode);
    currentNode.isVisited = true;
    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
   
    for (const neighbor of unvisitedNeighbors) {
      neighbor.previousNode = currentNode;
      if (neighbor === finishNode) {
        return visitedNodesInOrder;
      }
      else {
        unvisitedNodes.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
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