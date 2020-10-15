import { gql } from "apollo-server-express";
import { KanbanSessionRaw } from "../../src/dao/KanbanSessionDaoKnex";
import { CreateKanbanSessionInput, EditKanbanSessionInput, KanbanSession } from "../../src/types/gqlGeneratedTypes";
import { TEST_KANBAN } from "./kanbanConstants";
import { PAPERJS, ALGOLIA } from "./meetConstants";
import { BOB } from "./userConstants";

// Note, these constants rely on external constants. This may not be a good pattern

// for adding to db via test manager
export const TEST_KANBAN_SESSION_ON_MEET_RAW: KanbanSessionRaw = {
  id: "00000000-0000-0000-0000-000000000000",
  kanbanId: TEST_KANBAN.id,
  userId: BOB.id,
  meetId: PAPERJS.id,
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

// expected entity when retrieved from db via test manager
export const TEST_KANBAN_SESSION_ON_MEET_COMPOSED: KanbanSession = {
  ...TEST_KANBAN_SESSION_ON_MEET_RAW,
  title: TEST_KANBAN.title,
  description: TEST_KANBAN.description,
};

// for adding to test manager "database"
export const TEST_KANBAN_SESSION_ISOLATED_RAW: KanbanSessionRaw = {
  id: "00000000-0000-4000-a000-000000000000",
  kanbanId: TEST_KANBAN.id,
  userId: BOB.id,
  meetId: null,
  createdAt: "2019-09-15T12:00:00.000Z",
  updatedAt: "2019-09-15T12:00:00.000Z",
};

// expected entity when retrieved from db via test manager
export const TEST_KANBAN_SESSION_ISOLATED_COMPOSED: KanbanSession = {
  ...TEST_KANBAN_SESSION_ISOLATED_RAW,
  title: TEST_KANBAN.title,
  description: TEST_KANBAN.description,
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
      title
      description
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
      title
      description
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
      title
      description
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
