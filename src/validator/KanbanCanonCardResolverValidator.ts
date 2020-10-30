import { ServerContext } from "../buildServerContext";
import KanbanCanonCardDao from "../dao/KanbanCanonCardDao";
import KanbanCanonDao from "../dao/KanbanCanonDao";
import { KanbanCanonCardServiceGetManyArgs, KanbanCanonCardServiceGetOneArgs } from "../service/KanbanCanonCardService";
import { KanbanCanon, KanbanCanonCard } from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";

export default class KanbanCanonCardResolverValidator {
  constructor(private kanbanCanonCardDao: KanbanCanonCardDao, private kanbanCanonDao: KanbanCanonDao) {}

  async getOne(
    { id }: KanbanCanonCardServiceGetOneArgs,
    _context: ServerContext,
  ): Promise<KanbanCanonCardServiceGetOneArgs> {
    await this.kanbanCanonCardDao
      .getOne({ id })
      .then((kanbanCanonCard) => ensureExists<KanbanCanonCard>("KanbanCanonCard")(kanbanCanonCard));
    return { id };
  }

  async getMany(
    { kanbanCanonId }: KanbanCanonCardServiceGetManyArgs,
    _context: ServerContext,
  ): Promise<KanbanCanonCardServiceGetManyArgs> {
    await this.kanbanCanonDao
      .getOne({ id: kanbanCanonId })
      .then((kanbanCanon) => ensureExists<KanbanCanon>("KanbanCanon")(kanbanCanon));
    return { kanbanCanonId };
  }

  //   async addOne(
  //     { input }: MutationCreateKanbanCanonCardArgs,
  //     _context: ServerContext,
  //   ): Promise<KanbanCanonCardServiceAddOneInput> {
  //     //TODO: Validate createKanbanCanonCard args
  //     return input;
  //   }

  //   async editOne(
  //     { id, input }: MutationEditKanbanCanonCardArgs,
  //     _context: ServerContext,
  //   ): Promise<{ id: string; input: KanbanCanonCardServiceEditOneInput }> {
  //     // Check if meet id exists in db
  //     await this.kanbanCanonCardDao.getOne({ id }).then((meet) => ensureExists("KanbanCanonCard")(meet));

  //     // Handle when input has no fields to update (knex doesn't like this)
  //     if (Object.keys(input).length === 0) {
  //       throw new UserInputError("Must edit at least one field!");
  //     }

  //     return { id, input };
  //   }

  //   async deleteOne({ id }: MutationDeleteKanbanCanonCardArgs): Promise<string> {
  //     // Check if meet id exists in db
  //     return this.kanbanCanonCardDao
  //       .getOne({ id })
  //       .then((meet) => ensureExists<KanbanCanonCard>("KanbanCanonCard")(meet))
  //       .then(({ id }) => id);
  //   }
}
