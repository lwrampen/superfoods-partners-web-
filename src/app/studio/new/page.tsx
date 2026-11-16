import { redirect } from "next/navigation";
import { currentUser } from "@/lib/studio/auth";
import { integrations } from "@/lib/studio/env";
import { Shell } from "../_components/Shell";
import { NewPost } from "../_components/NewPost";

export const dynamic = "force-dynamic";
export const metadata = { title: "New post" };

export default async function NewPage() {
  const user = await currentUser();
  if (!user) redirect("/studio/login");
  return (
    <Shell user={user} active="new">
      <NewPost storage={integrations().storage} />
    </Shell>
  );
}
