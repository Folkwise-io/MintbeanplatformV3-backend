import { gql } from "apollo-server-express";
import {
  CreateKanbanCanonCardInput,
  EditKanbanCanonCardInput,
  KanbanCanonCard,
} from "../../src/types/gqlGeneratedTypes";
import { KANBAN_CANON_1_RAW } from "./kanbanCanonConstants";

export const KANBAN_CANON_CARD_1: KanbanCanonCard = {
  id: "89a87a56-b08c-4140-9a7b-9c18e667641d",
  kanbanCanonId: KANBAN_CANON_1_RAW.id, // Animation Toys 1 Kanban
  title: "Kanban Card 1",
  body: "This is the **first** thing to do",
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};
export const KANBAN_CANON_CARD_2: KanbanCanonCard = {
  id: "86675f88-e570-4243-bd64-8ad322a0475e",
  kanbanCanonId: KANBAN_CANON_1_RAW.id, // Animation Toys 1 Kanban
  title: "Kanban Card 2",
  body: "This is the **second** thing to do",
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};
export const KANBAN_CANON_CARD_3: KanbanCanonCard = {
  id: "1eeaf35c-7217-4ddd-9b4e-f3bb3dcedb40",
  kanbanCanonId: KANBAN_CANON_1_RAW.id, // Animation Toys 1 Kanban
  title: "Kanban Card 3",
  body: "This is the **third** thing to do",
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const GET_KANBAN_CANON_CARD_QUERY = gql`
  query getKanbanCanonCard($id: UUID!) {
    kanbanCanonCard(id: $id) {
      id
      title
      body
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;

export const GET_KANBAN_CANON_CARDS_QUERY = gql`
  query getKanbanCanonCards($kanbanCanonId: UUID!) {
    kanbanCanonCards(kanbanCanonId: $kanbanCanonId) {
      id
      title
      body
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_KANBAN_CANON_CARD_1_INPUT: CreateKanbanCanonCardInput = {
  kanbanCanonId: KANBAN_CANON_1_RAW.id, // Animation Toys 1 Kanban
  title: "Kanban Card 1",
  body: "This is the **first** thing to do",
};

export const CREATE_KANBAN_CANON_CARD_MUTATION = gql`
  mutation createKanbanCanonCard($input: CreateKanbanCanonCardInput!) {
    createKanbanCanonCard(input: $input) {
      id
      title
      body
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;

export const EDIT_KANBAN_CANON_CARD_INPUT: EditKanbanCanonCardInput = {
  title: "New title!",
};

export const EDIT_KANBAN_CANON_CARD_MUTATION = gql`
  mutation editKanbanCanonCard($id: UUID!, $input: EditKanbanCanonCardInput!) {
    editKanbanCanonCard(id: $id, input: $input) {
      id
      title
      body
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_KANBAN_CANON_CARD_MUTATION = gql`
  mutation deleteKanbanCanonCard($id: UUID!) {
    deleteKanbanCanonCard(id: $id)
  }
`;
