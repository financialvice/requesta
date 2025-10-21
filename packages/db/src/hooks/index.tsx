"use client";

import type { UpdateParams } from "@instantdb/core";
import { id as newId } from "@instantdb/core";
import { useEffect } from "react";
import { db } from "../client";
import type { AppSchema } from "../schema/instant.schema";

/*
 * useUserProfile
 */
export const useUserProfile = () => {
  const { id } = db.useUser();
  const { data, isLoading, error } = db.useQuery({
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
      db.transact([
        db.tx.userProfiles[newId()]!.create({
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

    db.transact([
      db.tx.userProfiles[userProfile.id]!.update({
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
    signOut: () => db.auth.signOut(),
  };
};
