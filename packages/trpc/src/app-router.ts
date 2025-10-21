import { helloRouter } from "./routers/hello";
import { t } from "./server";

export const appRouter = t.router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
