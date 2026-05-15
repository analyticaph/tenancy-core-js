// Framework-agnostic exports — safe to import in Vue, React, or plain TS

export type { Tenant } from './tenant/types';
export { getCurrentTenant } from './tenant/getCurrentTenant';
export type { TenantInfo } from './tenant/getCurrentTenant';

export { storeToken, getAccessToken, getRefreshToken, clearTokens } from './auth/tokenStorage';
// setupApiInterceptor and refreshAccessToken require axios — import from '@schoolplatform/tenancy-core-js/auth'

export { startOAuthFlow, handleOAuthCallback } from './oauth/redirectFlow';
export type { StartOAuthFlowOptions, OAuthCallbackResult } from './oauth/redirectFlow';

export type { InertiaSharedProps } from './inertia/sharedProps';
export { getSharedProps } from './inertia/sharedProps';
