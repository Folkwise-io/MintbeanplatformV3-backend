import { MediaAsset } from "../src/types/gqlGeneratedTypes";
import { TEST_KANBAN } from "./src/kanbanConstants";
import {
  GET_PROJECT_WITH_NESTED_MEDIA_ASSETS,
  AMY_PAPERJS_MEDIA_ASSET_1,
  AMY_PAPERJS_MEDIA_ASSET_2,
  BOB_PAPERJS_MEDIA_ASSET_1,
  AMY_PAPERJS_MEDIA_ASSET_1_JOIN,
  AMY_PAPERJS_MEDIA_ASSET_2_JOIN,
  BOB_PAPERJS_MEDIA_ASSET_1_JOIN,
} from "./src/mediaAssetConstants";
import { PAPERJS, ALGOLIA } from "./src/meetConstants";
import { AMY_ALGOLIA_PROJECT, AMY_PAPERJS_PROJECT, BOB_PAPERJS_PROJECT } from "./src/projectConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB } from "./src/userConstants";

const testManager = TestManager.build();

beforeAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
  await testManager.deleteAllProjects();
  await testManager.addUsers([AMY, BOB]);
  // required because this kanban is referenced in PAPERJS
  await testManager.addKanbans([TEST_KANBAN]);
  await testManager.addMeets([PAPERJS, ALGOLIA]);
  await testManager.addProjects([AMY_ALGOLIA_PROJECT, AMY_PAPERJS_PROJECT, BOB_PAPERJS_PROJECT]);
});

beforeEach(async () => {
  await testManager.deleteAllMediaAssets();
});

afterAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbans();
  await testManager.deleteAllProjects();
  await testManager.deleteAllMediaAssets();
  await testManager.destroy();
});

describe("Querying nested media assets in projects", () => {
  it("gets media assets of the project", async () => {
    await testManager.addMediaAssets([AMY_PAPERJS_MEDIA_ASSET_1, AMY_PAPERJS_MEDIA_ASSET_2, BOB_PAPERJS_MEDIA_ASSET_1]);
    await testManager.addProjectMediaAssets([
      AMY_PAPERJS_MEDIA_ASSET_1_JOIN,
      AMY_PAPERJS_MEDIA_ASSET_2_JOIN,
      BOB_PAPERJS_MEDIA_ASSET_1_JOIN,
    ]);

    await testManager
      .getGraphQLData({ query: GET_PROJECT_WITH_NESTED_MEDIA_ASSETS, variables: { id: AMY_PAPERJS_PROJECT.id } })
      .then(({ project }) => {
        expect(project.mediaAssets).toHaveLength(2);
        const [mediaAsset1, mediaAsset2]: MediaAsset[] = project.mediaAssets;
        expect(mediaAsset1.index).toBeLessThan(mediaAsset2.index);
        expect(AMY_PAPERJS_MEDIA_ASSET_1).toMatchObject(mediaAsset1);
      });

    await testManager
      .getGraphQLData({ query: GET_PROJECT_WITH_NESTED_MEDIA_ASSETS, variables: { id: BOB_PAPERJS_PROJECT.id } })
      .then(({ project }) => {
        expect(project.mediaAssets).toHaveLength(1);
        expect(BOB_PAPERJS_MEDIA_ASSET_1).toMatchObject(project.mediaAssets[0]);
      });
  });

  it("returns an empty array for media assets if project has no media assets", async () => {
    await testManager
      .getGraphQLData({ query: GET_PROJECT_WITH_NESTED_MEDIA_ASSETS, variables: { id: BOB_PAPERJS_PROJECT.id } })
      .then(({ project }) => {
        expect(project.mediaAssets).toHaveLength(0);
      });
  });

  it("doesn't retrieve deleted media assets", async () => {
    await testManager.addMediaAssets([
      { ...AMY_PAPERJS_MEDIA_ASSET_1, deleted: true } as any,
      AMY_PAPERJS_MEDIA_ASSET_2,
      BOB_PAPERJS_MEDIA_ASSET_1,
    ]);
    await testManager.addProjectMediaAssets([
      AMY_PAPERJS_MEDIA_ASSET_1_JOIN,
      AMY_PAPERJS_MEDIA_ASSET_2_JOIN,
      BOB_PAPERJS_MEDIA_ASSET_1_JOIN,
    ]);

    await testManager
      .getGraphQLData({ query: GET_PROJECT_WITH_NESTED_MEDIA_ASSETS, variables: { id: AMY_PAPERJS_PROJECT.id } })
      .then(({ project }) => {
        expect(project.mediaAssets).toHaveLength(1);
      });
  });
});
