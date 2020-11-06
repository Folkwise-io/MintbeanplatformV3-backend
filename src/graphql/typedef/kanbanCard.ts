import { gql } from "apollo-server-express";

const kanbanCard = gql`
  "An object mapping kanban cards to their columns and indexes"
  type KanbanCardStatuses {
    todo: [KanbanCard]
    wip: [KanbanCard]
    done: [KanbanCard]
  }

  "A kanban card on a kanban. Holds personalized positioning data."
  type KanbanCard {
    "Id of the kanban card in UUID. Matches the id of the kanban canon card this card is based off of"
    id: UUID!
    title: String!
    "A markdown body of the kanban card content"
    body: String!
    "The initial status column this kanbanCanonCard should appear in"
    status: KanbanCanonCardStatusEnum!
    "A reference to the kanban this kanban card belongs to"
    kanbanId: UUID!
    "DateTime that the kanban card was created"
    createdAt: DateTime!
    "DateTime that the kanban card was modified"
    updatedAt: DateTime!
  }

  extend type Kanban {
    "The kanban cards that belong to a kanban"
    kanbanCards: [KanbanCard]
    kanbanCardStatuses: KanbanCardStatuses
  }

  extend type Query {
    "Gets all the kanban cards for a given kanban"
    kanbanCards(kanbanId: UUID!): [KanbanCard]
  }

  input UpdateKanbanCardInput {
    "Id of the kaban card (note: this id is identical to the id of it's base kanban canon card)"
    id: UUID!
    kanbanId: UUID!
    "The column this card belongs in: TODO, WIP or DONE"
    status: KanbanCanonCardStatusEnum!
  }
  extend type Mutation {
    "Updates a kanbanCard"
    updateKanbanCard(input: UpdateKanbanCardInput!): KanbanCard
  }
`;

export default kanbanCard;
