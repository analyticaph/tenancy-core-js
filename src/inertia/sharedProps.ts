import type { Tenant } from '../tenant/types';

export interface InertiaSharedProps {
  tenant: Tenant | null;
  app: string | null;
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    } | null;
  };
  flash: {
    success?: string;
    error?: string;
  };
}

export function getSharedProps<T extends InertiaSharedProps>(page: { props: T }): T {
  return page.props;
}
