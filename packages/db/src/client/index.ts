import { init } from "@instantdb/react";
import schema from "../schema/instant.schema";

export const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID ?? "",
  schema,
});
