import { User } from "../../src/types/User";
import TestManager from "./TestManager";
import {
  AMY,
  AMY_CREDENTIALS,
  BOB,
  BOB_CREDENTIALS,
  DORTHY,
  DORTHY_CREDENTIALS,
  LOGIN,
} from "./constants/userConstants";

export function getCurrentUnixTime(): number {
  return Math.floor(new Date().getTime() / 1000);
}

export async function getCookies(user: User, credentials: { email: string; password: string }): Promise<string[]> {
  const testManager = TestManager.build();
  await testManager.deleteAllUsers();
  await testManager.addUsers([user]);
  const cookies = await testManager.getCookies({ query: LOGIN, variables: credentials });
  await testManager.deleteAllUsers();
  await testManager.destroy();
  return cookies;
}

export async function getAdminCookies(): Promise<string[]> {
  return getCookies(AMY, AMY_CREDENTIALS);
}

export async function getBobCookies(): Promise<string[]> {
  return getCookies(BOB, BOB_CREDENTIALS);
}

export async function getDorthyCookies(): Promise<string[]> {
  return getCookies(DORTHY, DORTHY_CREDENTIALS);
}
