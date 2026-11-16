import { redirect, notFound } from "next/navigation";
import { currentUser } from "@/lib/studio/auth";
import { integrations } from "@/lib/studio/env";
import { getPost } from "@/lib/studio/store";
import { Shell } from "../../_components/Shell";
import { Editor } from "../../_components/Editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit post" };

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/studio/login");
  const post = await getPost((await params).id).catch(() => null);
  if (!post) notFound();
  return (
    <Shell user={user} active="post">
      <Editor initial={post} integrations={integrations()} />
    </Shell>
  );
}
