import { auth } from "@/auth";

export type CurrentUser = {
  id?: string;
  email?: string | null;
  name?: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}

export async function getCurrentUserLabel(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.name ?? user?.email ?? null;
}
