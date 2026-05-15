export interface Tenant {
  id: number;
  name: string;
  subdomain: string;
  settings?: Record<string, unknown>;
}
