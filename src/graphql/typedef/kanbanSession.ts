import { gql } from "apollo-server-express";

const kanbanSession = gql`
  "A session that stores a view of given kanban with individualized card placement"
  type KanbanSession {
    "ID of the kanban session in UUID"
    id: UUID!

    "The title found on the referenced kanban"
    title: String!

    "The desciption found on the referenced kanban"
    description: String!

    "Id of master kanban this session is based off of"
    kanbanId: UUID!

    "Id of user who has access to this kanban session"
    userId: UUID!

    "(Optional) id of meet this kanban session is associated with"
    meetId: UUID

    "DateTime that the kanban session was created"
    createdAt: DateTime!

    "DateTime that the kanban session was modified"
    updatedAt: DateTime!
  }

  extend type Meet {
    "The kanban session (if exists) associated with this meet for the requesting user"
    kanbanSession: KanbanSession
    kanbanSessionId: UUID
  }

  type KanbanSessionSearchArgs {
    meetId: UUID
    kanbanId: UUID
    userId: UUID
  }

  extend type Query {
    "Get a kanban session matching given optional inputs. If no userId provided, uses userId from cookies. Only admins can get kanban session of other users"
    kanbanSession(id: UUID, kanbanId: UUID, userId: UUID, meetId: UUID): KanbanSession

    "Gets all kanban sessions matching given optional inputs. If no userId provided, uses userId from cookies. Only admins can get kanban sessions of other users."
    kanbanSessions(kanbanId: UUID, userId: UUID, meetId: UUID): [KanbanSession]
  }

  "The input needed to create a new kanban"
  input CreateKanbanSessionInput {
    kanbanId: UUID!
    userId: UUID!
    meetId: UUID
  }

  "Input that can be used to edit a kanban session - all fields are optional"
  input EditKanbanSessionInput {
    kanbanId: UUID
    userId: UUID
    meetId: UUID
  }

  extend type Mutation {
    "Creates a new kanban session"
    createKanbanSession(input: CreateKanbanSessionInput!): KanbanSession!

    "Edits a kanban session"
    editKanbanSession(id: UUID!, input: EditKanbanSessionInput!): KanbanSession!

    "Deletes a kanban session"
    deleteKanbanSession(id: UUID!): Boolean!
  }
`;

export default kanbanSession;
