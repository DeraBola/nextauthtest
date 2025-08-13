import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Logout from "@/components/Logout";

const HomePage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/");
  console.log(session?.user?.image);


  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <h1 className="text-3xl my-3">{session?.user?.name}</h1>
      <Image
        src={session?.user?.image || "/default-avatar.png"}
        alt={session?.user?.name || "User Avatar"}
        width={100}
        height={72}
        className="rounded-full mb-4"
      />
      <Logout />
    </div>
  );
};

export default HomePage;
