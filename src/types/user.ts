import { Post, Project } from "./gqlGeneratedTypes";

// The internal representation of a User in the db
export interface User {
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
}

interface BaseUser {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;
  passwordHash?: undefined; // This guards against passwordHash being in the type that is returned
  posts?: Post[];
  projects?: Project[];
}

// The return type of a public query
export interface PublicUser extends BaseUser {
  email?: undefined;
}

// The return type of a private query
export interface PrivateUser extends BaseUser {
  email: string;
}
