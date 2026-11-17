import { redirect } from "next/navigation";
import { authConfigured, currentUser } from "@/lib/studio/auth";
import { LoginForm } from "../_components/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/studio");
  return <LoginForm configured={authConfigured()} />;
}
