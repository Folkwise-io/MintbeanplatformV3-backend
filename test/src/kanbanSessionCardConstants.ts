import { gql } from "apollo-server-express";
import { KanbanSessionCardRaw } from "../../src/dao/KanbanSessionCardDaoKnex";
import {
  KanbanSessionCard,
  CreateKanbanSessionCardInput,
  KanbanCardStatusEnum,
  EditKanbanSessionCardInput,
} from "../../src/types/gqlGeneratedTypes";
import { TEST_KANBAN_CARD_1, TEST_KANBAN_CARD_2 } from "./kanbanCardConstants";
import { TEST_KANBAN_SESSION_ISOLATED_RAW, TEST_KANBAN_SESSION_ON_MEET_RAW } from "./kanbanSessionConstants";

export const TEST_MEET_KANBAN_SESSION_CARD_1_RAW: KanbanSessionCardRaw = {
  id: "00000000-0000-0000-0000-000000000000",
  kanbanSessionId: TEST_KANBAN_SESSION_ON_MEET_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_1.id,
  status: KanbanCardStatusEnum.Todo,
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

export const TEST_MEET_KANBAN_SESSION_CARD_1_COMPOSED: KanbanSessionCard = {
  ...TEST_MEET_KANBAN_SESSION_CARD_1_RAW,
  title: TEST_KANBAN_CARD_1.title,
  body: TEST_KANBAN_CARD_1.body,
};

export const TEST_MEET_KANBAN_SESSION_CARD_2_RAW: KanbanSessionCardRaw = {
  id: "00000000-0000-4000-a000-000000000000",
  kanbanSessionId: TEST_KANBAN_SESSION_ON_MEET_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_2.id,
  status: KanbanCardStatusEnum.Todo,
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

export const TEST_MEET_KANBAN_SESSION_CARD_2_COMPOSED: KanbanSessionCard = {
  ...TEST_MEET_KANBAN_SESSION_CARD_2_RAW,
  title: TEST_KANBAN_CARD_2.title,
  body: TEST_KANBAN_CARD_2.body,
};

export const TEST_ISOLATED_KANBAN_SESSION_CARD_1_RAW: KanbanSessionCardRaw = {
  id: "00000000-0000-0000-0000-000000000000",
  kanbanSessionId: TEST_KANBAN_SESSION_ISOLATED_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_1.id,
  status: KanbanCardStatusEnum.Todo,
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

export const TEST_ISOLATED_KANBAN_SESSION_CARD_1_COMPOSED: KanbanSessionCard = {
  ...TEST_ISOLATED_KANBAN_SESSION_CARD_1_RAW,
  title: TEST_KANBAN_CARD_1.title,
  body: TEST_KANBAN_CARD_1.body,
};

export const TEST_ISOLATED_KANBAN_SESSION_CARD_2_RAW: KanbanSessionCardRaw = {
  id: "00000000-0000-4000-a000-000000000000",
  kanbanSessionId: TEST_KANBAN_SESSION_ISOLATED_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_2.id,
  status: KanbanCardStatusEnum.Todo,
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

export const TEST_ISOLATED_KANBAN_SESSION_CARD_2_COMPOSED: KanbanSessionCard = {
  ...TEST_ISOLATED_KANBAN_SESSION_CARD_2_RAW,
  title: TEST_KANBAN_CARD_2.title,
  body: TEST_KANBAN_CARD_2.body,
};

export const TEST_MEET_KANBAN_SESSION_CARD_1_INPUT: CreateKanbanSessionCardInput = {
  kanbanSessionId: TEST_KANBAN_SESSION_ON_MEET_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_1.id,
  status: KanbanCardStatusEnum.Wip,
};
export const TEST_MEET_KANBAN_SESSION_CARD_2_INPUT: CreateKanbanSessionCardInput = {
  kanbanSessionId: TEST_KANBAN_SESSION_ON_MEET_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_2.id,
  status: KanbanCardStatusEnum.Todo,
};

export const TEST_ISOLATED_KANBAN_SESSION_CARD_1_INPUT: CreateKanbanSessionCardInput = {
  kanbanSessionId: TEST_KANBAN_SESSION_ISOLATED_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_1.id,
  status: KanbanCardStatusEnum.Wip,
};
export const TEST_ISOLATED_KANBAN_SESSION_CARD_2_INPUT: CreateKanbanSessionCardInput = {
  kanbanSessionId: TEST_KANBAN_SESSION_ISOLATED_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_2.id,
  status: KanbanCardStatusEnum.Todo,
};

export const GET_KANBAN_SESSION_CARD_QUERY = gql`
  query getOneKanbanSessionCard($id: UUID!) {
    kanbanSessionCard(id: $id) {
      id
      kanbanSessionId
      kanbanCardId
      title
      body
      status
    }
  }
`;

export const GET_KANBAN_SESSION_CARDS_ON_KANBAN_SESSION_QUERY = gql`
  query getKanbanSessionCardsOnKanbanSession($kanbanSessionId: UUID!) {
    kanbanSessionCards(kanbanSessionId: $kanbanSessionId) {
      id
      kanbanSessionId
      kanbanCardId
      title
      body
      status
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_KANBAN_SESSION_CARD_MUTATION = gql`
  mutation createKanbanSessionCard($input: CreateKanbanSessionCardInput!) {
    createKanbanSessionCard(input: $input) {
      id
      kanbanSessionId
      kanbanCardId
      title
      body
      status
    }
  }
`;

export const EDIT_KANBAN_SESSION_CARD_INPUT: EditKanbanSessionCardInput = {
  // index: 1,
  status: KanbanCardStatusEnum.Wip,
};

export const EDIT_KANBAN_SESSION_CARD_MUTATION = gql`
  mutation editKanbanSessionCard($id: UUID!, $input: EditKanbanSessionCardInput!) {
    editKanbanSessionCard(id: $id, input: $input) {
      id
      kanbanSessionId
      kanbanCardId
      title
      body
      status
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_KANBAN_SESSION_CARD_MUTATION = gql`
  mutation deleteKanbanSessionCard($id: UUID!) {
    deleteKanbanSessionCard(id: $id)
  }
`;
