import { gql } from "apollo-server-express";

const kanban = gql`
  type KanbanCardPositions {
    todo: [UUID!]!
    wip: [UUID!]!
    done: [UUID!]!
  }
  "A personalized view of a kanbanCanon that holds the positions of kanban cards for the session owner"
  type Kanban {
    "ID of the kanban in UUID"
    id: UUID!
    title: String!
    description: String!
    "Id of the master kanban off which this view is based"
    kanbanCanonId: UUID!
    "Id of user who owns the view of this kanban"
    userId: UUID!
    "Id of meet this kanban is associated with. Possibly null"
    meetId: UUID
    "An object storing the status column and indexes of kanban cards"
    cardPositions: KanbanCardPositions!
    "DateTime that the kanban was created"
    createdAt: DateTime!
    "DateTime that the kanban was modified"
    updatedAt: DateTime!
  }
  extend type Meet {
    "The personalized kanban view (if exists) associated with this meet for the requesting user"
    kanban: Kanban
    # kanbanId: UUID
  }

  extend type Query {
    "Get a kanban matching given optional inputs. Only admins can get kanban of other users"
    kanban(id: UUID, kanbanCanonId: UUID, userId: UUID, meetId: UUID): Kanban
    "Gets all kanbans matching given optional inputs. Only admins can get kanbans of other users."
    kanbans(kanbanCanonId: UUID, userId: UUID, meetId: UUID): [Kanban]
  }
  "The input needed to create a new kanban"
  input CreateKanbanInput {
    "Id of the kanbanCanon off which this kanban is based"
    kanbanCanonId: UUID!
    "Id of the user that owns this kanban view"
    userId: UUID!
    "(Optional) Id of the meet this kanban belongs to"
    meetId: UUID
  }

  extend type Mutation {
    "Creates a new kanban view"
    createKanban(input: CreateKanbanInput!): Kanban!
    "Update the position of a card on a kanban, and get updated card positions object"
    updateKanbanCardPositions(id: UUID!, input: UpdateCardPositionInput!): KanbanCardPositions!
    deleteKanban(id: UUID!): Boolean!
  }
`;

export default kanban;
