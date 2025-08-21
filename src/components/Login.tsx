"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Login() {
  const auth = useAuth();
  const router = useRouter();

  console.log("auth: ", auth);

  const handleGoogleLogin = () => {
    auth.signinRedirect({
      extraQueryParams: {
        identity_provider: "Google",
      },
    });
  };

  const handleLinkedInLogin = () => {
    auth.signinRedirect({
      extraQueryParams: {
        identity_provider: "LinkedIn",
      },
    });
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/"); // redirect to home
    }
  }, [auth.isAuthenticated, router]);

  let content;
  if (auth.isLoading) {
    content = <div>Loading...</div>;
  } else if (auth.error) {
    content = <div>Encountering error... {auth.error.message}</div>;
  } else {
    content = (
      <>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => auth.signinRedirect()}
        >
          Sign in
        </button>
        <button
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-blue-700"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>
        <button
          className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-blue-700"
          onClick={handleLinkedInLogin}
        >
          Continue with LinkedIn
        </button>
      </>
    );
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen gap-10">
      <h4>Hey User Sign In</h4>
      {content}
    </div>
  );
}
