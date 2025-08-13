"use client";

import { cognitoAuthConfig } from "@/lib/CognitoConfig";
import { AuthProvider } from "react-oidc-context";

import { ReactNode } from "react";

export default function AuthProviderWrapper({ children }: { readonly children: ReactNode }) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
