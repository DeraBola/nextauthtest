import { auth } from "@/auth";
import HomeClient from "@/components/HomeClient";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login"); // send unauthenticated users to login
  }

  return (
  <HomeClient session={session} />
);
}
