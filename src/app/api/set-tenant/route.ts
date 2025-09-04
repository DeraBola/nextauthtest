import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import jwt from "jsonwebtoken";
import { fromEnv } from "@aws-sdk/credential-providers";

console.log("ALL ENV:", process.env);

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.split(" ")[1];

    console.log("apiToken: ", token);

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    // ⚠️ For production, verify JWT properly with Cognito JWKS
    const decoded: any = jwt.decode(token);
    console.log("decoded: ", decoded);

    // Use Cognito’s internal username, not sub
    const cognitoUsername = decoded["cognito:username"];
    console.log("cognitoUsername: ", cognitoUsername);

    const { tenant } = await req.json();

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: process.env.USER_POOL_ID!,
      Username: cognitoUsername,
      UserAttributes: [{ Name: "custom:tenant_id", Value: tenant }],
    });

    await client.send(command);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update tenant" },
      { status: 500 }
    );
  }
}
