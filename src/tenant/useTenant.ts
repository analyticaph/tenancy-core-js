import { useTenantContext } from './TenantContext';
import type { Tenant } from './types';

export function useTenant(): Tenant {
  const { tenant } = useTenantContext();
  if (!tenant) throw new Error('useTenant must be used inside TenantProvider with a valid tenant');
  return tenant;
}

export function useTenantOrNull(): Tenant | null {
  return useTenantContext().tenant;
}
