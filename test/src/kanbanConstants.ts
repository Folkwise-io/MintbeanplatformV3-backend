import { gql } from "apollo-server-express";
import { KanbanSessionRaw } from "../../src/dao/KanbanDao";
import { KANBAN_CANON_1, KANBAN_CANON_2 } from "./kanbanCanonConstants";
import { PAPERJS } from "./meetConstants";
import { BOB } from "./userConstants";

export const MEET_KANBAN_RAW_1: KanbanSessionRaw = {
  id: "00000000-0000-0000-0000-000000000000",
  userId: BOB.id,
  kanbanCanonId: KANBAN_CANON_1.id,
  meetId: PAPERJS.id,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const ISOLATED_KANBAN_RAW_2: KanbanSessionRaw = {
  id: "00000000-0000-4000-a000-000000000000",
  userId: BOB.id,
  kanbanCanonId: KANBAN_CANON_2.id,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const GET_KANBAN_BY_ID_QUERY = gql`
  query getKanbanById($id: UUID) {
    kanban(id: $id) {
      id
      title
      description
      userId
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;
export const GET_KANBAN_BY_COMPOSITE_MEET_QUERY = gql`
  query getKanbanById($meetId: UUID, $userId: UUID, $kanbanCanonId: UUID) {
    kanban(meetId: $meetId, userId: $uesrId, kanbanCanonId: $kanbanCanonId) {
      id
      title
      description
      userId
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;
export const GET_KANBAN_BY_COMPOSITE_ISOLATED_QUERY = gql`
  query getKanbanById($userId: UUID, $kanbanCanonId: UUID) {
    kanban(userId: $uesrId, kanbanCanonId: $kanbanCanonId) {
      id
      title
      description
      userId
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;
// missing userId for composite
export const GET_KANBAN_QUERY_BAD = gql`
  query getKanbanById($kanbanCanonId: UUID) {
    kanban(kanbanCanonId: $kanbanCanonId) {
      id
      title
      description
      userId
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;
