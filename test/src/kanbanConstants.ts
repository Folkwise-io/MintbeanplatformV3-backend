import { gql } from "apollo-server-express";
import { KanbanSessionRaw } from "../../src/dao/KanbanDao";
import { KANBAN_CANON_1, KANBAN_CANON_2 } from "./kanbanCanonConstants";
import { PAPERJS } from "./meetConstants";
import { BOB, DORTHY } from "./userConstants";

export const MEET_KANBAN_RAW_1: KanbanSessionRaw = {
  id: "00000000-0000-0000-0000-000000000000",
  userId: BOB.id,
  kanbanCanonId: KANBAN_CANON_1.id,
  meetId: PAPERJS.id,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};
export const MEET_KANBAN_RAW_2: KanbanSessionRaw = {
  id: "7736c2f2-fe64-4fa5-a59c-47ad50917a12",
  userId: DORTHY.id,
  kanbanCanonId: KANBAN_CANON_1.id,
  meetId: PAPERJS.id,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const ISOLATED_KANBAN_RAW_1: KanbanSessionRaw = {
  id: "00000000-0000-4000-a000-000000000000",
  userId: BOB.id,
  kanbanCanonId: KANBAN_CANON_2.id,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const GET_KANBAN_BY_ID_QUERY = gql`
  query getKanbanById($id: UUID!) {
    kanban(id: $id) {
      id
      title
      description
      userId
      meetId
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;
export const GET_KANBAN_BY_COMPOSITE_MEET_QUERY = gql`
  query getKanbanByCompositeMeet($meetId: UUID, $userId: UUID, $kanbanCanonId: UUID) {
    kanban(meetId: $meetId, userId: $userId, kanbanCanonId: $kanbanCanonId) {
      id
      title
      description
      userId
      meetId
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;
export const GET_KANBAN_BY_COMPOSITE_ISOLATED_QUERY = gql`
  query getKanbanByCompositeIsolated($userId: UUID, $kanbanCanonId: UUID) {
    kanban(userId: $userId, kanbanCanonId: $kanbanCanonId) {
      id
      title
      description
      userId
      meetId
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;

export const GET_KANBANS_QUERY = gql`
  query kanbans($meetId: UUID, $kanbanCanonId: UUID, $userId: UUID) {
    kanbans(meetId: $meetId, kanbanCanonId: $kanbanCanonId, userId: $userId) {
      id
      title
      description
      userId
      meetId
    }
  }
`;
