// React-specific exports — only import this in React apps

export { TenantProvider, useTenantContext } from './tenant/TenantContext';
export type { Tenant } from './tenant/types';
export { useTenant, useTenantOrNull } from './tenant/useTenant';
