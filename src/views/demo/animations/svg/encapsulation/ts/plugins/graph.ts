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
    let xVector = cell.colIndex - this.colIndex;
    let xAbsVector = Math.abs(xVector);
    let yVector = cell.rowIndex - this.rowIndex;
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
  }

  isUnreachable() {
    let cells = this.nextCells();
    return cells.length > 0 && cells.every((cell) => !cell.passable);
  }

  // 距离目标网格有多远
  distanceFrom(target: MeshGraphCell, directionWeight = true) {
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

  pathfinding(
    source: MeshGraphCell,
    target: MeshGraphCell
  ): Array<MeshGraphCell> {
    // 开始和目标为同一个区域
    if (source.equals(target)) {
      return [source];
    }
    // 障碍地图
    let obstacleGraph = this.createObstacleGraph(source, target);
    // 已访问地图
    let visitedGraph = this.createVisitedGraph();
    // 路径节点缓存
    let pathNodeGraph: Array<Array<PathNode>> = [];

    let model = openGraphModel(obstacleGraph, source, target);

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

    // 用来记录到目标节点的位置
    let endPathNodes: Array<PathNode> = [];
    let endPathNode = null;
    // 用来遍历是否还有未走的单元格
    let cellQueue: Array<MeshGraphCell> = [];
    // 加入开始节点
    cellQueue.push(source);
    // 设置当前父节点为起始节点
    let parentNode = new PathNode([source.rowIndex, source.colIndex]);
    // 记录PathNode，重复使用
    setPathNode(parentNode, source.rowIndex, source.colIndex);

    while (cellQueue.length > 0) {
      // 获取队列中的第一个位置
      let cell = cellQueue.shift();
      // 获取或生成路径节点
      let currentPathNode = getPathNode(cell.rowIndex, cell.colIndex);
      // 计算开销
      if (parentNode === currentPathNode) {
        currentPathNode.cost = 0;
      } else {
        let cost =
          parentNode.cost +
          this.get([
            currentPathNode.rowIndex,
            currentPathNode.colIndex,
          ]).distanceFrom(target);
        if (currentPathNode.cost === -1) {
          currentPathNode.cost = cost;
        } else if (currentPathNode.cost > cost) {
          // 更新开销，并修改父节点
          currentPathNode.cost = cost;
          currentPathNode.parent = parentNode;
        }
      }
      // 如果是结束节点, 则不再需要往下找
      if (cell === target) {
        endPathNodes.push(currentPathNode);
        if (!endPathNode || currentPathNode.cost < endPathNode.cost) {
          if (!endPathNode) {
            model.markPath(toCellPath(this, currentPathNode), ColorEnum.Cyan);
          }
          endPathNode = currentPathNode;
        }
        continue;
      }
      // 处理周围节点
      cell
        .nextCells()
        // 过来掉障碍物和已经被处理过的节点
        .filter(
          (item) =>
            !obstacleGraph[item.rowIndex][item.colIndex] &&
            !visitedGraph[item.rowIndex][item.colIndex]
        )
        // 转换为pathNode，记录pathNode
        .sort((cellA, cellB) => {
          return cellA.distanceFrom(target) - cellB.distanceFrom(target);
        })
        .forEach((item) => {
          // 设置pathNode
          let nextPathNode = new PathNode(
            [item.rowIndex, item.colIndex],
            currentPathNode
          );
          setPathNode(nextPathNode, item.rowIndex, item.colIndex);
          if (!cellQueue.includes(item)) {
            // 推入下个队列
            cellQueue.push(item);
          }
        });
      // 处理完成后，设置当前节点为已被访问
      visitedGraph[cell.rowIndex][cell.colIndex] = 1;

      if (cell !== source) {
        model.visitCell([cell.rowIndex, cell.colIndex]);
      }
    }
    let path = toCellPath(this, endPathNode);
    model.markPath(path);
    return path;
  }
}

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
  rootEl.style.left = "200px";
  rootEl.style.top = "100px";
  // rootEl.style.marginLeft = "-50%";
  // rootEl.style.marginTop = "-50%";
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
      cellEl.style.width = "12px";
      cellEl.style.height = "12px";
      cellEl.style.border = "1px solid " + ColorEnum.Info;
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
    let op = operateQueue.shift();
    if (!op) {
      return;
    }
    if (op["type"] === "changeCellBg") {
      op["cellEl"].style.backgroundColor = op["bgColor"];
    }
  }, 1000 / 60 / 20);
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

class PathNode {
  rowIndex: number;
  colIndex: number;
  parent: PathNode;
  cost: number;
  children: Array<PathNode>;

  constructor(
    [rowIndex, colIndex]: PointArray,
    parent: PathNode = null,
    cost = -1
  ) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.parent = parent;
    this.cost = cost;
  }

  push(child: PathNode) {
    this.children.push(child);
  }
}

export const printGraph = function (
  graph: Array<Array<number>>,
  name = "",
  ...otherParams: Array<any>
) {
  let log = name + "\n";
  graph.forEach((row) => {
    row.forEach((cell) => {
      log += cell + " ";
    });
    log += "\n";
  });
  console.log(log, otherParams);
};

const toCellPath = function (
  graph: MeshGraph,
  node: PathNode
): Array<MeshGraphCell> {
  let cells = [node];
  while (node.parent) {
    cells.unshift(node.parent);
    node = node.parent;
  }
  return cells.map((item) => graph.get([item.rowIndex, item.colIndex]));
};

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
  let path = graph.pathfinding(source, target);
  if (!path.length) {
    return [];
  }
  // 转为点集合
  let result: PointArray = [];
  // 移除开始, 并记录开始为上一个单元格
  let lastCell: MeshGraphCell = path.splice(0, 1)[0];
  let lastDirection: DirectionEnum;
  let directions: Array<DirectionEnum> = [];
  // 计算转角
  path.forEach((nextCell) => {
    let currentDirection = lastCell.directionWith(nextCell);
    if (currentDirection !== lastDirection) {
      directions.push(currentDirection);
      lastDirection = currentDirection;
      let centerP = lastCell.centerPoint();
      result.push(centerP[0]);
      result.push(centerP[1]);
    }
    lastCell = nextCell;
  });
  result.push(targetP[0]);
  result.push(targetP[1]);
  // 修正第一个和最后一个转角的坐标
  if (result.length > 4 && directions.length > 0) {
    let length = result.length;
    let firstCornorD = directions[0];
    if (
      firstCornorD === DirectionEnum.Down ||
      firstCornorD === DirectionEnum.Up
    ) {
      result[2] = result[0];
    } else if (
      firstCornorD === DirectionEnum.Left ||
      firstCornorD === DirectionEnum.Right
    ) {
      result[3] = result[1];
    }

    let lastCornorD = directions[directions.length - 1];
    if (
      lastCornorD === DirectionEnum.Down ||
      lastCornorD === DirectionEnum.Up
    ) {
      result[length - 4] = result[length - 2];
    } else if (
      lastCornorD === DirectionEnum.Left ||
      lastCornorD === DirectionEnum.Right
    ) {
      result[length - 3] = result[length - 1];
    }
  }
  return result;
}
