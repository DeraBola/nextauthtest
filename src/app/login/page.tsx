"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Login() {
  const auth = useAuth();
   const router = useRouter();

    useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/"); // redirect to home
    }
  }, [auth.isAuthenticated, router]);
 

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen gap-10">
        <h4>Hey User Sign In</h4>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => auth.signinRedirect()}
      >
        Sign in
      </button>
    </div>
  );
}

