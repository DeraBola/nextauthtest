"use client";

import type { Session as NextAuthSession } from "@auth/core/types";
import Image from "next/image";
import Logout from "@/components/Logout";

type Session = NextAuthSession & {
  user?: {
    name?: string | null;  // must allow null
    image?: string | null;
  };
};


export default function HomeClient({ session }: { readonly session: Session }) {

  console.log("Tenant assignment success");

  return (
    <div className="flex border-2 border-green-500 bg-yellow-400 justify-start items-center flex-col h-screen">
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
}
