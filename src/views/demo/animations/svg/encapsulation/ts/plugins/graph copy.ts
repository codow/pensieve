// ========================================================
// 生成Graph，并提供寻路算法
// @author wangyb
// @createTime 2023-06-06 11:10:31
// ========================================================

import { ColorEnum, DirectionEnum } from "../constants";
import { Point, PointArray, isPoint } from "../interfaces";
import { toFixed } from "../utils/math";
import { defineInnerProps } from "../utils/object";

const DefaultSize = 10;

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

interface MeshGraphOptions extends MeshGraphArea {
  size: number;
  showGraphMap: boolean;
  [name: number | string | symbol]: any;
}

class PathNode {
  rowIndex: number;
  colIndex: number;
  parent: PathNode;
  cost: number;
  children: Array<PathNode>;
  direction: DirectionEnum;

  constructor(
    [rowIndex, colIndex]: PointArray,
    parent: PathNode = null,
    cost = -1,
    direction: DirectionEnum = DirectionEnum.Center
  ) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.parent = parent;
    this.cost = cost;
    this.direction = direction;
  }

  push(child: PathNode) {
    this.children.push(child);
  }
}

class MeshGraphCell implements MeshGraphArea {
  id: string;
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
    this.id = rowIndex + "x" + colIndex;
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
    // 上 下 左 右
    let cells = [
      this.nextCell(DirectionEnum.Up),
      this.nextCell(DirectionEnum.Down),
      this.nextCell(DirectionEnum.Left),
      this.nextCell(DirectionEnum.Right),
    ].filter((item) => !!item);
    if (target) {
      cells.sort((cellA, cellB) => {
        return cellA.distanceFrom(target) - cellB.distanceFrom(target);
      });
    }
    return cells;
  }

  nextCell(type: DirectionEnum) {
    switch (type) {
      case DirectionEnum.Up:
        return this.graph.get([this.rowIndex - 1, this.colIndex]);
      case DirectionEnum.Down:
        return this.graph.get([this.rowIndex + 1, this.colIndex]);
      case DirectionEnum.Left:
        return this.graph.get([this.rowIndex, this.colIndex - 1]);
      case DirectionEnum.Right:
        return this.graph.get([this.rowIndex, this.colIndex + 1]);
      case DirectionEnum.UpLeft:
      case DirectionEnum.LeftUp:
      case DirectionEnum.UpLeftCenter:
        return this.graph.get([this.rowIndex - 1, this.colIndex - 1]);
      case DirectionEnum.DownLeft:
      case DirectionEnum.LeftDown:
      case DirectionEnum.DownLeftCenter:
        return this.graph.get([this.rowIndex + 1, this.colIndex - 1]);
      case DirectionEnum.UpRight:
      case DirectionEnum.RightUp:
      case DirectionEnum.UpRightCenter:
        return this.graph.get([this.rowIndex - 1, this.colIndex + 1]);
      case DirectionEnum.RightDown:
      case DirectionEnum.DownRight:
      case DirectionEnum.DownRightCenter:
        return this.graph.get([this.rowIndex + 1, this.colIndex + 1]);
    }
  }

  /**
   * 将一个矩形按中线和对角线分割，8个区域和8条线，共十六个方向
   * @param cell
   * @returns
   */
  directionWith(cell: MeshGraphCell): DirectionEnum {
    return directionWith(
      {
        x: this.colIndex,
        y: this.rowIndex,
      },
      {
        x: cell.colIndex,
        y: cell.rowIndex,
      }
    );
  }

  isUnreachable() {
    let cells = this.nextCells();
    return cells.length > 0 && cells.every((cell) => !cell.passable);
  }

  // 距离目标网格有多远
  distanceFrom(target: MeshGraphCell, directionWeight = false) {
    let xAbsVector = Math.abs(target.rowIndex - this.rowIndex);
    let yAbsVector = Math.abs(target.colIndex - this.colIndex);
    let xWeight = 1;
    let yWeight = 1;
    // 带方向修正的距离
    if (directionWeight) {
      let direction = this.directionWith(target);
      switch (direction) {
        // 上下关系时，横向的消耗加倍
        case DirectionEnum.Up:
        case DirectionEnum.Down:
          xWeight = 2;
          break;
        // 左右关系时，纵向的消耗加倍
        case DirectionEnum.Left:
        case DirectionEnum.Right:
          yWeight = 2;
          break;
        // 斜向关系时，根据上下近，左右远时，横向消耗1.8，纵向消耗1.2
        case DirectionEnum.UpLeft:
        case DirectionEnum.DownLeft:
        case DirectionEnum.UpRight:
        case DirectionEnum.DownRight:
          xWeight = 1.8;
          yWeight = 1.2;
          break;
        // 斜向关系时，根据上下远，左右近时，横向消耗1.2，纵向消耗1.8
        case DirectionEnum.LeftUp:
        case DirectionEnum.LeftDown:
        case DirectionEnum.RightUp:
        case DirectionEnum.RightDown:
          xWeight = 1.2;
          yWeight = 1.8;
          break;
        // 斜向关系时，上下，左右相同时，横向、纵向消耗1.5
        case DirectionEnum.UpLeftCenter:
        case DirectionEnum.DownLeftCenter:
        case DirectionEnum.UpRightCenter:
        case DirectionEnum.DownRightCenter:
          xWeight = 1.5;
          yWeight = 1.5;
          break;
      }
    }
    // 曼哈顿距离带方向权重
    return xAbsVector * xWeight + yAbsVector * yWeight;
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

  centerPoint(): Point {
    return {
      x: toFixed(this.x1 + (this.x2 - this.x1) / 2, 1),
      y: toFixed(this.y1 + (this.y2 - this.y1) / 2, 1),
    };
  }
}

