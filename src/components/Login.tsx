"use client";

import {
  generateCodeVerifier,
  generateState,
  generateCodeChallenge,
} from "@/lib/helperFunction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function Login() {
  const auth = useAuth();
  const router = useRouter();

  const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
  const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!;
  const SCOPES = process.env.NEXT_PUBLIC_SCOPES ?? "openid profile email";

  const [loginUrl, setLoginUrl] = useState<string>("");

  async function buildAuthorizeUrl(identityProvider: string, state: string) {
    const codeVerifier = generateCodeVerifier();
    sessionStorage.setItem("pkce_verifier", codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const redirectUri = `${window.location.origin}/callback`;

    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      scope: SCOPES,
      identity_provider: identityProvider,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    return `${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
  }

  async function redirectToCognito(provider: string) {
    const state = generateState();
    sessionStorage.setItem("oauth_state", state);

    const authorizeUrl = await buildAuthorizeUrl(provider, state);
    console.log(authorizeUrl);
    // window.location.href = authorizeUrl;
  }

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/"); // redirect to home
    }
  }, [auth.isAuthenticated, router]);

  useEffect(() => {
    const prepareLoginUrl = async () => {
      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      sessionStorage.setItem("code_verifier", codeVerifier);
      sessionStorage.setItem("state", state);

      const url =
        `${COGNITO_DOMAIN}/oauth2/authorize?` +
        `identity_provider=Google&` +
        `client_id=${CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${REDIRECT_URI}&` +
        `state=${state}&` +
        `scope=${encodeURIComponent("openid profile email phone")}&` +
        `code_challenge_method=S256&` +
        `code_challenge=${codeChallenge}`;

      setLoginUrl(url);
    };

    prepareLoginUrl();
  }, [COGNITO_DOMAIN, CLIENT_ID, REDIRECT_URI]);

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

        <Link
          href="https://eu-north-1wrickx15x.auth.eu-north-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&client_id=7i1ep58u5qm8vpt3914608vm6f&response_type=code&redirect_uri=http://localhost:3000&state=a0b5b83354384ca3b7a31ddc56c1e54a&scope=openid%20profile%20email%20phone&code_challenge_method=S256&code_challenge=2f2gQBhoBBDcikesiFooCgM-GkA-y-qgSzubyuwK9FI"
          className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${
            !loginUrl ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Sign in with Google
        </Link>
        <button
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-blue-700"
          onClick={() => redirectToCognito("Google")}
        >
          Continue with Google
        </button>
        <button
          className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-blue-700"
          onClick={() => redirectToCognito("LinkedIn")}
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
