import { gql } from "apollo-server-express";

const kanbanCanon = gql`
  "The master definition of a kanban that serves as a guide for projects."
  type KanbanCanon {
    "ID of the KanbanCanon in UUID"
    id: UUID!
    title: String!
    "A short cannonical description about the kanban project"
    description: String!
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

  extend type Mutation {
    "Creates a new kanbanCanon (requires admin privileges)"
    createKanbanCanon(input: CreateKanbanCanonInput!): KanbanCanon!
    "Edits a kanbanCanon (requires admin privileges)"
    editKanbanCanon(id: UUID!, input: EditKanbanCanonInput!): KanbanCanon!
    "Deletes a kanbanCanon (requires admin privileges)"
    deleteKanbanCanon(id: UUID!): Boolean!
  }
`;

export default kanbanCanon;
