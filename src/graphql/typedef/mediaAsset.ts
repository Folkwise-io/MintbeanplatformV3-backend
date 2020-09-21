import { gql } from "apollo-server-express";

const mediaAsset = gql`
  "An event hosted by Mintbean. Only Hack Meets exist for now but will include workshops etc. in the future"
  type MediaAsset {
    "ID of the MediaAsset in UUID"
    id: UUID!

    "ID of the User who created this MediaAsset"
    userId: UUID!

    "Public Cloudinary ID used to retrieve the MediaAsset"
    cloudinaryPublicId: String!

    "An index representing the order information of multiple MediaAssets in a Project submission"
    index: Int!

    "DateTime that the MediaAsset was saved to the database"
    createdAt: DateTime!

    "DateTime that the MediaAsset was saved to the database"
    updatedAt: DateTime!
  }

  extend type Project {
    "A list of MediaAssets for this Project, ordered by index"
    mediaAssets: [MediaAsset!]
  }

  extend input CreateProjectInput {
    "An array of Cloudinary Public IDs of the Project's MediaAssets"
    mediaAssets: [String]
  }

  # TODO: Extend type User to make all a user's mediaAssets queryable

  # TODO: Add top level query to allow direct searching of MediaAssets?
`;

export default mediaAsset;
