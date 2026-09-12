import { Nav } from "@/components/Nav";
import { StatusBar } from "@/components/StatusBar";
import { requirePilot } from "@/lib/gate";

/**
 * Everything under this layout is signed in and pilot-approved: the gate runs
 * here once rather than at the top of each page.
 */
export default async function ConsoleLayout({ children }: LayoutProps<"/">) {
  const user = await requirePilot();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">{children}</main>
      <StatusBar email={user.email} />
    </div>
  );
}
