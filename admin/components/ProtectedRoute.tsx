import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

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

export default function ProtectedRoute() {
     const token = getToken();
     if (!token) {
          return <Navigate to="/admin" replace />;
     }
     return <Outlet />;
}
