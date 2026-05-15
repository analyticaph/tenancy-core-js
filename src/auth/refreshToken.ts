import { getRefreshToken, storeToken, clearTokens } from './tokenStorage';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(authServerUrl: string): Promise<string> {
  // Deduplicate concurrent refresh calls
  if (refreshPromise) return refreshPromise;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error('No refresh token available');
  }

  refreshPromise = fetch(`${authServerUrl}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  })
    .then(async (res) => {
      if (!res.ok) {
        clearTokens();
        throw new Error('Token refresh failed');
      }
      const data: TokenResponse = await res.json();
      storeToken(data.access_token, data.refresh_token);
      return data.access_token;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}
