import { gql } from "apollo-server-express";
import { KanbanCanonRaw } from "../../src/dao/KanbanCanonDao";
import { CreateKanbanCanonInput, EditKanbanCanonInput } from "../../src/types/gqlGeneratedTypes";

export const KANBAN_CANON_1_RAW: KanbanCanonRaw = {
  id: "b36d2ecd-ac89-406c-816f-6b067e036cff",
  title: "Test Kanban 1",
  description: "Lorem ipsum whatever",
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const KANBAN_CANON_2_RAW: KanbanCanonRaw = {
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
      cardPositions {
        todo
        wip
        done
      }
      kanbanCanonCards {
        id
        title
        body
      }
    }
  }
`;

export const GET_KANBAN_CANONS_QUERY = gql`
  query getKanbanCanons {
    kanbanCanons {
      id
      title
      description
      cardPositions {
        todo
        wip
        done
      }
      kanbanCanonCards {
        id
        title
        body
        kanbanCanonId
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_KANBAN_CANON_1_RAW_INPUT: CreateKanbanCanonInput = {
  title: KANBAN_CANON_1_RAW.title,
  description: KANBAN_CANON_1_RAW.description,
};

export const CREATE_KANBAN_CANON_2_RAW_INPUT: CreateKanbanCanonInput = {
  title: KANBAN_CANON_1_RAW.title,
  description: KANBAN_CANON_1_RAW.description,
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

export const UPDATE_KANBAN_CANON_CARD_POSITIONS_MUTATION = gql`
  mutation updateKanbanCanonCardPositions($id: UUID!, $input: UpdateCardPositionInput!) {
    updateKanbanCanonCardPositions(id: $id, input: $input) {
      todo
      wip
      done
    }
  }
`;

export const DELETE_KANBAN_CANON_MUTATION = gql`
  mutation deleteKanbanCanon($id: UUID!) {
    deleteKanbanCanon(id: $id)
  }
`;
