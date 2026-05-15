import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getAccessToken } from './tokenStorage';
import { refreshAccessToken } from './refreshToken';

declare const __AUTH_SERVER_URL__: string;

export function setupApiInterceptor(axios: AxiosInstance): void {
  const authUrl = typeof __AUTH_SERVER_URL__ !== 'undefined'
    ? __AUTH_SERVER_URL__
    : (window as Window & { _authServerUrl?: string })._authServerUrl ?? '';

  axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        const newToken = await refreshAccessToken(authUrl);
        original.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(original);
      }

      return Promise.reject(error);
    },
  );
}
