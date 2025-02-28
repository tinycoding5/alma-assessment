import { User } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@alma.com",
    role: "ADMIN",
  },
];

export async function getSession(): Promise<User | null> {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("session");

  if (!sessionCookie) return null;

  try {
    // In a real app, you would verify the token with your auth provider
    const user = MOCK_USERS.find((u) => u.id === sessionCookie.value);
    return user || null;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}

export function requireAuth() {
  const user = getSession();
  if (!user) {
    redirect("/login");
  }
  return user;
}
