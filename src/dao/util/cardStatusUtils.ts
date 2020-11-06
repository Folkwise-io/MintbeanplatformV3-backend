import { Kanban, KanbanCardStatusesObject, Scalars } from "../../types/gqlGeneratedTypes";
// ^ KanbanCardStatusesObject shape:
// {
//   todo: ["a", "b"],
//   wip: [],
//   done:[]
// }

// type Statuses = Exclude<keyof KanbanCardStatusesObject, "__typename">;

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

interface InterimStatusObject {
  // {
  //   todo: [["b", 1], ["a", 0]],
  //   wip: [],
  //   done:[]
  // }
  [key: string]: [Scalars["UUID"], number][];
}

export const toIdObj = (statusObj: KanbanCardStatusesObject): IdObject => {
  const idObj: IdObject = {};
  // TODO: better typing
  // eslint-disable-next-line
  Object.entries(statusObj).forEach(([status, idArr]: any) => {
    idArr.forEach((id: string, index: number) => {
      idObj[id] = {
        status,
        index,
      };
    });
  });
  return idObj;
};

export const toStatusObj = (idObj: IdObject): KanbanCardStatusesObject => {
  // 1. create an interim status object
  const statusObj: KanbanCardStatusesObject | InterimStatusObject = {}; // allow fluid typing for conversion
  Object.entries(idObj).forEach(([id, pos]) => {
    const { status, index } = pos;
    const target = statusObj[status];
    statusObj[pos.status] = target ? [...target, [id, index]] : [[id, index]];
  });

  // 2. sort interim status object ids in each array by index, flatten array while removing index.
  Object.keys(statusObj).forEach((status) => {
    const nestedIdArr = [...statusObj[status]];
    const sorted = nestedIdArr.sort((a, b) => a[1] - b[1]);
    const flattened = sorted.map((tuple) => tuple[0]);
    statusObj[status] = flattened;
  });
  return (statusObj as unknown) as KanbanCardStatusesObject;
};

// Provides empty array placeholders
const baseStatusObject: KanbanCardStatusesObject = {
  todo: [],
  wip: [],
  done: [],
};

// Takes a canonical and session status object and resolves it to a status object that represents the card positions the end-user should see
const resolve = (c: KanbanCardStatusesObject, s: KanbanCardStatusesObject): KanbanCardStatusesObject => {
  // convert to idObj
  const idObjC = toIdObj(c);
  const idObjS = toIdObj(s);

  // spread merge such that S supercedes C
  const idObjR = { ...idObjC, ...idObjS };

  // convert back to status obj
  const statusObj = toStatusObj(idObjR);
  return { ...baseStatusObject, ...statusObj }; // spread over baseStatusObject to pick up default empty status columns
};

export { resolve };
