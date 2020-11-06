import { KanbanCardPositions, Scalars } from "../../types/gqlGeneratedTypes";
// ^ KanbanCardPositions shape:
// {
//   todo: ["a", "b"],
//   wip: [],
//   done:[]
// }

interface IdObject {
  // shape:
  // {
  //   "b": {status: "todo", index: 1},
  //   "a": {status: "todo", index: 0},
  // }
  [key: string]: {
    status: string;
    index: number;
  };
}

interface InterimPositionObject {
  // {
  //   todo: [["b", 1], ["a", 0]],
  //   wip: [],
  //   done:[]
  // }
  [key: string]: [Scalars["UUID"], number][];
}

export const toIdObj = (positionObj: KanbanCardPositions): IdObject => {
  const idObj: IdObject = {};
  // TODO: better typing
  // eslint-disable-next-line
  Object.entries(positionObj).forEach(([status, idArr]: any) => {
    idArr.forEach((id: string, index: number) => {
      idObj[id] = {
        status,
        index,
      };
    });
  });
  return idObj;
};

export const toStatusObj = (idObj: IdObject): KanbanCardPositions => {
  // 1. create an interim position object
  const positionObj: KanbanCardPositions | InterimPositionObject = {}; // allow fluid typing for conversion
  Object.entries(idObj).forEach(([id, pos]) => {
    const { status, index } = pos;
    const target = positionObj[status];
    positionObj[pos.status] = target ? [...target, [id, index]] : [[id, index]];
  });

  // 2. sort interim position object ids in each array by index, flatten array while removing index.
  Object.keys(positionObj).forEach((status) => {
    const nestedIdArr = [...positionObj[status]];
    const sorted = nestedIdArr.sort((a, b) => a[1] - b[1]);
    const flattened = sorted.map((tuple) => tuple[0]);
    positionObj[status] = flattened;
  });
  return (positionObj as unknown) as KanbanCardPositions;
};

// Provides empty array placeholders
const basePositionObject: KanbanCardPositions = {
  todo: [],
  wip: [],
  done: [],
};

// Takes a canonical and session status object and resolves it to a status object that represents the card positions the end-user should see
const resolve = (c: KanbanCardPositions, s: KanbanCardPositions): KanbanCardPositions => {
  // convert to idObj
  const idObjC = toIdObj(c);
  const idObjS = toIdObj(s);

  // spread merge such that S supercedes C
  const idObjR = { ...idObjC, ...idObjS };

  // convert back to status obj
  const positionObj = toStatusObj(idObjR);
  return { ...basePositionObject, ...positionObj }; // spread over basePositionObject to pick up default empty status columns
};

export { resolve };
