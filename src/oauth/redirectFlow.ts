import { getCurrentTenant } from '../tenant/getCurrentTenant';
import { storeToken } from '../auth/tokenStorage';

declare const __AUTH_SERVER_URL__: string;
declare const __OAUTH_CLIENT_ID__: string;

function getAuthUrl(): string {
  return typeof __AUTH_SERVER_URL__ !== 'undefined'
    ? __AUTH_SERVER_URL__
    : (window as Window & { _authServerUrl?: string })._authServerUrl ?? '';
}

function getClientId(): string {
  return typeof __OAUTH_CLIENT_ID__ !== 'undefined'
    ? __OAUTH_CLIENT_ID__
    : (window as Window & { _oauthClientId?: string })._oauthClientId ?? '';
}

export interface StartOAuthFlowOptions {
  app: string;
  redirectUri?: string;
  scopes?: string[];
}

export function startOAuthFlow({ app, redirectUri, scopes }: StartOAuthFlowOptions): void {
  const tenant = getCurrentTenant();
  const state = crypto.randomUUID();
  sessionStorage.setItem('oauth_state', state);

  const callbackUri = redirectUri ?? `${window.location.origin}/callback`;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: getClientId(),
    redirect_uri: callbackUri,
    state,
    app,
    ...(tenant ? { tenant: tenant.subdomain } : {}),
    ...(scopes ? { scope: scopes.join(' ') } : {}),
  });

  window.location.href = `${getAuthUrl()}/oauth/authorize?${params}`;
}

export interface OAuthCallbackResult {
  accessToken: string;
  refreshToken?: string;
}

export async function handleOAuthCallback(): Promise<OAuthCallbackResult> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const storedState = sessionStorage.getItem('oauth_state');

  if (!code) throw new Error('No authorization code in callback URL');
  if (state !== storedState) throw new Error('OAuth state mismatch — possible CSRF');

  sessionStorage.removeItem('oauth_state');

  const res = await fetch(`${getAuthUrl()}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: window.location.origin + '/callback',
      client_id: getClientId(),
    }),
  });

  if (!res.ok) throw new Error('Token exchange failed');

  const data = await res.json();
  storeToken(data.access_token, data.refresh_token);

  return { accessToken: data.access_token, refreshToken: data.refresh_token };
}
