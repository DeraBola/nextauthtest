"use client";

import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CognitoComponent() {
  const auth = useAuth();
  const router = useRouter();

  // 🔹 Protect this page: redirect to /login if not authenticated
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  const signOutRedirect = () => {
    const clientId = "7i1ep58u5qm8vpt3914608vm6f";
    const logoutUri = "http://localhost:3000/login"; // must be allowed in Cognito
    const cognitoDomain =
      "https://eu-north-1wrickx15x.auth.eu-north-1.amazoncognito.com";

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  const signOutLocal = async () => {
    await auth.removeUser();
    router.push("/login");
  };

  if (auth.isLoading) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  if (auth.error) {
    return (
      <div className="flex items-center justify-center">
        Encountering error... {auth.error.message}
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    // while redirecting, you can render nothing or a loader
    return null;
  }

  return (
    <div className="flex flex-col items-center h-full w-full justify-start">
      <div className="flex w-[60%] justify-center items-center flex-col gap-4">
        <pre>Hello: {auth.user?.profile.email}</pre>
        <pre>ID Token: {auth.user?.id_token}</pre>
        <pre>Access Token: {auth.user?.access_token}</pre>
        <pre>Refresh Token: {auth.user?.refresh_token}</pre>
      </div>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded m-10"
        onClick={signOutLocal}
      >
        Sign out from Session storage or Cookies
      </button>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded ml-2"
        onClick={signOutRedirect}
      >
        Sign out from Amazon Cognito
      </button>
    </div>
  );
}
