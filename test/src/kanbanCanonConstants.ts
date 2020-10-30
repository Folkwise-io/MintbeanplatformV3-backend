import { gql } from "apollo-server-express";
import { CreateKanbanCanonInput, EditKanbanCanonInput, KanbanCanon } from "../../src/types/gqlGeneratedTypes";

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

export const CREATE_KANBAN_CANON_1_INPUT: CreateKanbanCanonInput = {
  title: KANBAN_CANON_1.title,
  description: KANBAN_CANON_1.description,
};

export const CREATE_KANBAN_CANON_2_INPUT: CreateKanbanCanonInput = {
  title: KANBAN_CANON_1.title,
  description: KANBAN_CANON_1.description,
};

export const CREATE_KANBAN_CANON_MUTATION = gql`
  mutation createKanbanCanon($input: CreateKanbanCanonInput!) {
    createKanbanCanon(input: $input) {
      id
      title
      description
      createdAt
    }
  }
`;

export const EDIT_KANBAN_CANON_INPUT: EditKanbanCanonInput = {
  title: "New title!",
};

export const EDIT_KANBAN_CANON_MUTATION = gql`
  mutation editKanbanCanon($id: UUID!, $input: EditKanbanCanonInput!) {
    editKanbanCanon(id: $id, input: $input) {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;
