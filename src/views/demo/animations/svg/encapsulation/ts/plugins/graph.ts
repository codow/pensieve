// ========================================================
// 生成Graph，并提供寻路算法
// @author wangyb
// @createTime 2023-06-06 11:10:31
// ========================================================

import { Point, PointArray, isPoint } from "../interfaces";
import { toFixed } from "../utils/math";
import { defineInnerProps } from "../utils/object";

const DefaultSize = 20;

const MathSize = 1000000;

interface MeshGraphArea {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const emptyArea: MeshGraphArea = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
};

const maxArea: MeshGraphArea = {
  x1: -MathSize,
  y1: -MathSize,
  x2: MathSize,
  y2: MathSize,
};

class MeshGraphCell implements MeshGraphArea {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  rowIndex: number;
  colIndex: number;
  passable: boolean;
  obstacle: MeshGraphArea;
  graph: MeshGraph;

  constructor(
    graph: MeshGraph,
    rowIndex: number,
    colIndex: number,
    options: MeshGraphArea = emptyArea
  ) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.x1 = options.x1;
    this.y1 = options.y1;
    this.x2 = options.x2;
    this.y2 = options.y2;
    this.passable = true;
    this.obstacle = null;
    defineInnerProps(this, {
      graph: {
        value: graph,
      },
    });
  }

  setObstacle(area: MeshGraphArea) {
    if (!area) {
      return;
    }
    this.obstacle = area;
    // 当前网格是否有一部分超出障碍区域
    // this.passable =
    //   this.x1 < area.x1 ||
    //   this.y1 < area.y1 ||
    //   this.x2 > area.x2 ||
    //   this.y2 > area.x2;
    this.passable = false;
  }

  nextCells(target?: MeshGraphCell) {
    let graph = this.graph;
    let { rowIndex, colIndex } = this;
    // 上 右 下 左
    let cells = [
      graph.get([rowIndex - 1, colIndex]),
      graph.get([rowIndex, colIndex + 1]),
      graph.get([rowIndex + 1, colIndex]),
      graph.get([rowIndex, colIndex - 1]),
    ].filter((item) => !!item);
    // console.log(this);
    // console.log("cells", cells);
    if (target) {
      cells.sort((cellA, cellB) => {
        // console.log(cellA.distanceFrom(target), cellB.distanceFrom(target));
        return cellA.distanceFrom(target) - cellB.distanceFrom(target);
      });
    }
    // console.log("cells", cells);
    // debugger;
    return cells;
  }

  isUnreachable() {
    let cells = this.nextCells();
    return cells.length > 0 && cells.every((cell) => !cell.passable);
  }

  // 距离目标网格有多远
  distanceFrom(target: MeshGraphCell) {
    return (
      Math.abs(target.rowIndex - this.rowIndex) +
      Math.abs(target.colIndex - this.colIndex)
    );
  }

  // 当前网格的权重
  weight(): number {
    return Math.max(this.x2 - this.x1, this.y2 - this.y1);
  }

  equals(target: MeshGraphCell) {
    if (!target) {
      return false;
    }
    return (
      this === target ||
      (this.rowIndex === target.rowIndex && this.colIndex === target.colIndex)
    );
  }

  centerPoint(): PointArray {
    return [
      toFixed(this.x1 + (this.x2 - this.x1) / 2, 1),
      toFixed(this.y1 + (this.y2 - this.y1) / 2, 1),
    ];
  }
}

class MeshGraphRow extends Array<MeshGraphCell> {
  [index: number]: MeshGraphCell;
}

class MeshGraph implements MeshGraphArea {
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  size: number = DefaultSize;
  cells: Array<MeshGraphRow>;

  constructor(options: MeshGraphArea) {
    this.x1 = options.x1;
    this.y1 = options.y1;
    this.x2 = options.x2;
    this.y2 = options.y2;
    defineInnerProps(this, {
      cells: {
        value: [],
      },
    });
  }

  rowLength() {
    return this.cells.length;
  }

  colLength() {
    return this.cells.length && this.cells[0].length;
  }

  push(row: MeshGraphRow) {
    this.cells.push(row);
  }

