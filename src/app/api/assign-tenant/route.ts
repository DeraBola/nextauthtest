import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import { NextRequest } from "next/server";

// Initialize client
const credentials: AwsCredentialIdentity = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ""
};

const client = new CognitoIdentityProviderClient({
  region: "eu-north-1",
  credentials: credentials
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log("body: ", body);

    const { username, tenant } = body;

    if (!username || !tenant) {
      return new Response(
        JSON.stringify({ error: "username and tenant required" }),
        { status: 400 }
      );
    }

    // 1. Add custom:tenant_id attribute
    await client.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
        UserAttributes: [{ Name: "custom:tenant_id", Value: tenant }],
      })
    );

    // 2. Add user to group
    await client.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
        GroupName: "TenantOne", // ensure group exists
      })
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error assigning tenant:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to assign tenant",
        details: typeof error === "object" && error !== null && "message" in error ? (error as { message?: string }).message : String(error)
      }),
      { status: 500 }
    );
  }
}
