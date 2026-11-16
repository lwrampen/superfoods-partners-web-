import { redirect } from "next/navigation";
import { currentUser } from "@/lib/studio/auth";
import { integrations } from "@/lib/studio/env";
import { Shell } from "./_components/Shell";
import { Overview } from "./_components/Overview";

export const dynamic = "force-dynamic";
export const metadata = { title: "Overview" };

export default async function StudioHome() {
  const user = await currentUser();
  if (!user) redirect("/studio/login");
  return (
    <Shell user={user} active="overview">
      <Overview integrations={integrations()} />
    </Shell>
  );
}
