import { gql } from "apollo-server-express";
import { KanbanCanon } from "../../src/types/gqlGeneratedTypes";

export const KANBAN_CANON_1: KanbanCanon = {
  id: "00000000-0000-0000-0000-000000000000",
  title: "Test Kanban 1",
  description: "Lorem ipsum whatever",
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const KANBAN_CANON_2: KanbanCanon = {
  id: "00000000-0000-4000-a000-000000000000",
  title: "Test Kanban 2",
  description: "Lorem ipsum whatever",
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const GET_KANBAN_CANON_QUERY = gql`
  query getKanbanCanonById($id: UUID!) {
    kanbanCanon(id: $id) {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;

export const GET_KANBAN_CANONS_QUERY = gql`
  query getKanbanCanons {
    kanbanCanons {
      id
      title
      description
      kanbanCanonCards {
        id
        title
        body
        status
        kanbanCanonId
      }
      createdAt
      updatedAt
    }
  }
`;
