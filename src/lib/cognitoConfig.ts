export const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_WrIckx15X", // your pool ID endpoint
  client_id: "7i1ep58u5qm8vpt3914608vm6f", // your Cognito app client ID
  redirect_uri: "http://localhost:3000", // must match Cognito app client settings
  post_logout_redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "openid profile email phone",
};
