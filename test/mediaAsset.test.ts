import { MEDIA_ASSET_1, MEDIA_ASSET_2, MEDIA_ASSET_3 } from "./src/mediaAssetConstants";
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
  await testManager.addMeets([PAPERJS, ALGOLIA]);
  await testManager.addProjects([AMY_ALGOLIA_PROJECT, AMY_PAPERJS_PROJECT, BOB_PAPERJS_PROJECT]);
});

beforeEach(async () => {
  await testManager.deleteAllMediaAssets();
});

afterAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
  await testManager.deleteAllProjects();
  await testManager.deleteAllMediaAssets();
  await testManager.destroy();
});

describe("Querying nested media assets in projects", () => {
  it("Does something", async () => {
    await testManager.addMediaAssets([MEDIA_ASSET_1, MEDIA_ASSET_2, MEDIA_ASSET_3]).then(testManager.logResponse);
    expect(true).toBe(true);
  });
});
