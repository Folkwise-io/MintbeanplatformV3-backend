import { KanbanCanonCardStatusEnum, KanbanCardPositions, Scalars } from "../../types/gqlGeneratedTypes";
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
  // Un-sorted status column arrays
  // {
  //   todo: [["b", 1], ["a", 0]],
  //   wip: [],
  //   done:[]
  // }
  [key: string]: [Scalars["UUID"], number][];
}

interface UpdateCardPositionArgs {
  oldPositions: KanbanCardPositions;
  cardId: string;
  status: KanbanCanonCardStatusEnum;
  index?: number;
}

interface DeleteCardFromPositionArgs {
  oldPositions: KanbanCardPositions;
  cardId: string;
}

export const toIdObj = (positionObj: KanbanCardPositions): IdObject => {
  const idObj: IdObject = {};
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
    if (target) {
      positionObj[pos.status] = [...target, [id, index]];
    } else {
      positionObj[pos.status] = [[id, index]];
    }
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
const basePositions: KanbanCardPositions = {
  todo: [],
  wip: [],
  done: [],
};

// Takes a canonical (c) and session (s) card position object and resolves it to a status object that represents the card positions the end-user should see
const resolve = (c: KanbanCardPositions, s: KanbanCardPositions): KanbanCardPositions => {
  // convert to idObj
  const idObjC = toIdObj(c);
  const idObjS = toIdObj(s);

  // spread merge such that S supercedes C
  const idObjR = { ...idObjC, ...idObjS };

  // convert back to position obj
  const positionObj = toStatusObj(idObjR);
  return { ...basePositions, ...positionObj }; // spread over basePositions to pick up default empty status columns
};

const moveIndex = (arr: string[], cardId: string, newIndex: number): string[] => {
  let updatedArr = [...arr];
  // bail on negative index (bad data)
  if (newIndex < 0) return updatedArr;
  // 1. find current index
  const currIndex = arr.indexOf(cardId);
  if (currIndex >= 0) {
    // 2. remove from current index
    updatedArr.splice(currIndex, 1);
    // 3. add at new index
    updatedArr.splice(newIndex, 0, cardId);
  }
  return updatedArr;
};

const updateCardPositions = ({
  oldPositions,
  cardId,
  status,
  index = 0,
}: UpdateCardPositionArgs): KanbanCardPositions => {
  const newStatus = status.toLowerCase();
  const oldIdObj = toIdObj(oldPositions);

  // gracefuly fail if specified cardId not found
  if (!oldIdObj[cardId]) return oldPositions;

  // update the card's status by override
  oldIdObj[cardId].status = newStatus;

  // convert back to status obj
  const newPositions = (toStatusObj(oldIdObj) as unknown) as { [key: string]: string[] }; // casting to allow variable status assignment for empty arrays below

  // update card index to new index
  newPositions[newStatus] = moveIndex([...newPositions[newStatus]], cardId, index);

  //  fall back to empty array for unpopulated statuses
  return ({ ...basePositions, ...newPositions } as unknown) as KanbanCardPositions; // cast back
};

const insertNewCardPosition = ({
  oldPositions,
  cardId,
  status,
  index,
}: UpdateCardPositionArgs): KanbanCardPositions => {
  const lowercaseStatus = status.toLowerCase();
  // copy to cast object to string-indexable
  const newPositions = ({ ...oldPositions } as unknown) as { [key: string]: string[] };

  // add new cardId at index. default to end of array if no index specified
  if (index) {
    newPositions[lowercaseStatus].splice(index, 0, cardId);
  } else {
    newPositions[lowercaseStatus].push(cardId);
  }

  return (newPositions as unknown) as KanbanCardPositions; // cast back
};

const deleteCardFromPosition = ({ oldPositions, cardId }: DeleteCardFromPositionArgs): KanbanCardPositions => {
  // find status and idArr to be altered if cardId present
  // eslint-disable-next-line
  const found: any = Object.entries(oldPositions).find(([_status, idArr]: any) => idArr.includes(cardId));
  // if id not found, gracefully return old object
  if (!found) return oldPositions;
  // if present, remove cardId from found idArr
  const updatedIdArr = [...found[1]].filter((id) => id !== cardId);
  // eslint-disable-next-line
  const newPositions = ({ ...oldPositions } as unknown) as { [key: string]: string[] }; // must cast for indexable keys
  // update positions
  newPositions[found[0]] = updatedIdArr;
  // fall back to empty arrays in case a column becomes empty during this operation
  return ({ ...basePositions, ...newPositions } as unknown) as KanbanCardPositions; // cast back
};

export { resolve, updateCardPositions, insertNewCardPosition, deleteCardFromPosition };
