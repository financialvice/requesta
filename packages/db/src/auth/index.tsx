"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { db } from "../client";

export function SignedIn({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH === "true") {
    return <>{children}</>;
  }
  return <db.SignedIn>{children}</db.SignedIn>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH === "true") {
    return null;
  }
  return <db.SignedOut>{children}</db.SignedOut>;
}

export function Redirect({ to }: { to: Route }) {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [router, to]);

  return null;
}

export function RedirectSignedOut({ to }: { to: Route }) {
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH === "true") {
    return null;
  }
  return (
    <SignedOut>
      <Redirect to={to} />
    </SignedOut>
  );
}

export function RedirectSignedIn({ to }: { to: Route }) {
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH === "true") {
    return null;
  }
  return (
    <SignedIn>
      <Redirect to={to} />
    </SignedIn>
  );
}

export const { sendMagicCode, signInWithMagicCode } = db.auth;
