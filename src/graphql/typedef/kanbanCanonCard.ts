import { gql } from "apollo-server-express";

const kanbanCanonCard = gql`
  "Possible initial statuses of a kanban card. Defaults to TODO, unless specified otherwise"
  enum KanbanCanonCardStatusEnum {
    TODO
    WIP
    DONE
  }
  "A canonical kanban card that belongs to a kanban."
  type KanbanCanonCard {
    "ID of the kanban card in UUID"
    id: UUID!
    title: String!
    "A markdown body of the kanban card content"
    body: String!
    "A reference to the kanban this kanban card belongs to"
    kanbanCanonId: UUID!
    "DateTime that the kanban was created"
    createdAt: DateTime!
    "DateTime that the kanban was modified"
    updatedAt: DateTime!
  }

  extend type KanbanCanon {
    "The kanban cards that belong to a kanban canon"
    kanbanCanonCards: [KanbanCanonCard]
  }
  extend type Kanban {
    "The kanban cards that belong to a kanban"
    kanbanCards: [KanbanCanonCard]
  }

  extend type Query {
    "Get a kanban card by ID"
    kanbanCanonCard(id: UUID!): KanbanCanonCard
    "Gets all the kanban cards for a given kanban"
    kanbanCanonCards(kanbanCanonId: UUID!): [KanbanCanonCard]
  }

  input CreateKanbanCanonCardInput {
    "A reference to the kanbanCanon this kanbanCanonCard belongs to"
    kanbanCanonId: UUID!
    title: String!
    "(Optional) The column this card will initailly appear in. Defaults to TODO"
    status: KanbanCanonCardStatusEnum
    "(Optional) The index this card will initially appear at. Defaults to end of status array"
    index: Int
    "A markdown body of the kanbanCanonCard content"
    body: String!
  }

  input EditKanbanCanonCardInput {
    title: String
    "(Optional) The column this card will initailly appear at. Defaults to TODO"
    status: KanbanCanonCardStatusEnum
    "(Optional) The index this card will initially appear at. Defaults to end of status array"
    index: Int
    "A markdown body of the kanbanCanonCard content"
    body: String
  }

  extend type Mutation {
    "Creates a new kanbanCanonCard (requires admin privileges)"
    createKanbanCanonCard(input: CreateKanbanCanonCardInput!): KanbanCanonCard!
    "Edits a kanban card (requires admin privileges)"
    editKanbanCanonCard(id: UUID!, input: EditKanbanCanonCardInput!): KanbanCanonCard!
    "Deletes a kanban card (requires admin privileges)"
    deleteKanbanCanonCard(id: UUID!): Boolean!
  }
`;

export default kanbanCanonCard;

// FOR LATER

// "The input needed to create a new kanban card"

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
