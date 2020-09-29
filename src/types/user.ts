import { Post, Project } from "./gqlGeneratedTypes";

export type User = {
  /** User's ID in UUID */
  id: string;
  /** Unique email */
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  /** DateTime that the user registered */
  createdAt: string;
  /** DateTime that the user updated their profile */
  updatedAt: string;
  /** Whether the user has admin privileges to create/modify events */
  isAdmin: boolean;

  posts?: Post[];
  /** All the projects that the user has submitted */
  projects?: Project[];
};
