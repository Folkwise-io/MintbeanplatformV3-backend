import { gql } from "apollo-server-express";

const kanbanSessionCard = gql`
  "Possible statuses of a kanban session card"
  enum KanbanSessionCardStatusEnum {
    TODO
    WIP
    DONE
  }

  "A kanban session card that belongs to a kanban session."
  type KanbanSessionCard {
    "ID of the kanban card in UUID"
    id: UUID!

    "A reference to the kanban session this kanban session card belongs to"
    kanbanSessionId: UUID!

    "A reference to the kanban card this kanban session card points to"
    kanbanCardId: UUID!

    "The title of the referenced kanban card"
    title: String!

    "The body of the referenced kanban card"
    body: String!

    # "Determines the numerical order cards are presented to user in the fiven status column"
    # index: Int!

    "Status of the card, representing which kanban column it resides in ('TODO', 'WIP' or 'DONE')"
    status: KanbanSessionCardStatusEnum!

    "DateTime that the kanban session was created"
    createdAt: DateTime!

    "DateTime that the kanban session was modified"
    updatedAt: DateTime!
  }

  extend type KanbanSession {
    "The kanban sessions cards that belong to a kanban session"
    kanbanSessionCards: [KanbanSessionCard]
  }

  extend type Query {
    "Get a kanban session card by ID"
    kanbanSessionCard(id: UUID!): KanbanSessionCard

    "Gets all the kanban session cards for a given kanban session"
    kanbanSessionCards(kanbanSessionId: UUID!): [KanbanSessionCard]
  }

  "The input needed to create a new kanban session card"
  input CreateKanbanSessionCardInput {
    "A reference to the kanban session this kanban card belongs to"
    kanbanSessionId: UUID!

    "A reference to the kanban card this kanban session card points to"
    kanbanCardId: UUID!

    # "Determines the numerical order cards are presented to user in the fiven status column"
    # index: Int!

    "Status of the card, representing which kanban column it resides in ('TODO', 'WIP' or 'DONE')"
    status: KanbanSessionCardStatusEnum!
  }

  "Input that can be used to edit a kanban session card - all fields are optional"
  input EditKanbanSessionCardInput {
    "A reference to the kanban session this kanban card belongs to"
    kanbanSessionId: UUID

    "A reference to the kanban card this kanban session card points to"
    kanbanCardId: UUID

    # "Determines the numerical order cards are presented to user in the fiven status column"
    # index: Int

    "Status of the card, representing which kanban column it resides in ('TODO', 'WIP' or 'DONE')"
    status: KanbanSessionCardStatusEnum
  }

  extend type Mutation {
    "Creates a new kanban session card for the requesting user"
    createKanbanSessionCard(input: CreateKanbanSessionCardInput!): KanbanSessionCard!

    "Edits a kanban session card (must be kanban session card owner)"
    editKanbanSessionCard(id: UUID!, input: EditKanbanSessionCardInput!): KanbanSessionCard!

    "Deletes a kanban session card (must be kanban session card owner)"
    deleteKanbanSessionCard(id: UUID!): Boolean!
  }
`;

export default kanbanSessionCard;

// type KanbanSessionCardCategories {
//     todoCards: [KanbanSessionCard]
//     wipCards: [KanbanSessionCard]
//     doneCards: [KanbanSessionCard]
//   }

//   extend type KanbanSession {
//     "The kanban sessions cards that belong to a kanban session"
//     kanbanSessionCards: KanbanSessionCardCategories
//   }
