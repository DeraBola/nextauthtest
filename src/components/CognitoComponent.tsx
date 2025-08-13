"use client";

import { useAuth } from "react-oidc-context";

export default function CognitoComponent() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "7i1ep58u5qm8vpt3914608vm6f";
    const logoutUri = "http://localhost:3000";
    const cognitoDomain =
      "https://eu-north-1wrickx15x.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center h-full w-full justify-start">
        <div className="flex w-[60%] justify-center items-center flex-col gap-4">
          <pre> Hello: {auth.user?.profile.email} </pre>
          <pre> ID Token: {auth.user?.id_token} </pre>
          <pre> Access Token: {auth.user?.access_token} </pre>
          <pre> Refresh Token: {auth.user?.refresh_token} </pre>
        </div>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => auth.removeUser()}
        >
          Sign out
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
          onClick={() => signOutRedirect()}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => auth.signinRedirect()}
      >
        Sign in
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded ml-2"
        onClick={() => signOutRedirect()}
      >
        Sign out
      </button>
    </div>
  );
}
