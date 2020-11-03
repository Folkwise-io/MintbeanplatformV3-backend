import { gql } from "apollo-server-express";
import { KanbanSessionCardRaw } from "../../src/dao/KanbanCardDao";
import { KanbanCanonCardStatusEnum } from "../../src/types/gqlGeneratedTypes";
import { KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2, KANBAN_CANON_CARD_3 } from "./kanbanCanonCardConstants";
import { MEET_KANBAN_RAW_1 } from "./kanbanConstants";

export const KANBAN_SESSION_CARD_RAW_1: KanbanSessionCardRaw = {
  kanbanCanonCardId: KANBAN_CANON_CARD_1.id,
  kanbanSessionId: MEET_KANBAN_RAW_1.id,
  status: KanbanCanonCardStatusEnum.Wip,
};
export const KANBAN_SESSION_CARD_RAW_2: KanbanSessionCardRaw = {
  kanbanCanonCardId: KANBAN_CANON_CARD_2.id,
  kanbanSessionId: MEET_KANBAN_RAW_1.id,
};
export const KANBAN_SESSION_CARD_RAW_3: KanbanSessionCardRaw = {
  kanbanCanonCardId: KANBAN_CANON_CARD_3.id,
  kanbanSessionId: MEET_KANBAN_RAW_1.id,
};

export const GET_KANBAN_CARDS_QUERY = gql`
  query getKanbanCards($kanbanId: UUID!) {
    kanbanCards(kanbanId: $kanbanId) {
      id
      title
      body
      status
      kanbanId
    }
  }
`;

export const UPDATE_KANBAN_CARD_MUTATION = gql`
  mutation updateKanbanCard($input: UpdateKanbanCardInput!) {
    updateKanbanCard(input: $input) {
      id
      title
      body
      status
    }
  }
`;
