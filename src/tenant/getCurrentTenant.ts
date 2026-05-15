export interface TenantInfo {
  subdomain: string;
  domain: string;
}

export function getCurrentTenant(): TenantInfo | null {
  if (typeof window === 'undefined') return null;

  const host = window.location.hostname;
  const parts = host.split('.');

  // Expect: [subdomain, ...baseDomain] e.g. schoola.schoolplatform.com
  if (parts.length < 3) return null;

  return {
    subdomain: parts[0],
    domain: host,
  };
}
