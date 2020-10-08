import { gql } from "apollo-server-express";

const kanban = gql`
  "A kanban that serves as a guide for projects."
  type Kanban {
    "ID of the Kanban in UUID"
    id: UUID!

    title: String!

    "A short description about the kanban project"
    description: String!

    "DateTime that the kanban was created"
    createdAt: DateTime!

    "DateTime that the kanban was modified"
    updatedAt: DateTime!
  }

  extend type Meet {
    "The kanban associated with this meet (if provided)"
    kanban: Kanban
    kanbanId: UUID
  }

  extend type Query {
    "Get a kanban by ID"
    kanban(id: UUID!): Kanban

    "Gets all the kanbans"
    kanbans: [Kanban]
  }

  "The input needed to create a new kanban"
  input CreateKanbanInput {
    title: String!

    "A short description about the kanban project"
    description: String!
  }

  "Input that can be used to edit a kanban - all fields are optional"
  input EditKanbanInput {
    title: String

    "A short description about the kanban project"
    description: String
  }

  extend type Mutation {
    "Creates a new kanban (requires admin privileges)"
    createKanban(input: CreateKanbanInput!): Kanban!

    "Edits a kanban (requires admin privileges)"
    editKanban(id: UUID!, input: EditKanbanInput!): Kanban!

    "Deletes a kanban (requires admin privileges)"
    deleteKanban(id: UUID!): Boolean!
  }
`;

export default kanban;
