import { redirect } from "next/navigation";

import { getUser } from "@/lib/server-auth";

/** Redirects verified users away from guest auth pages before client hydration. */
export async function AuthenticatedUserRedirect() {
  const user = await getUser();

  if (user?.email_verified_at) {
    redirect("/dashboard");
  }

  return null;
}