  get(
    [rowIndex, colIndex]: MeshGraphIndex,
    ignoreOverflow = false
  ): MeshGraphCell {
    let rowLength = this.rowLength();
    let colLength = this.colLength();
    // 超出范围
    if (ignoreOverflow) {
      colIndex = Math.max(colIndex, 0);
      colIndex = Math.min(colIndex, colLength > 0 ? colLength - 1 : 0);
      rowIndex = Math.max(rowIndex, 0);
      colIndex = Math.min(rowIndex, rowLength > 0 ? rowLength - 1 : 0);
    }
    if (
      colIndex < 0 ||
      colIndex >= colLength ||
      rowIndex < 0 ||
      rowIndex >= rowLength
    ) {
      // if (process.env.NODE_ENV !== "production") {
      //   console.error(new Error("查询的位置不在网格图内部"));
      // }
      return null;
    }
    return this.cells[rowIndex][colIndex];
  }
}

interface MeshGraphIndex extends Array<number> {
  [0]: number;
  [1]: number;
}

/**
 * 取一组区域相交的区域
 * @param areas 区域数组
 * @returns 相交区域
 */
const intersectArea = function (...areas: Array<MeshGraphArea>): MeshGraphArea {
  if (!areas.length) {
    return null;
  }
  let _area = Object.assign({}, maxArea);
  areas.forEach((item) => {
    _area.x1 = Math.max(_area.x1, item.x1);
    _area.y1 = Math.max(_area.y1, item.y1);
    _area.x2 = Math.min(_area.x2, item.x2);
    _area.y2 = Math.min(_area.y2, item.y2);
  });
  // 没有相交
  if (_area.x1 >= _area.x2 || _area.y1 >= _area.y2) {
    return null;
  }
  return _area;
};

/**
 * 取一组区域合并的区域
 * @param areas 区域数组
 * @returns 合并区域
 */
const mergeArea = function (...areas: Array<MeshGraphArea>): MeshGraphArea {
  if (!areas.length) {
    return null;
  }
  let _area = {
    x1: MathSize,
    y1: MathSize,
    x2: -MathSize,
    y2: -MathSize,
  };
  areas.forEach((item) => {
    _area.x1 = Math.min(_area.x1, item.x1);
    _area.y1 = Math.min(_area.y1, item.y1);
    _area.x2 = Math.max(_area.x2, item.x2);
    _area.y2 = Math.max(_area.y2, item.y2);
  });
  // 没有相交
  if (_area.x1 >= _area.x2 || _area.y1 >= _area.y2) {
    return null;
  }
  return _area;
};

/**
 * 生成网格
 * @param area
 * @param obstacles
 * @param size
 */
export function generateMeshGraph(
  area: MeshGraphArea,
  obstacles: Array<MeshGraph> = [],
  size: number = DefaultSize
): MeshGraph {
  let graph = new MeshGraph(area);
  graph.size = size;
  let rowCount = Math.ceil(toFixed(graph.y2 - graph.y1, 1) / size);
  let colCount = Math.ceil(toFixed(graph.x2 - graph.x1, 1) / size);
  let row, cell, x, y;
  for (let i = 0; i < rowCount; i++) {
    row = new MeshGraphRow();
    for (let j = 0; j < colCount; j++) {
      x = graph.x1 + size * j;
      y = graph.y1 + size * i;
      cell = new MeshGraphCell(graph, i, j, {
        x1: x,
        y1: y,
        x2: x + size,
        y2: y + size,
      });
      row.push(cell);
    }
    graph.push(row);
  }
  // 遍历障碍，并给每个网格设置障碍大小
  obstacles.forEach((obstacle) => {
    // 查询涉及的区域
    let cells = getCellsByArea(graph, obstacle);
    cells.forEach((cell) => {
      let iArea = intersectArea(cell, obstacle);
      if (!iArea) {
        return;
      }
      if (cell.obstacle) {
        iArea = mergeArea(cell.obstacle, iArea);
      }
      cell.setObstacle(iArea);
    });
  });
  return graph;
}

export function getCellByPosition(
  graph: MeshGraph,
  p: Point | PointArray,
  ignoreOverflow?: boolean
): MeshGraphCell {
  let x, y;
  if (isPoint(p)) {
    x = p.x;
    y = p.y;
  } else {
    x = p[0];
    y = p[1];
  }
  // 根据map的值判断
  let size = graph.size;
  let offsetX = graph.x1;
  let offsetY = graph.y1;
  x = x - offsetX;
  y = y - offsetY;
  // (x % size === 0 ? 1 : 0)避免取边界值
  let colIndex = Math.floor(x / size) - (x > 0 && x % size === 0 ? 1 : 0);
  let rowIndex = Math.floor(y / size) - (y > 0 && y % size === 0 ? 1 : 0);

  return graph.get([rowIndex, colIndex], ignoreOverflow);
}

