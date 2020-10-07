import { gql } from "apollo-server-express";
import { Kanban, CreateKanbanInput, EditKanbanInput } from "../../src/types/gqlGeneratedTypes";

export const TEST_KANBAN: Kanban = {
  id: "00000000-0000-0000-0000-000000000000",
  title: "Test Kanban",
  description: "This is a pointless kanban for testing",
  createdAt: "2019-10-15",
  updatedAt: "2019-10-15",
};

export const TEST_KANBAN_INPUT: CreateKanbanInput = {
  title: "Test Kanban",
  description: "This is a pointless kanban for testing",
};

export const GET_KANBAN_QUERY = gql`
  query getOneKanban($id: UUID!) {
    kanban(id: $id) {
      id
      title
      description
    }
  }
`;

export const GET_ALL_KANBANS_QUERY = gql`
  query getAllKanbans {
    kanbans {
      id
      title
      description
    }
  }
`;

export const CREATE_KANBAN_MUTATION = gql`
  mutation createKanban($input: CreateKanbanInput!) {
    createKanban(input: $input) {
      id
      title
      description
    }
  }
`;

export const EDIT_KANBAN_INPUT: EditKanbanInput = {
  title: "A new title",
};

export const EDIT_KANBAN_MUTATION = gql`
  mutation editKanban($id: UUID!, $input: EditKanbanInput!) {
    editKanban(id: $id, input: $input) {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_KANBAN_MUTATION = gql`
  mutation deleteKanban($id: UUID!) {
    deleteKanban(id: $id)
  }
`;
