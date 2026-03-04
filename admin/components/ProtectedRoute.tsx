import React, { useEffect, useCallback } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const AUTH_TOKEN_KEY = 'admin_token';

export function getToken(): string | null {
     return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token: string): void {
     localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeToken(): void {
     localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function authHeaders(): Record<string, string> {
     const token = getToken();
     return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Decode JWT payload without library */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
     try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const json = decodeURIComponent(
               atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
          );
          return JSON.parse(json);
     } catch {
          return null;
     }
}

/** Check if token is expired */
function isTokenExpired(token: string): boolean {
     const payload = decodeJwtPayload(token);
     if (!payload || typeof payload.exp !== 'number') return true;
     // 30 second buffer
     return Date.now() >= payload.exp * 1000 - 30000;
}

export default function ProtectedRoute() {
     const token = getToken();
     const navigate = useNavigate();

     const handleUnauthorized = useCallback(() => {
          removeToken();
          navigate('/admin', { replace: true });
     }, [navigate]);

     // Listen for 401 responses globally
     useEffect(() => {
          const originalFetch = window.fetch;
          window.fetch = async (...args) => {
               const response = await originalFetch(...args);
               if (response.status === 401) {
                    handleUnauthorized();
               }
               return response;
          };
          return () => {
               window.fetch = originalFetch;
          };
     }, [handleUnauthorized]);

     // Periodic token expiry check (every 60s)
     useEffect(() => {
          const interval = setInterval(() => {
               const currentToken = getToken();
               if (currentToken && isTokenExpired(currentToken)) {
                    handleUnauthorized();
               }
          }, 60000);
          return () => clearInterval(interval);
     }, [handleUnauthorized]);

     if (!token || isTokenExpired(token)) {
          removeToken();
          return <Navigate to="/admin" replace />;
     }

     return <Outlet />;
}
