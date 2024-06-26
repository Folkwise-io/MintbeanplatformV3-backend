import { gql } from "apollo-server-express";
import { KanbanSessionRaw } from "../daos/TestKanbanDaoKnex";
import { KANBAN_CANON_1_RAW, KANBAN_CANON_2_RAW } from "./kanbanCanonConstants";
import { PAPERJS } from "./meetConstants";
import { BOB, DORTHY } from "./userConstants";

export const MEET_KANBAN_RAW_1: KanbanSessionRaw = {
  id: "00000000-0000-0000-0000-000000000000",
  userId: BOB.id,
  kanbanCanonId: KANBAN_CANON_1_RAW.id,
  meetId: PAPERJS.id,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};
export const MEET_KANBAN_RAW_2: KanbanSessionRaw = {
  id: "7736c2f2-fe64-4fa5-a59c-47ad50917a12",
  userId: DORTHY.id,
  kanbanCanonId: KANBAN_CANON_1_RAW.id,
  meetId: PAPERJS.id,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const ISOLATED_KANBAN_RAW_1: KanbanSessionRaw = {
  id: "00000000-0000-4000-a000-000000000000",
  userId: BOB.id,
  kanbanCanonId: KANBAN_CANON_2_RAW.id,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const GET_KANBAN_QUERY = gql`
  query getKanban($id: UUID, $meetId: UUID, $userId: UUID, $kanbanCanonId: UUID) {
    kanban(id: $id, meetId: $meetId, userId: $userId, kanbanCanonId: $kanbanCanonId) {
      id
      title
      description
      userId
      meetId
      kanbanCanonId
      kanbanCards {
        id
        title
        body
        kanbanCanonId
      }
      cardPositions {
        todo
        wip
        done
      }
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
      kanbanCards {
        id
        title
        body
        kanbanCanonId
      }
      cardPositions {
        todo
        wip
        done
      }
    }
  }
`;

export const CREATE_ISOLATED_KANBAN_INPUT = {
  kanbanCanonId: KANBAN_CANON_1_RAW.id,
  userId: BOB.id,
};

export const CREATE_KANBAN_MUTATION = gql`
  mutation createKanban($input: CreateKanbanInput!) {
    createKanban(input: $input) {
      id
      title
      description
      userId
      meetId
      kanbanCanonId
      kanbanCards {
        id
        title
        body
        kanbanCanonId
      }
      cardPositions {
        todo
        wip
        done
      }
    }
  }
`;

export const UPDATE_KANBAN_CARD_POSITIONS_MUTATION = gql`
  mutation updateKanbanCardPositions($id: UUID!, $input: UpdateCardPositionInput!) {
    updateKanbanCardPositions(id: $id, input: $input) {
      todo
      wip
      done
    }
  }
`;

export const DELETE_KANBAN_MUTATION = gql`
  mutation deleteKanban($id: UUID!) {
    deleteKanban(id: $id)
  }
`;
