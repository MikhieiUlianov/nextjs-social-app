import { redirect } from "next/navigation";
import { getUser } from "./getUser";

export const verifyRoute = async () => {
  const verified = await getUser();
  if (!verified.user || !verified.session) {
    console.log("not verified, redirecting...");
    redirect("/registration");
  }
};
