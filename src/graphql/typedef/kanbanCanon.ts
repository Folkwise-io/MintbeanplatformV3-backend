import { gql } from "apollo-server-express";

// definition for KanbanCardPositions is in typedef/kanban.ts
const kanbanCanon = gql`
  "The master definition of a kanban that serves as a guide for projects."
  type KanbanCanon {
    "ID of the KanbanCanon in UUID"
    id: UUID!
    title: String!
    "A short cannonical description about the kanban project"
    description: String!
    "An object storing the status column and indexes of kanban canon cards"
    cardPositions: KanbanCardPositions!
    "DateTime that the kanbanCanon was created"
    createdAt: DateTime!
    "DateTime that the kanbanCanon was modified"
    updatedAt: DateTime!
  }
  extend type Meet {
    "The kanbanCanon associated with this meet (if provided)"
    kanbanCanon: KanbanCanon
    kanbanCanonId: UUID
  }

  extend input EditMeetInput {
    "The kanbanCanon associated with this meet (if provided)"
    kanbanCanonId: UUID
  }

  extend type Query {
    "Get a kanbanCanon by ID"
    kanbanCanon(id: UUID!): KanbanCanon
    "Gets all the kanbanCanons"
    kanbanCanons: [KanbanCanon]
  }

  "The input needed to create a new kanbanCanon"
  input CreateKanbanCanonInput {
    title: String!
    "A short cannonical description about the kanban project"
    description: String!
  }

  "Input that can be used to edit a kanban - all fields are optional"
  input EditKanbanCanonInput {
    title: String
    "A short description about the kanban project"
    description: String
  }

  input UpdateCardPositionInput {
    cardId: UUID!
    status: KanbanCanonCardStatusEnum!
    index: Int!
  }

  extend type Mutation {
    "Creates a new kanbanCanon (requires admin privileges)"
    createKanbanCanon(input: CreateKanbanCanonInput!): KanbanCanon!
    "Edits an existing kanbanCanon (requires admin privileges)"
    editKanbanCanon(id: UUID!, input: EditKanbanCanonInput!): KanbanCanon!
    "Update the position of an existing kanbanCanonCard on a kanbanCanon. Returns updated card positions object."
    updateKanbanCanonCardPositions(id: UUID!, input: UpdateCardPositionInput!): KanbanCardPositions!
  }
`;

export default kanbanCanon;
