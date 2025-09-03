"use client";

import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import type { Session as NextAuthSession } from "@auth/core/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Session = NextAuthSession & {
  user?: {
    name?: string | null; // must allow null
    image?: string | null;
  };
};

export default function CognitoComponent() {
  const auth = useAuth();
  const router = useRouter();

  console.log("authCognito: ", auth);

  console.log("Region:", process.env.AWS_REGION);
  console.log("Key ID:", process.env.AWS_ACCESS_KEY_ID?.slice(0, 4)); // mask

  // 🔹 Protect this page: redirect to /login if not authenticated
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      const tenant = window.location.hostname.split(".")[0]; // xyz
      console.log("tenant: ", tenant);
      // Call your API to set the tenant for the user
      fetch("/api/set-tenant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.id_token}`, // pass ID token
        },
        body: JSON.stringify({ tenant }),
      });
    }
  }, [auth.isAuthenticated]);

  const signOutRedirect = async () => {
    const clientId = "7i1ep58u5qm8vpt3914608vm6f";
    const logoutUri = "http://localhost:3000/login"; // must be allowed in Cognito
    const cognitoDomain =
      "https://eu-north-1b2yu5nnac.auth.eu-north-1.amazoncognito.com";

    // 1. Clear local session
    await auth.removeUser();

    // 2. Redirect to Cognito logout
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
      <div className="flex w-full justify-center items-center flex-col gap-4 border-2 border-blue-800">
        <pre>Hello: {auth.user?.profile.name}</pre>
        <Image
          src={auth.user?.profile?.picture || "/default-avatar.png"}
          alt={auth.user?.profile?.picture || "User Avatar"}
          width={100}
          height={72}
          className="rounded-full mb-4"
        />
        <div className="flex w-full flex-col gap-2 items-center justify-center p-4">
          <p className="break-all whitespace-pre-wrap">
            <span className="font-bold">ID Token: </span>
            {auth.user?.id_token}
          </p>
          <p className="break-all whitespace-pre-wrap">
            <span className="font-bold"> Access Token: </span>
            {auth.user?.access_token}
          </p>
          <p className="break-all whitespace-pre-wrap">
            <span className="font-bold">Refresh Token: </span>
            {auth.user?.refresh_token}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start m-4">
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

      <div className="flex border-2 border-red-800 w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="account">
          <TabsList className="overflow-x-auto">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you&apos;re
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-name">Name</Label>
                  <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-username">Username</Label>
                  <Input id="tabs-demo-username" defaultValue="@peduarte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you&apos;ll be logged
                  out.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-current">Current password</Label>
                  <Input id="tabs-demo-current" type="password" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-new">New password</Label>
                  <Input id="tabs-demo-new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
