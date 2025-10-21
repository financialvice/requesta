import { RedirectSignedOut, SignedIn } from "@repo/db";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { AppSidebar } from "../../components/app-sidebar";

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RedirectSignedOut to="/login" />
      <SignedIn>
        <SidebarProvider>
          <AppSidebar />
          <main className="relative h-screen flex-1 overflow-hidden">
            {children}
          </main>
        </SidebarProvider>
      </SignedIn>
    </>
  );
}
