import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function UserSessionLoader() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    image: session.user.image ?? null
  };
}
