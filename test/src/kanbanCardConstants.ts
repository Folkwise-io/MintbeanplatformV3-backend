import { gql } from "apollo-server-express";
import { KanbanCard, CreateKanbanCardInput, EditKanbanCardInput } from "../../src/types/gqlGeneratedTypes";

export const TEST_KANBAN_CARD_1: KanbanCard = {
  id: "00000000-0000-0000-0000-000000000000",
  kanbanId: "00000000-0000-0000-0000-000000000000",
  title: "Test Kanban Card 1",
  body: "This is a **pointless** kanban card for testing",
  // index: 0,
  createdAt: "2019-10-15",
  updatedAt: "2019-10-15",
};
export const TEST_KANBAN_CARD_2: KanbanCard = {
  id: "00000000-0000-4000-a000-000000000000",
  kanbanId: "00000000-0000-0000-0000-000000000000",
  title: "Test Kanban Card 2",
  body: "This is another **pointless** kanban card for testing",
  // index: 1,
  createdAt: "2019-10-15",
  updatedAt: "2019-10-15",
};

export const TEST_KANBAN_CARD_INPUT_1: CreateKanbanCardInput = {
  kanbanId: "00000000-0000-0000-0000-000000000000",
  title: "Test Test Kanban Card 1",
  body: "This is a **pointless** kanban card for testing",
  // index: 0,
};
export const TEST_KANBAN_CARD_INPUT_2: CreateKanbanCardInput = {
  kanbanId: "00000000-0000-0000-0000-000000000000",
  title: "Test Test Kanban Card 2",
  body: "This is another **pointless** kanban card for testing",
  // index: 1,
};

export const GET_KANBAN_CARD_QUERY = gql`
  query getOneKanbanCard($id: UUID!) {
    kanbanCard(id: $id) {
      id
      kanbanId
      title
      body
    }
  }
`;

export const GET_KANBAN_CARDS_ON_KANBAN_QUERY = gql`
  query getKanbanCardsOnKanban($kanbanId: UUID!) {
    kanbanCards(kanbanId: $kanbanId) {
      id
      kanbanId
      title
      body
    }
  }
`;

export const CREATE_KANBAN_CARD_MUTATION = gql`
  mutation createKanbanCard($input: CreateKanbanCardInput!) {
    createKanbanCard(input: $input) {
      id
      kanbanId
      title
      body
    }
  }
`;

export const EDIT_KANBAN_CARD_INPUT: EditKanbanCardInput = {
  title: "A totally new title",
};

export const EDIT_KANBAN_CARD_MUTATION = gql`
  mutation editKanbanCard($id: UUID!, $input: EditKanbanCardInput!) {
    editKanbanCard(id: $id, input: $input) {
      id
      kanbanId
      title
      body
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_KANBAN_CARD_MUTATION = gql`
  mutation deleteKanbanCard($id: UUID!) {
    deleteKanbanCard(id: $id)
  }
`;
