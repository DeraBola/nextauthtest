// Generate random state
// export function generateState(length = 16) {
//   return crypto.getRandomValues(new Uint8Array(length))
//     .reduce((s, b) => s + b.toString(16).padStart(2, '0'), '');
// }

// Generate random code verifier
// export function generateCodeVerifier(length = 64) {
//   const array = new Uint8Array(length);
//   crypto.getRandomValues(array);
//   return Array.from(array).map(b => ('00'+b.toString(16)).slice(-2)).join('');
// }

// Generate code challenge from verifier (SHA256 + Base64Url)
// export async function generateCodeChallenge(codeVerifier: string | undefined) {
//   const hashBuffer = await crypto.subtle.digest(
//     "SHA-256",
//     new TextEncoder().encode(codeVerifier)
//   );
//   const base64Url = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_')
//     .replace(/=+$/, '');
//   return base64Url;
// }

function urlSafeBase64(bytes: Uint8Array) {
  const bin = String.fromCharCode(...bytes);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function generateState(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return urlSafeBase64(arr);
}

export function generateCodeVerifier(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return urlSafeBase64(arr);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return urlSafeBase64(new Uint8Array(digest));
}

