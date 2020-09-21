import { gql } from "apollo-server-express";

const project = gql`
  type Project {
    "ID of project in UUID"
    id: UUID!

    "ID of the user who created the project"
    userId: UUID!

    "ID of the Meet associated with this project (optional)"
    meetId: UUID

    "Title given to the project"
    title: String!

    "The URL (i.e. GitHub link) of the project's public source code"
    sourceCodeUrl: String!

    "The URL of the project's deployment"
    liveUrl: String!

    "DateTime that the project was submitted"
    createdAt: DateTime!

    "DateTime that the project was edited"
    updatedAt: DateTime!

    "The user who created the project"
    user: User

    "The meet associated with the project"
    meet: Meet
  }

  extend type User {
    "All the projects that the user has submitted"
    projects: [Project!]
  }

  extend type Meet {
    "All the projects that are associated with the Meet"
    projects: [Project!]
  }

  extend type Query {
    "Search for projects by userId or meetID"
    projects(userId: UUID, meetId: UUID): [Project]

    "Get a single project by its ID"
    project(id: UUID!): Project
  }

  "Fields required to create a new project"
  input CreateProjectInput {
    "ID of the user who created the project (optional)"
    userId: UUID

    "ID of the Meet associated with this project (optional)"
    meetId: UUID

    "Title given to the project"
    title: String!

    "The URL (i.e. GitHub link) of the project's public source code"
    sourceCodeUrl: String!

    "The URL of the project's deployment"
    liveUrl: String!
  }

  extend type Mutation {
    createProject(input: CreateProjectInput!): Project!
  }
`;

export default project;