export function getCellsByArea(
  graph: MeshGraph,
  area: MeshGraphArea
): Array<MeshGraphCell> {
  let result: Array<MeshGraphCell> = [];
  // 取区域与网格图的相交部分
  let iArea = intersectArea(graph, area);
  if (!iArea) {
    return result;
  }
  let { x1, y1, x2, y2 } = iArea;
  let leftTopCell = getCellByPosition(graph, [x1, y1]);
  let rightBottomCell = getCellByPosition(graph, [x2, y2]);
  // 取得一个行/索引范围
  let minRowIndex = -1,
    maxRowIndex = -1,
    minColIndex = -1,
    maxColIndex = -1;
  if (leftTopCell) {
    minRowIndex = leftTopCell.rowIndex;
    minColIndex = leftTopCell.colIndex;
  }
  if (rightBottomCell) {
    maxRowIndex = rightBottomCell.rowIndex;
    maxColIndex = rightBottomCell.colIndex;
  }
  for (let i = minRowIndex; i <= maxRowIndex; i++) {
    for (let j = minColIndex; j <= maxColIndex; j++) {
      result.push(graph.get([i, j]));
    }
  }
  return result;
}

const getPathsByCells = function (
  source: MeshGraphCell,
  target: MeshGraphCell,
  onlyPassable = true,
  prePath: Array<MeshGraphCell> = []
): Array<Array<MeshGraphCell>> {
  // 当前路径
  let path: Array<MeshGraphCell> = [source];
  let nextCells = source.nextCells(target);
  let nextCell: MeshGraphCell = nextCells.find((item) => item.equals(target));
  // 下一个包含目标
  if (nextCell) {
    // 只记录一个当前节点到目标节点的路径
    path.push(nextCell);
    return [path];
  }
  let allUnpassabled = nextCells.every((cell) => !cell.passable);
  let nextPaths: Array<Array<MeshGraphCell>> = [];
  nextCells.some((item) => {
    // 不能走回头路
    if (prePath.includes(item)) {
      return false;
    }
    if (onlyPassable && !allUnpassabled && !item.passable) {
      return false;
    }
    // 递归查询后续节点是否有可达
    nextPaths = getPathsByCells(
      item,
      target,
      onlyPassable,
      prePath.concat(path)
    );
    return nextPaths.length > 0;
  });
  // 给所有后续路径拼接前面的路径
  return nextPaths.map((nextPath) => {
    return path.concat(nextPath);
  });
};

export function pathfinding(
  source: MeshGraphCell,
  target: MeshGraphCell
): Array<MeshGraphCell> {
  // 开始和目标为同一个区域
  if (source.equals(target)) {
    return [source];
  }
  let paths = getPathsByCells(source, target, !target.isUnreachable());
  if (!paths || !paths.length) {
    paths = getPathsByCells(source, target);
  }
  return paths[0];
}

export function pathfindingByPoints(
  graph: MeshGraph,
  sourceP: PointArray,
  targetP: PointArray
): PointArray {
  let source = getCellByPosition(graph, sourceP);
  let target = getCellByPosition(graph, targetP);
  if (!source || !target) {
    return [];
  }
  let path = pathfinding(source, target);
  if (!path.length) {
    return [];
  }
  console.log([].concat(path));
  // 转为点集合
  let result: PointArray = [sourceP[0], sourceP[1]];
  // 移除开始
  path.splice(0, 1);
  let cornerCell: MeshGraphCell = source;
  let lastCell: MeshGraphCell = source;
  path.forEach((nextCell) => {
    let cornerChange;
    if (cornerCell.rowIndex === lastCell.rowIndex) {
      if (nextCell.rowIndex !== lastCell.rowIndex) {
        cornerChange = true;
      }
    } else if (cornerCell.colIndex === lastCell.colIndex) {
      if (nextCell.colIndex !== lastCell.colIndex) {
        cornerChange = true;
      }
    }
    if (cornerChange) {
      cornerCell = lastCell;
      let centerP = lastCell.centerPoint();
      result.push(centerP[0]);
      result.push(centerP[1]);
    }
    lastCell = nextCell;
  });
  result.push(targetP[0]);
  result.push(targetP[1]);
  return result;
}