class MeshGraphRow extends Array<MeshGraphCell> {
  [index: number]: MeshGraphCell;
}

export class MeshGraph implements MeshGraphArea {
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  size: number = DefaultSize;
  showGraphMap = false;
  cells: Array<MeshGraphRow>;

  constructor(options: MeshGraphOptions, obstacles: Array<MeshGraphArea> = []) {
    this.x1 = options.x1;
    this.y1 = options.y1;
    this.x2 = options.x2;
    this.y2 = options.y2;
    this.size = options.size || DefaultSize;
    this.showGraphMap = !!options.showGraphMap;
    defineInnerProps(this, {
      cells: {
        value: [],
      },
    });
    this.init(obstacles);
  }

  init(obstacles: Array<MeshGraphArea> = []) {
    let rowCount = Math.ceil(toFixed(this.y2 - this.y1, 1) / this.size);
    let colCount = Math.ceil(toFixed(this.x2 - this.x1, 1) / this.size);
    let row, cell, x, y;
    for (let i = 0; i < rowCount; i++) {
      row = new MeshGraphRow();
      for (let j = 0; j < colCount; j++) {
        x = this.x1 + this.size * j;
        y = this.y1 + this.size * i;
        cell = new MeshGraphCell(this, i, j, {
          x1: x,
          y1: y,
          x2: x + this.size,
          y2: y + this.size,
        });
        row.push(cell);
      }
      this.push(row);
    }
    // 遍历障碍，并给每个网格设置障碍大小
    obstacles.forEach((obstacle) => {
      // 查询涉及的区域
      let cells = this.getCellsByArea(obstacle);
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
  }

  rowLength() {
    return this.cells.length;
  }

  colLength() {
    return this.cells.length && this.cells[0].length;
  }

  /**
   * 生成障碍图
   * 0 无障碍 1 障碍
   */
  createObstacleGraph(
    ...mustVisitCells: Array<MeshGraphCell>
  ): Array<Array<number>> {
    let cellMap = {};
    let obstacleGraph = this.cells.map((row) =>
      row.map((cell) => {
        // 记录有哪些单元格可以访问
        if (cell.passable) {
          cellMap[cell.rowIndex + "x" + cell.colIndex] = cell;
          return 0;
        }
        return 1;
      })
    );
    // 如果传入了必须访问的单元格，则强制设置为可访问的单元格
    mustVisitCells.forEach((cell) => {
      obstacleGraph[cell.rowIndex][cell.colIndex] = 0;
      cellMap[cell.rowIndex + "x" + cell.colIndex] = cell;
    });
    // 把地图分为一个个区域，相连可连的为一个区域，小区域打通与大区域的交界
    let areas: Array<Object> = [];
    // let maxArea = null;
    let visitedGraph = this.createVisitedGraph();
    let restCellMap = Object.assign({}, cellMap);
    const nextUnvisitedCell = function () {
      for (let key in restCellMap) {
        let temp = restCellMap[key];
        delete restCellMap[key];
        return temp;
      }
      return null;
    };
    const collectCellInArea = function (area: Object, cell: MeshGraphCell) {
      // 从0，0开始遍历
      let cellQueue: Array<MeshGraphCell> = [cell];
      while (cellQueue.length > 0) {
        cell = cellQueue.shift();
        let id = cell.rowIndex + "x" + cell.colIndex;
        area[id] = cell;
        delete restCellMap[id];
        visitedGraph[cell.rowIndex][cell.colIndex] = 1;
        // 更新区域边界
        if (cell.rowIndex < area["top"].rowIndex) {
          area["top"] = cell;
        }
        if (cell.rowIndex > area["bottom"].rowIndex) {
          area["bottom"] = cell;
        }
        if (cell.colIndex < area["left"].colIndex) {
          area["left"] = cell;
        }
        if (cell.colIndex > area["right"].colIndex) {
          area["right"] = cell;
        }
        // 将后续需要处理的推入队列
        cell.nextCells().forEach((item) => {
          if (
            !obstacleGraph[item.rowIndex][item.colIndex] &&
            !visitedGraph[item.rowIndex][item.colIndex]
          ) {
            if (!cellQueue.includes(item)) {
              cellQueue.push(item);
            }
          }
        });
      }
    };
    let restCell = nextUnvisitedCell();
    while (restCell) {
      let area = {
        top: restCell,
        bottom: restCell,
        left: restCell,
        right: restCell,
      };
      areas.push(area);
      collectCellInArea(area, restCell);
      restCell = nextUnvisitedCell();
    }
    areas.sort((a, b) => Object.keys(a).length - Object.keys(b).length);
    let maxArea = areas.splice(areas.length - 1, 1)[0];
    const connectedMaxArea = function (cell: MeshGraphCell, direction) {
      cell = cell.nextCell(direction);
      while (cell) {
        let id = cell.rowIndex + "x" + cell.colIndex;
        if (maxArea[id]) {
          // 已经联通
          break;
        }
        // 设置当前单元格为非障碍节点
        obstacleGraph[cell.rowIndex][cell.colIndex] = 0;
        cell = cell.nextCell(direction);
      }
    };
    areas.forEach((area) => {
      // 打通与最大区域的联系, 从上右下左开始处理
      connectedMaxArea(area["top"], DirectionEnum.Up);
      connectedMaxArea(area["right"], DirectionEnum.Right);
      connectedMaxArea(area["bottom"], DirectionEnum.Down);
      connectedMaxArea(area["left"], DirectionEnum.Left);
    });
    return obstacleGraph;
  }

  /**
   * 生成访问图
   * 0 未访问 1 已访问
   */
  createVisitedGraph(): Array<Array<number>> {
    return this.cells.map((row) => row.map(() => 0));
  }

  push(row: MeshGraphRow) {
    this.cells.push(row);
  }

  get([rowIndex, colIndex]: PointArray, ignoreOverflow = false): MeshGraphCell {
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

  getCellByPosition(
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
    let size = this.size;
    let offsetX = this.x1;
    let offsetY = this.y1;
    x = x - offsetX;
    y = y - offsetY;
    // (x % size === 0 ? 1 : 0)避免取边界值
    let colIndex = Math.floor(x / size) - (x > 0 && x % size === 0 ? 1 : 0);
    let rowIndex = Math.floor(y / size) - (y > 0 && y % size === 0 ? 1 : 0);

    return this.get([rowIndex, colIndex], ignoreOverflow);
  }

  getCellsByArea(area: MeshGraphArea): Array<MeshGraphCell> {
    let result: Array<MeshGraphCell> = [];
    // 取区域与网格图的相交部分
    let iArea = intersectArea(this, area);
    if (!iArea) {
      return result;
    }
    let { x1, y1, x2, y2 } = iArea;
    let leftTopCell = this.getCellByPosition([x1, y1]);
    let rightBottomCell = this.getCellByPosition([x2, y2]);
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
        result.push(this.get([i, j]));
      }
    }
    return result;
  }

  hasObstacleByPoints(
    points: Array<Point>,
    obstacleGraph?: Array<Array<number>>
  ) {
    if (points.length === 0) {
      return false;
    }
    let x1, y1, x2, y2;
    // 初始化
    x1 = x2 = points[0].x;
    y1 = y2 = points[0].y;
    let _x, _y;
    for (let i = 1; i < points.length; i++) {
      _x = points[i].x;
      _y = points[i].y;
      x1 = Math.min(x1, _x);
      y1 = Math.min(y1, _y);
      x2 = Math.max(x2, _x);
      y2 = Math.max(y2, _y);
    }
    // 选取区域
    return this.getCellsByArea({ x1, y1, x2, y2 }).some((item) =>
      obstacleGraph
        ? obstacleGraph[item.rowIndex][item.colIndex]
        : item.obstacle
    );
  }

  pathfinding(
    source: MeshGraphCell,
    target: MeshGraphCell,
    showGraphMap = this.showGraphMap,
    obstacleGraph?: Array<Array<number>>
  ): Array<MeshGraphCell> {
    // 开始和目标为同一个区域
    if (source.equals(target)) {
      return [source];
    }
    // 障碍地图
    obstacleGraph = obstacleGraph || this.createObstacleGraph(source, target);
    // 已访问地图
    let visitedGraph = this.createVisitedGraph();
    // 路径节点缓存
    let pathNodeGraph: Array<Array<PathNode>> = [];
    // 显示图示
    let model;
    if (showGraphMap) {
      model = openGraphModel(obstacleGraph, source, target);
    }
    const setPathNode = function (
      node: PathNode,
      rowIndex: number,
      colIndex: number
    ) {
      if (!pathNodeGraph[rowIndex]) {
        pathNodeGraph[rowIndex] = [];
      }
      pathNodeGraph[rowIndex][colIndex] = node;
    };

    const getPathNode = function (
      rowIndex: number,
      colIndex: number
    ): PathNode {
      return pathNodeGraph[rowIndex] && pathNodeGraph[rowIndex][colIndex];
    };

    const findLessCostPathNodeIndex = function (cIndex) {
      // 查找后续是否存在更有
      let cpn =
        pathNodeGraph[cellQueue[cIndex].rowIndex][cellQueue[cIndex].colIndex];
      let nextPn;
      for (let i = cIndex + 1; i < cellQueue.length; i++) {
        nextPn = pathNodeGraph[cellQueue[i].rowIndex][cellQueue[i].colIndex];
        if (nextPn.cost < cpn.cost) {
          return i;
        }
      }
      return cIndex;
    };

    // 用来记录到目标节点的位置
    let endPathNode = null;
    // 用来遍历是否还有未走的单元格
    let cellQueue: Array<MeshGraphCell> = [];
    // 加入开始节点
    cellQueue.push(source);
    // 设置当前父节点为起始节点, 开始节点的父节点为null, 开销为0
    let parentNode = new PathNode([source.rowIndex, source.colIndex], null, 0);
    // 记录PathNode，重复使用
    setPathNode(parentNode, source.rowIndex, source.colIndex);
    let nextCells: Array<MeshGraphCell>;
    let nextCellDirctionMap: { [id: string]: DirectionEnum };
    let nextCellCostMap: { [id: string]: number };

    while (cellQueue.length > 0) {
      // 获取更少开销的点
      let currentIndex = findLessCostPathNodeIndex(0);
      // 获取当前队列最小开销的点
      let cell = cellQueue[currentIndex];
      // 获取或生成路径节点
      let currentPathNode = getPathNode(cell.rowIndex, cell.colIndex);
      // 移除队列
      cellQueue.splice(currentIndex, 1);
      // 如果是结束节点, 则不再需要往下找
      if (cell === target) {
        endPathNode = currentPathNode;
        break;
      }
      // 处理周围节点
      nextCells = cell
        .nextCells()
        // 过来掉障碍物和已经被处理过的节点
        .filter(
          (item) =>
            !obstacleGraph[item.rowIndex][item.colIndex] &&
            !visitedGraph[item.rowIndex][item.colIndex]
        );
      // 初始化开销和方向缓存
      nextCellDirctionMap = {};
      nextCellCostMap = {};
      nextCells.forEach((item) => {
        // 判断当前方向
        let direction = cell.directionWith(item);
        let changeDirectionCost = 0; // direction !== currentPathNode.direction ? 10 : 0;
        // 计算开销
        let cost =
          currentPathNode.cost +
          this.get([item.rowIndex, item.colIndex]).distanceFrom(target) +
          changeDirectionCost;
        nextCellDirctionMap[item.id] = direction;
        nextCellCostMap[item.id] = cost;
      });
      // 按照开销排序
      nextCells.sort((cellA, cellB) => {
        // 带上改变方向的开销
        let costA = nextCellCostMap[cellA.id];
        let costB = nextCellCostMap[cellB.id];
        return costA - costB;
      });
      // 处理后续节点，生成路径节点对象，记录开销、方向等信息
      nextCells.forEach((item) => {
        // 设置pathNode
        let cost = nextCellCostMap[item.id];
        let direction = nextCellDirctionMap[item.id];
        let nextPathNode = getPathNode(item.rowIndex, item.colIndex);
        if (!nextPathNode) {
          nextPathNode = new PathNode(
            [item.rowIndex, item.colIndex],
            currentPathNode,
            cost,
            direction
          );
        } else if (nextPathNode.cost > cost) {
          // 路线修正, 更新开销，并修改父节点
          nextPathNode.cost = cost;
          nextPathNode.parent = currentPathNode;
          nextPathNode.direction = direction;
        }
        setPathNode(nextPathNode, item.rowIndex, item.colIndex);
        if (!cellQueue.includes(item)) {
          // 推入队列
          cellQueue.push(item);
        }
      });
      // 处理完成后，设置当前节点为已被访问
      visitedGraph[cell.rowIndex][cell.colIndex] = 1;

      if (showGraphMap && cell !== source) {
        model.visitCell([cell.rowIndex, cell.colIndex]);
        model.setCellText([cell.rowIndex, cell.colIndex], currentPathNode.cost);
      }
    }
    let path = this.toCellPath(endPathNode);
    if (showGraphMap) {
      model.markPath(path);
    }
    return path;
  }

  pathfindingByPoints(
    sourceP: Point,
    targetP: Point,
    showGraphMap: boolean = this.showGraphMap
  ): Array<Point> {
    let source = this.getCellByPosition(sourceP);
    let target = this.getCellByPosition(targetP);
    if (!source || !target) {
      return [];
    }
    // 障碍地图
    let obstacleGraph = this.createObstacleGraph(source, target);
    // 寻路
    let path = this.pathfinding(source, target, showGraphMap, obstacleGraph);
    if (!path.length) {
      return [];
    }
    // 转为点集合
    let result: Array<Point> = path.map((cell) => cell.centerPoint());
    result.unshift(sourceP);
    result.push(targetP);
    // 参考起始点平移位置
    parallelTranslation(
      result[1],
      sourceP,
      directionWith(result[1], result[2])
    );
    // 参考结束点平移位置
    parallelTranslation(
      result[result.length - 2],
      targetP,
      directionWith(result[result.length - 3], result[result.length - 2])
    );
    console.log(result);
    // 减少点
    result = reducePoints(result);
    console.log(result);
    // 减少转角
    result = reduceCorners.call(this, result, obstacleGraph);
    console.log(result);
    return result;
  }

  toCellPath(node: PathNode): Array<MeshGraphCell> {
    let cells = [node];
    while (node.parent) {
      cells.unshift(node.parent);
      node = node.parent;
    }
    return cells.map((item) => this.get([item.rowIndex, item.colIndex]));
  }
}

/**
 * 创建图示
 * @param map 障碍图
 * @param source 开始点
 * @param target 结束点
 * @returns 图示对象
 */
const openGraphModel = function (
  map: Array<Array<number>>,
  source: MeshGraphCell,
  target: MeshGraphCell
) {
  let maskEl = document.createElement("div");
  let timer = null;
  maskEl.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  maskEl.style.position = "absolute";
  maskEl.style.left = "0";
  maskEl.style.top = "0";
  maskEl.style.right = "0";
  maskEl.style.bottom = "0";
  maskEl.style.zIndex = "1000";
  let rootEl = document.createElement("div");
  rootEl.style.padding = "10px";
  rootEl.style.position = "absolute";
  rootEl.style.left = "0";
  rootEl.style.top = "0";
  rootEl.style.right = "0";
  rootEl.style.bottom = "0";
  rootEl.style.margin = "auto";
  rootEl.style.width = "fit-content";
  rootEl.style.height = "fit-content";
  rootEl.style.borderRadius = "10px";
  rootEl.style.backgroundColor = ColorEnum.White;
  maskEl.appendChild(rootEl);
  let headerEl = document.createElement("div");
  rootEl.appendChild(headerEl);
  headerEl.style.textAlign = "right";
  headerEl.style.padding = "10px";
  let closeEl = document.createElement("div");
  closeEl.style.display = "inline-block";
  closeEl.style.width = "20px";
  closeEl.style.height = "20px";
  closeEl.style.lineHeight = "20px";
  closeEl.style.fontSize = "20px";
  closeEl.style.cursor = "pointer";
  closeEl.innerHTML = "X";
  // 移除弹框
  closeEl.onclick = function () {
    maskEl.remove();
    timer && clearInterval(timer);
  };
  headerEl.appendChild(closeEl);
  let contentEl = document.createElement("div");
  contentEl.style.boxSizing = "border-box";
  contentEl.style.borderBlockColor = ColorEnum.White;
  contentEl.style.border = "1px solid " + ColorEnum.Info;
  rootEl.appendChild(contentEl);
  let cellEls: Array<Array<HTMLElement>> = [];
  map.forEach((row, i) => {
    if (!cellEls[i]) {
      cellEls[i] = [];
    }
    let rowEl = document.createElement("div");
    rowEl.style.lineHeight = "0";
    row.forEach((cell, j) => {
      let cellEl = document.createElement("div");
      cellEl.style.display = "inline-block";
      cellEl.style.boxSizing = "border-box";
      cellEl.style.borderBlockColor = ColorEnum.White;
      cellEl.style.width = "18px";
      cellEl.style.height = "18px";
      cellEl.style.overflow = "hidden";
      cellEl.style.fontSize = "12px";
      cellEl.style.lineHeight = "18px";
      cellEl.style.border = "1px solid " + ColorEnum.Info;
      cellEl.dataset.row = i + "";
      cellEl.dataset.col = j + "";
      if (cell) {
        cellEl.style.backgroundColor = ColorEnum.Danger;
      }
      cellEls[i][j] = cellEl;
      rowEl.appendChild(cellEl);
    });
    contentEl.appendChild(rowEl);
  });
  cellEls[source.rowIndex][source.colIndex].style.backgroundColor =
    ColorEnum.Primary;
  cellEls[target.rowIndex][target.colIndex].style.backgroundColor =
    ColorEnum.Success;
  document.body.appendChild(maskEl);
  let operateQueue = [];
  timer = setInterval(() => {
    for (let i = 0; i < 4; i++) {
      let op = operateQueue.shift();
      if (!op) {
        return;
      }
      if (op["type"] === "changeCellBg") {
        op["cellEl"].style.backgroundColor = op["bgColor"];
      } else if (op["type"] === "changeCellText") {
        op["cellEl"].innerHTML = op["text"];
        op["cellEl"].title = op["text"];
      }
    }
  });
  return {
    $el: maskEl,
    $cellEls: cellEls,
    setCellBgColor([rowIndex, colIndex]: PointArray, color: String) {
      operateQueue.push({
        type: "changeCellBg",
        cellEl: this.$cellEls[rowIndex][colIndex],
        bgColor: color,
      });
    },
    visitCell([rowIndex, colIndex]: PointArray) {
      operateQueue.push({
        type: "changeCellBg",
        cellEl: this.$cellEls[rowIndex][colIndex],
        bgColor: ColorEnum.Warn,
      });
    },
    setCellText([rowIndex, colIndex]: PointArray, text: any) {
      operateQueue.push({
        type: "changeCellText",
        cellEl: this.$cellEls[rowIndex][colIndex],
        text: JSON.stringify(text),
      });
    },
    markPath(cells: Array<MeshGraphCell>, color: ColorEnum = ColorEnum.Yellow) {
      cells.forEach((item) => {
        if (item !== source && item !== target) {
          operateQueue.push({
            type: "changeCellBg",
            cellEl: this.$cellEls[item.rowIndex][item.colIndex],
            bgColor: color,
          });
        }
      });
    },
  };
};

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
  // 交换大小值
  let temp;
  if (_area.x1 > _area.x2) {
    temp = _area.x2;
    _area.x2 = _area.x1;
    _area.x1 = temp;
  }
  if (_area.y1 > _area.y2) {
    temp = _area.y2;
    _area.y2 = _area.y1;
    _area.y1 = temp;
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
  // 交换大小值
  let temp;
  if (_area.x1 > _area.x2) {
    temp = _area.x2;
    _area.x2 = _area.x1;
    _area.x1 = temp;
  }
  if (_area.y1 > _area.y2) {
    temp = _area.y2;
    _area.y2 = _area.y1;
    _area.y1 = temp;
  }
  return _area;
};

export const printGraph = function (graph, name) {
  let log = "";
  if (name) {
    log += name + "\n";
  }
  graph.forEach((row) => {
    row.forEach((cell) => {
      log += "\t" + cell;
    });
    log += "\n";
  });
  console.log(log);
};

export const directionWith = function (sourceP: Point, targetP: Point) {
  let xVector = targetP.x - sourceP.x;
  let xAbsVector = Math.abs(xVector);
  let yVector = targetP.y - sourceP.y;
  let yAbsVector = Math.abs(yVector);
  if (yVector === 0) {
    return xVector > 0 ? DirectionEnum.Right : DirectionEnum.Left;
  }
  if (xVector === 0) {
    return yVector > 0 ? DirectionEnum.Down : DirectionEnum.Up;
  }
  // x向量 > 0 则在右边，否则在左边
  if (xVector > 0) {
    // y向量 > 0 则在右边，否则在左边
    if (yVector > 0) {
      // 下边
      if (yAbsVector === xAbsVector) {
        return DirectionEnum.DownRightCenter;
      } else if (yAbsVector > xAbsVector) {
        return DirectionEnum.RightDown;
      } else {
        return DirectionEnum.DownRight;
      }
    } else {
      if (yAbsVector === xAbsVector) {
        return DirectionEnum.UpRightCenter;
      } else if (yAbsVector > xAbsVector) {
        return DirectionEnum.RightUp;
      } else {
        return DirectionEnum.UpRight;
      }
    }
  } else {
    // 左边
    if (yVector > 0) {
      // 上边
      if (yAbsVector === xAbsVector) {
        return DirectionEnum.UpLeftCenter;
      } else if (yAbsVector > xAbsVector) {
        return DirectionEnum.LeftUp;
      } else {
        return DirectionEnum.UpLeft;
      }
    } else {
      if (yAbsVector === xAbsVector) {
        return DirectionEnum.UpLeftCenter;
      } else if (yAbsVector > xAbsVector) {
        return DirectionEnum.LeftUp;
      } else {
        return DirectionEnum.UpLeft;
      }
    }
  }
};

export const isAlign = function (sourceP, targetP, direction) {
  switch (direction) {
    // 竖直方向对齐，需要向左右平移
    case DirectionEnum.Up:
    case DirectionEnum.Down:
      return sourceP.x === targetP.x;
    // 水平方向对齐，需要向上下平移
    case DirectionEnum.Left:
    case DirectionEnum.Right:
      return sourceP.y === targetP.y;
  }
};

export const alignPoint = function (sourceP, targetP, direction) {
  switch (direction) {
    // 竖直方向对齐，需要向左右平移
    case DirectionEnum.Up:
    case DirectionEnum.Down:
      return parallelTranslation(sourceP, targetP, DirectionEnum.Left);
    // 水平方向对齐，需要向上下平移
    case DirectionEnum.Left:
    case DirectionEnum.Right:
      return parallelTranslation(sourceP, targetP, DirectionEnum.Up);
  }
  return sourceP;
};

export const genAlignPoint = function (sourceP, targetP) {
  return { x: targetP.x, y: sourceP.y };
};

const parallelTranslation = function (sourceP, targetP, direction) {
  switch (direction) {
    case DirectionEnum.Up:
    case DirectionEnum.Down:
      sourceP.y = targetP.y;
      break;
    case DirectionEnum.Left:
    case DirectionEnum.Right:
      sourceP.x = targetP.x;
      break;
  }
  return sourceP;
};

// 直线路径优化，减少中间的点
export function reducePoints(path) {
  const optimizedPath = [path[0]]; // 创建路径的副本

  let currentIndex = 1;
  while (currentIndex < path.length - 1) {
    const current = path[currentIndex];
    const previous = path[currentIndex - 1];
    const next = path[currentIndex + 1];

    // 不是同一条线，则是转角，那么就移除转角，并平移
    if (!isSameLine(current, previous, next)) {
      // 如果当前节点与下一个节点之间没有障碍物，则移除中间的节点
      optimizedPath.push(current);
    }
    currentIndex++;
  }

  // 将终点添加到优化后的路径中
  optimizedPath.push(path[path.length - 1]);

  return optimizedPath;
}

/**
 * 减少转角
 * 一定是对齐后的线
 * 这种折线一定是间隔一条线后平行
 * @param path 路径坐标数组
 */
export function reduceCorners(path, obstacleGraph?: Array<Array<number>>) {
  // 创建路径的副本
  const optimizedPath = path.map((item) => ({ x: item.x, y: item.y }));
  let currentIndex = 1;
  while (currentIndex < optimizedPath.length - 2) {
    const current = optimizedPath[currentIndex];
    const previous = optimizedPath[currentIndex - 1];
    const next = optimizedPath[currentIndex + 1];
    const final = optimizedPath[currentIndex + 2];
    // 三条线条线
    let firstLine = [previous, current];
    let secondLine = [current, next];
    let thirdLine = [next, final];
    // 第二条线向第一条线或者第三条线横移
    let shortLine, longLine;
    if (previous.x === current.x) {
      if (Math.abs(current.y - previous.y) - Math.abs(next.y - final.y) > 0) {
        longLine = firstLine;
        shortLine = thirdLine;
      } else {
        longLine = thirdLine;
        shortLine = firstLine;
      }
    } else {
      if (Math.abs(current.x - previous.x) - Math.abs(next.x - final.x) > 0) {
        longLine = firstLine;
        shortLine = thirdLine;
      } else {
        longLine = thirdLine;
        shortLine = firstLine;
      }
    }
    let moveDireciton = directionWith(firstLine[0], firstLine[1]);
    // 先判断是否能向短线平移
    let movePoint, targetPoint, removePointIndex;
    [shortLine, longLine].some((line) => {
      if (line === firstLine) {
        movePoint = secondLine[1];
        targetPoint = line[0];
        removePointIndex = currentIndex;
      } else {
        movePoint = secondLine[0];
        targetPoint = line[1];
        removePointIndex = currentIndex + 1;
      }
      if (this.hasObstacleByPoints([targetPoint, movePoint], obstacleGraph)) {
        movePoint = null;
        targetPoint = null;
        return false;
      }
      return true;
    });
    if (movePoint) {
      // 平移节点
      parallelTranslation(movePoint, targetPoint, moveDireciton);
      // 移动当前节点
      optimizedPath.splice(removePointIndex, 1);
    } else {
      currentIndex++;
    }
  }
  return optimizedPath;
}

// 判断三个节点是否在同一条直线上
export function isSameLine(node1, node2, node3) {
  return (
    (node1.x === node2.x && node2.x === node3.x) || // 在同一列上
    (node1.y === node2.y && node2.y === node3.y) // 在同一行上
  );
}
