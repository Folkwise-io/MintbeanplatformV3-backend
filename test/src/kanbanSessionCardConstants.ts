import { gql } from "apollo-server-express";
import {
  KanbanSessionCard,
  CreateKanbanSessionCardInput,
  KanbanSessionCardStatusEnum,
  EditKanbanSessionCardInput,
} from "../../src/types/gqlGeneratedTypes";
import { TEST_KANBAN_CARD_1, TEST_KANBAN_CARD_2 } from "./kanbanCardConstants";
import { TEST_KANBAN_SESSION_ISOLATED_RAW, TEST_KANBAN_SESSION_ON_MEET_RAW } from "./kanbanSessionConstants";

export const TEST_MEET_KANBAN_SESSION_CARD_1: KanbanSessionCard = {
  id: "00000000-0000-0000-0000-000000000000",
  kanbanSessionId: TEST_KANBAN_SESSION_ON_MEET_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_1.id,
  index: 0,
  status: KanbanSessionCardStatusEnum["Todo"],
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

export const TEST_MEET_KANBAN_SESSION_CARD_2: KanbanSessionCard = {
  id: "00000000-0000-4000-a000-000000000000",
  kanbanSessionId: TEST_KANBAN_SESSION_ON_MEET_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_2.id,
  index: 1,
  status: KanbanSessionCardStatusEnum["Todo"],
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

export const TEST_ISOLATED_KANBAN_SESSION_CARD_1: KanbanSessionCard = {
  id: "00000000-0000-0000-0000-000000000000",
  kanbanSessionId: TEST_KANBAN_SESSION_ISOLATED_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_1.id,
  index: 0,
  status: KanbanSessionCardStatusEnum["Todo"],
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

export const TEST_ISOLATED_KANBAN_SESSION_CARD_2: KanbanSessionCard = {
  id: "00000000-0000-4000-a000-000000000000",
  kanbanSessionId: TEST_KANBAN_SESSION_ISOLATED_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_2.id,
  index: 1,
  status: KanbanSessionCardStatusEnum["Todo"],
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

export const TEST_MEET_KANBAN_SESSION_CARD_1_INPUT: CreateKanbanSessionCardInput = {
  kanbanSessionId: TEST_KANBAN_SESSION_ON_MEET_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_1.id,
  index: 0,
  status: KanbanSessionCardStatusEnum["Wip"],
};
export const TEST_MEET_KANBAN_SESSION_CARD_2_INPUT: CreateKanbanSessionCardInput = {
  kanbanSessionId: TEST_KANBAN_SESSION_ON_MEET_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_2.id,
  index: 0,
  status: KanbanSessionCardStatusEnum["Todo"],
};

export const TEST_ISOLATED_KANBAN_SESSION_CARD_1_INPUT: CreateKanbanSessionCardInput = {
  kanbanSessionId: TEST_KANBAN_SESSION_ISOLATED_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_1.id,
  index: 0,
  status: KanbanSessionCardStatusEnum["Wip"],
};
export const TEST_ISOLATED_KANBAN_SESSION_CARD_2_INPUT: CreateKanbanSessionCardInput = {
  kanbanSessionId: TEST_KANBAN_SESSION_ISOLATED_RAW.id,
  kanbanCardId: TEST_KANBAN_CARD_2.id,
  index: 0,
  status: KanbanSessionCardStatusEnum["Todo"],
};

export const GET_KANBAN_SESSION_CARD_QUERY = gql`
  query getOneKanbanSessionCard($id: UUID!) {
    kanbanSessionCard(id: $id) {
      id
      kanbanSessionId
      kanbanCardId
      index
      status
    }
  }
`;

export const GET_KANBAN_SESSION_CARDS_ON_KANBAN_SESSION_QUERY = gql`
  query getKanbanSessionCardsOnKanbanSession($kanbanSessionId: UUID!) {
    kanbanCards(kanbanSessionId: $kanbanId) {
      id
      kanbanSessionId
      kanbanCardId
      index
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
      index
      status
    }
  }
`;

export const EDIT_KANBAN_SESSION_CARD_INPUT: EditKanbanSessionCardInput = {
  index: 1,
  status: KanbanSessionCardStatusEnum["Wip"],
};

export const EDIT_KANBAN_SESSION_CARD_MUTATION = gql`
  mutation editKanbanSessionCard($id: UUID!, $input: EditKanbanSessionCardInput!) {
    editKanbanSessionCard(id: $id, input: $input) {
      id
      kanbanSessionId
      kanbanCardId
      index
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
