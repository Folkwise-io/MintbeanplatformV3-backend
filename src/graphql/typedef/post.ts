import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

const post: DocumentNode = gql`
  type Post {
    "ID of post in UUID"
    id: UUID!

    "ID of the user who created the posted"
    userId: UUID!

    "Unique username"
    body: String

    "Date that the post was made"
    createdAt: String

    "Date that the post was edited"
    updatedAt: String

    "User who created the post"
    user: User
  }

  extend type User {
    posts: [Post] # Keep everything related to posts in this schema.
  }

  extend type Query {
    "Search for posts by userId"
    posts(userId: UUID): [Post]

    "Get a single post by its ID"
    post(id: UUID!): Post
  }
`;

export default post;
