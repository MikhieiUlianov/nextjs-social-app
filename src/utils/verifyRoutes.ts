import { verifyAuth } from "@/lib/auth";

import { redirect } from "next/navigation";

export const verifyRoute = async () => {
  const verified = await verifyAuth();
  if (!verified.user || !verified.session) {
    console.log("not verified, redirecting...");
    redirect("/registration");
  }
};
