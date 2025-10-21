import { init } from "@instantdb/react";
import { createDb } from "./create-db";
import schema from "./instant.schema";

/**
 * Web entry point that wires the shared Instant client facade to the browser
 * SDK. Next.js will resolve this file by default while Expo picks up
 * `index.native.ts`.
 */
const createWebDb = () => {
  const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
  const client = init({
    appId,
    schema,
  });

  return createDb(client);
};

export const db = createWebDb();
export type WebDb = typeof db;
