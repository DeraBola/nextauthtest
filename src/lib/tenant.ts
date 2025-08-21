// utils/tenant.ts
export function getTenantFromDomain(hostname: string): string {
  // Example: tenant1.myapp.com → tenant1
  //          tenant2.myapp.com → tenant2
  const parts = hostname.split(".");

  // If using subdomains → take the first part
  if (parts.length > 2) {
    return parts[0]; // tenant1, tenant2, etc.
  }

  // If using custom domains (tenant1.com, tenant2.com)
  // you may need a mapping table:
  const domainMap: Record<string, string> = {
    "tenant1.com": "tenant1",
    "tenant2.com": "tenant2",
  };

  return domainMap[hostname] || "default";
}
