"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useUserProfile } from "@repo/db";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";
import { SidebarMenuButton } from "@repo/ui/components/sidebar";
import { UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userDetailsSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type UserDetailsFormData = z.infer<typeof userDetailsSchema>;

export function UserSettingsDialog() {
  const { userProfile, signOut, updateUserProfile } = useUserProfile();

  const form = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstName: userProfile?.firstName ?? "",
      lastName: userProfile?.lastName ?? "",
    },
    values: {
      firstName: userProfile?.firstName ?? "",
      lastName: userProfile?.lastName ?? "",
    },
  });

  const userFullName =
    userProfile?.firstName && userProfile?.lastName
      ? `${userProfile.firstName} ${userProfile.lastName}`
      : undefined;

  const userEmail = userProfile?.$user?.email ?? "";

  const userNameOrEmail = userFullName ?? userEmail;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <UserIcon />
          <span>{userNameOrEmail}</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and account settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* $user attributes are read-only */}
          {userEmail && (
            <div className="space-y-2">
              <span className="font-medium text-sm">Email</span>
              <Input disabled value={userEmail} />
            </div>
          )}
          <Separator />
          <Form {...form}>
            <form
              className="space-y-4"
              onChange={form.handleSubmit(updateUserProfile)}
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button onClick={signOut} variant="outline">
            Log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
