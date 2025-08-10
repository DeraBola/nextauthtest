import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/");

  return <div>
    HomePage
  </div>;
};

export default HomePage;
