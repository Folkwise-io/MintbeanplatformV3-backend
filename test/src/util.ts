import TestManager from "./TestManager";
import { AMY, AMY_CREDENTIALS, LOGIN } from "./userConstants";

export function getCurrentUnixTime(): number {
  return Math.floor(new Date().getTime() / 1000);
}

export async function getAdminCookies(): Promise<string[]> {
  const testManager = TestManager.build();
  await testManager.deleteAllUsers();
  await testManager.addUsers([AMY]);
  const adminCookies = await testManager.getCookies({ query: LOGIN, variables: AMY_CREDENTIALS });
  await testManager.destroy();
  return adminCookies;
}
