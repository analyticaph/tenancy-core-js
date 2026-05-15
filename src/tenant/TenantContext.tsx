import { createContext, useContext, ReactNode } from 'react';
import type { Tenant } from './types';

export type { Tenant };

interface TenantContextValue {
  tenant: Tenant | null;
}

const TenantContext = createContext<TenantContextValue>({ tenant: null });

export function TenantProvider({
  children,
  initialTenant,
}: {
  children: ReactNode;
  initialTenant?: Tenant | null;
}) {
  return (
    <TenantContext.Provider value={{ tenant: initialTenant ?? null }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantContext(): TenantContextValue {
  return useContext(TenantContext);
}
