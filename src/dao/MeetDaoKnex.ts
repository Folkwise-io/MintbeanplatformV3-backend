import Knex from "knex";
import { Meet } from "../types/gqlGeneratedTypes";
import MeetDao from "./MeetDao";

export default class MeetDaoKnex implements MeetDao {
  constructor(private knex: Knex) {}
  deleteAll(): Promise<void> {
    return this.knex<Meet>("meets").delete();
  }
}
