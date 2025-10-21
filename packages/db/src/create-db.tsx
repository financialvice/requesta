import {
  type InstantReactAbstractDatabase,
  id as newId,
  type UpdateParams,
} from "@instantdb/react";
import { useEffect } from "react";
import type { AppSchema } from "./instant.schema";

/**
 * Binds the Instant client to a tiny facade we can share between platforms.
 * While the name mentions "db", the returned object exposes hooks, auth
 * helpers, and rendering guards that power the Expo protected routes flow.
 */
type InstantClient = InstantReactAbstractDatabase<AppSchema>;

/**
 * Builds the platform-aware `db` facade by wiring shared hook factories to a
 * concrete InstantDB client. Each entry point (`index.ts` for web,
 * `index.native.ts` for React Native) calls this with its respective
 * initializer.
 */
export const createDb = <Client extends InstantClient>(client: Client) => {
  /**
   * Subscribes to the entire `$users` collection.
   *
   * @example
   * ```tsx
   * import { db } from "@repo/db";
   *
   * function UsersList() {
   *   const data = db.useUsers();
   *   return data?.$users?.map((user) => <div key={user.id}>{user.email}</div>);
   * }
   * ```
   */
  const useUsers = () => {
    const { data } = client.useQuery({
      $users: {},
    });

    return data;
  };

  /*
   * useUserProfile
   */
  const useUserProfile = () => {
    const { id } = client.useUser();
    const { data, isLoading, error } = client.useQuery({
      userProfiles: {
        $: { where: { "$user.id": id } },
        $user: {
          profile: {
            avatar$file: {},
          },
        },
      },
    });

    /*
     * we should NOT typically use `useEffect` like this
     * this is generally a poor pattern and we should find a better pattern
     */
    useEffect(() => {
      if (id && !isLoading && !error && !data?.userProfiles?.[0]) {
        client.transact([
          client.tx.userProfiles[newId()]!.create({
            firstName: "",
            lastName: "",
          }).link({
            $user: id,
          }),
        ]);
      }
    }, [data, isLoading, error, id]);

    const userProfile = data?.userProfiles?.[0];

    const updateUserProfile = ({
      firstName,
      lastName,
    }: UpdateParams<AppSchema, "userProfiles">) => {
      if (!userProfile?.id) {
        return;
      }

      client.transact([
        client.tx.userProfiles[userProfile.id]!.update({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        }),
      ]);
    };

    return {
      userProfile,
      isLoading,
      error,
      updateUserProfile,
      signOut: () => client.auth.signOut(),
    };
  };

  function SignedIn({ children }: { children: React.ReactNode }) {
    return <client.SignedIn>{children}</client.SignedIn>;
  }

  function SignedOut({ children }: { children: React.ReactNode }) {
    return <client.SignedOut>{children}</client.SignedOut>;
  }

  function Redirect({ onRedirect }: { onRedirect: () => void }) {
    useEffect(() => {
      onRedirect();
    }, [onRedirect]);

    return null;
  }

  function RedirectSignedOut({ onRedirect }: { onRedirect: () => void }) {
    return (
      <SignedOut>
        <Redirect onRedirect={onRedirect} />
      </SignedOut>
    );
  }

  function RedirectSignedIn({ onRedirect }: { onRedirect: () => void }) {
    return (
      <SignedIn>
        <Redirect onRedirect={onRedirect} />
      </SignedIn>
    );
  }

  return {
    useUsers,
    useAuth: () => client.useAuth(),
    useUser: () => client.useUser(),
    useUserProfile,
    auth: client.auth,
    SignedIn: client.SignedIn,
    SignedOut: client.SignedOut,
    RedirectSignedOut,
    RedirectSignedIn,
    Redirect,
    getAuth: () => client.getAuth(),
  };
};

export type Db = ReturnType<typeof createDb<InstantClient>>;
