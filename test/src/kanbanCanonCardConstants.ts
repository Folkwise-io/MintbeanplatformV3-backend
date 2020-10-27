import { gql } from "apollo-server-express";
import { KanbanCanonCard, KanbanCanonCardStatusEnum } from "../../src/types/gqlGeneratedTypes";
import { KANBAN_CANON_1 } from "./kanbanCanonConstants";

export const KANBAN_CANON_CARD_1: KanbanCanonCard = {
  id: "00000000-0000-0000-0000-000000000000",
  kanbanCanonId: KANBAN_CANON_1.id, // Animation Toys 1 Kanban
  title: "Kanban Card 1",
  body: "This is the **first** thing to do",
  status: KanbanCanonCardStatusEnum.Todo,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};
export const KANBAN_CANON_CARD_2: KanbanCanonCard = {
  id: "00000000-0000-4000-a000-000000000000",
  kanbanCanonId: KANBAN_CANON_1.id, // Animation Toys 1 Kanban
  title: "Kanban Card 2",
  body: "This is the **second** thing to do",
  status: KanbanCanonCardStatusEnum.Todo,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};
export const KANBAN_CANON_CARD_3: KanbanCanonCard = {
  id: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
  kanbanCanonId: KANBAN_CANON_1.id, // Animation Toys 1 Kanban
  title: "Kanban Card 3",
  status: KanbanCanonCardStatusEnum.Todo,
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
      status
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
      status
      kanbanCanonId
      createdAt
      updatedAt
    }
  }
`;
