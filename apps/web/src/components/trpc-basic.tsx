"use client";

import { useTRPC } from "@repo/trpc/client";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function TRPCBasic() {
  const trpc = useTRPC();
  const [name, setName] = useState("World");

  const helloQuery = useQuery(
    trpc.hello.hello.queryOptions({
      name,
    })
  );

  const updateGreeting = useMutation({
    mutationFn: (newName: string) => {
      setName(newName);
      return Promise.resolve(newName);
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>tRPC Example</CardTitle>
          <CardDescription>
            Enter a name to receive a personalized greeting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {helloQuery.isLoading && <p className="text-lg">Loading...</p>}
            {helloQuery.error && (
              <p className="text-red-500">Error: {helloQuery.error.message}</p>
            )}
            {helloQuery.data && <p className="text-lg">{helloQuery.data}</p>}
          </div>

          <div className="flex gap-2">
            <Input
              className="rounded border px-3 py-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const target = e.target as HTMLInputElement;
                  updateGreeting.mutate(target.value);
                }
              }}
              placeholder="Enter name"
              type="text"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              const input = document.querySelector("input") as HTMLInputElement;
              if (input?.value) {
                updateGreeting.mutate(input.value);
              }
            }}
          >
            Update Greeting
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
