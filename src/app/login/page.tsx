import { redirect } from "next/navigation";
import { getSession } from "@/utils";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard/leads");
  }

  return <LoginForm />;
}
