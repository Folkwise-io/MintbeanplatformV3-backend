import { gql } from "apollo-server-express";

const kanbanCard = gql`
  "A kanban card that belongs to a kanban."
  type KanbanCard {
    "ID of the kanban card in UUID"
    id: UUID!

    title: String!

    "A markdown body of the kanban card content"
    body: String!

    "A reference to the kanban this kanban card belongs to"
    kanbanId: UUID!

    "DateTime that the kanban was created"
    createdAt: DateTime!

    "DateTime that the kanban was modified"
    updatedAt: DateTime!
  }

  extend type Query {
    "Get a kanban card by ID"
    kanbanCard(id: UUID!): KanbanCard

    "Gets all the kanban cards for a given kanban"
    kanbanCards(id: UUID!): [KanbanCard]
  }

  "The input needed to create a new kanban card"
  input CreateKanbanCardInput {
    "A reference to the kanban this kanban card belongs to"
    kanbanId: UUID!

    title: String!

    "A markdown body of the kanban card content"
    body: String!
  }

  "Input that can be used to edit a kanban card - all fields are optional"
  input EditKanbanCardInput {
    "A reference to the kanban this kanban card belongs to"
    kanbanId: UUID

    title: String

    "A markdown body of the kanban card content"
    body: String
  }

  extend type Mutation {
    "Creates a new kanban card (requires admin privileges)"
    createKanbanCard(input: CreateKanbanCardInput!): KanbanCard!

    "Edits a kanban card (requires admin privileges)"
    editKanbanCard(id: UUID!, input: EditKanbanCardInput!): KanbanCard!

    "Deletes a kanban card (requires admin privileges)"
    deleteKanbanCard(id: UUID!): Boolean!
  }
`;

export default kanbanCard;
