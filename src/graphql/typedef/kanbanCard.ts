import { gql } from "apollo-server-express";

const kanbanCard = gql`
  "A kanban card on a kanban. Holds personalized positioning data."
  type KanbanCard {
    "ID of the kanban card in UUID"
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
  }

  extend type Query {
    "Get a kanban card by ID"
    kanbanCard(id: UUID!): KanbanCard
    "Gets all the kanban cards for a given kanban"
    kanbanCards(kanbanId: UUID!): [KanbanCard]
  }
`;

export default kanbanCard;

// FOR LATER

// "The input needed to create a new kanban card"
//   input CreateKanbanCardInput {
//     "A reference to the kanban this kanban card belongs to"
//     kanbanId: UUID!
//     title: String!
//     "(Optional) The column this card will initailly appear in. Defaults to TODO"
//     status: KanbanCanonCardStatusEnum
//     # "The master index of this card in the kanban. Determines the order cards are presented to user on initial use"
//     # index: Int
//     "A markdown body of the kanban card content"
//     body: String!
//   }
//   "Input that can be used to edit a kanban card - all fields are optional"
//   input EditKanbanCardInput {
//     "A reference to the kanban this kanban card belongs to"
//     kanbanId: UUID
//     title: String
//     "The column this card will initailly appear in. Defaults to TODO"
//     status: KanbanCanonCardStatusEnum
//     # "The master index of this card in the kanban. Determines the order cards are presented to user on initial use"
//     # index: Int
//     "A markdown body of the kanban card content"
//     body: String
//   }
//   extend type Mutation {
//     "Creates a new kanban card (requires admin privileges)"
//     createKanbanCard(input: CreateKanbanCardInput!): KanbanCard!
//     "Edits a kanban card (requires admin privileges)"
//     editKanbanCard(id: UUID!, input: EditKanbanCardInput!): KanbanCard!
//     "Deletes a kanban card (requires admin privileges)"
//     deleteKanbanCard(id: UUID!): Boolean!
//   }
