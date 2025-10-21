// Docs: https://www.instantdb.com/docs/modeling-data

/*
 * important modeling concepts:
 * - `i.json` attributes are NOT strongly typed or validated by the DB (they are basically type any)
 * - all attributes are required by default
 * - links CANNOT carry information (attributes)
 * - links are NOT ordered; we CANNOT assume that the order links are added / modified will be preserved
 * - `.indexed` is required to use `order` or comparison operators in queries (e.g. `$gt`, `$lt`, `$gte`, `$lte`, `$ne`, `$isNull`, and `$like` operators)
 * - `.unique` is required to use `lookup(attribute, value)` in place of an id
 */

import { i } from "@instantdb/core";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    /*
     * We CANNOT add ATTRIBUTES to the '$users' entity (it is a special system-level entity)
     *
     * To add user-specific attributes (tied 1:1 with a $user), we can add attributes to our own userProfiles entity.
     *
     * We CAN add LINKS to the '$users' entity, so when linking to the concept of a 'user', we should link to '$users', NOT 'userProfiles'.
     */
    userProfiles: i.entity({
      firstName: i.string(),
      lastName: i.string(),
    }),
  },
  links: {
    // each user has exactly one profile
    userProfile_user$: {
      forward: {
        on: "userProfiles",
        label: "$user",
        has: "one",
        required: true,
      },
      reverse: { on: "$users", label: "profile", has: "one" },
    },

    // each profile may have one avatar file
    userProfile_avatar$file: {
      forward: { on: "userProfiles", label: "avatar$file", has: "one" },
      reverse: { on: "$files", label: "avatarOfUserProfile", has: "one" },
    },
  },
  rooms: {},
});

// this helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
