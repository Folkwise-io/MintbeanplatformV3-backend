import { gql } from "apollo-server-express";
import { KanbanSession, CreateKanbanSessionInput, EditKanbanSessionInput } from "../../src/types/gqlGeneratedTypes";
import { TEST_KANBAN } from "./kanbanConstants";
import { PAPERJS, ALGOLIA } from "./meetConstants";
import { BOB } from "./userConstants";

// Note, these constants rely on external constants. This may not be a good pattern

export const TEST_KANBAN_SESSION_ON_MEET: KanbanSession = {
  id: "00000000-0000-0000-0000-000000000000",
  kanbanId: TEST_KANBAN.id,
  userId: BOB.id,
  meetId: PAPERJS.id,
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

export const TEST_KANBAN_SESSION_ISOLATED: KanbanSession = {
  id: "00000000-0000-0000-0000-000000000000",
  kanbanId: TEST_KANBAN.id,
  userId: BOB.id,
  meetId: null,
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

export const TEST_KANBAN_SESSION_ON_MEET_INPUT: CreateKanbanSessionInput = {
  kanbanId: TEST_KANBAN.id,
  userId: BOB.id,
  meetId: PAPERJS.id,
};
export const TEST_KANBAN_SESSION_ISOLATED_INPUT: CreateKanbanSessionInput = {
  kanbanId: TEST_KANBAN.id,
  userId: BOB.id,
};

export const GET_KANBAN_SESSION_QUERY = gql`
  query getOneKanbanSession($userId: UUID, $kanbanId: UUID!, $meetId: UUID) {
    kanbanSession(userId: $userId, kanbanId: $kanbanId, meetId: $meetId) {
      id
      kanbanId
      userId
      meetId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_KANBAN_SESSION_MUTATION = gql`
  mutation createKanbanSession($input: CreateKanbanSessionInput!) {
    createKanbanSession(input: $input) {
      id
      kanbanId
      userId
      meetId
    }
  }
`;

// Can't think of a use case for this, but testing anyway
export const EDIT_KANBAN_SESSION_INPUT: EditKanbanSessionInput = {
  meetId: ALGOLIA.id,
};

// Can't think of a use case for this, but testing anyway
export const EDIT_KANBAN_SESSION_MUTATION = gql`
  mutation editKanbanSession($id: UUID!, $input: EditKanbanSessionInput!) {
    editKanbanSession(id: $id, input: $input) {
      id
      kanbanId
      userId
      meetId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_KANBAN_SESSION_MUTATION = gql`
  mutation deleteKanbanSession($id: UUID!) {
    deleteKanbanSession(id: $id)
  }
`;
