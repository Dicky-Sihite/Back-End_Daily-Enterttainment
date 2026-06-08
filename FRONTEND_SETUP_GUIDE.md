# 🚀 Setup Frontend Next.js - Step by Step

## 1️⃣ Create Project

```bash
# Navigate ke parent directory backend Anda
cd "c:\Dicky File\Celerates\Backend"

# Create Next.js project
npx create-next-app@latest frontend --typescript --tailwind --app

# Enter frontend directory
cd frontend

# Install additional dependencies
npm install axios zustand react-hook-form zod @hookform/resolvers react-query react-hot-toast @headlessui/react lucide-react
```

---

## 2️⃣ Create Folder Structure

Jalankan perintah ini di root folder `frontend/`:

```powershell
# PowerShell - Copy paste semua ini
$folders = @(
  "src/app/(auth)/login",
  "src/app/(auth)/register",
  "src/app/(dashboard)",
  "src/app/api/auth",
  "src/app/api/content",
  "src/components/auth",
  "src/components/content",
  "src/components/shared",
  "src/components/subscription",
  "src/components/admin",
  "src/hooks",
  "src/lib/api",
  "src/lib/config",
  "src/lib/store",
  "src/lib/types",
  "src/lib/utils",
  "src/lib/styles"
)

foreach ($folder in $folders) {
  New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

Write-Host "✅ Folder structure created successfully!"
```

---

## 3️⃣ Create Core Files

### `src/lib/types/index.ts`
```typescript
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Content {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  contentTypeId: number;
  status: 'draft' | 'published' | 'archived';
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  duration: number;
  features: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}
```

### `src/lib/config/env.ts`
```typescript
export const API_URL = 
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const APP_NAME = 
  process.env.NEXT_PUBLIC_APP_NAME || 'Daily Entertainment';
```

### `src/lib/api/client.ts`
```typescript
import axios from 'axios';
import { API_URL } from '@/lib/config/env';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor - handle 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### `src/lib/api/auth.api.ts`
```typescript
import { apiClient } from './client';
import { User, ApiResponse } from '@/lib/types';

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<AuthResponse>>('/login', { 
      email, 
      password 
    }),

  register: (username: string, email: string, password: string) =>
    apiClient.post<ApiResponse<User>>('/register', { 
      username, 
      email, 
      password 
    }),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout'),
};
```

### `src/lib/api/content.api.ts`
```typescript
import { apiClient } from './client';
import { Content, ApiResponse } from '@/lib/types';

export const contentApi = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<ApiResponse<Content[]>>('/contents', { 
      params: { page, limit } 
    }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Content>>(`/contents/${id}`),

  create: (data: Partial<Content>) =>
    apiClient.post<ApiResponse<Content>>('/contents', data),

  update: (id: number, data: Partial<Content>) =>
    apiClient.put<ApiResponse<Content>>(`/contents/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/contents/${id}`),
};
```

### `src/lib/store/auth.store.ts`
```typescript
import { create } from 'zustand';
import { User } from '@/lib/types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => 
    set({ user, isAuthenticated: !!user }),

  setLoading: (isLoading) => 
    set({ isLoading }),

  logout: () => 
    set({ user: null, isAuthenticated: false }),
}));
```

### `src/hooks/useAuth.ts`
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { authApi, AuthResponse } from '@/lib/api/auth.api';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore();

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { accessToken, user } = response.data.data as AuthResponse;
      
      localStorage.setItem('accessToken', accessToken);
      setUser(user);
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await authApi.register(username, email, password);
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('accessToken');
      logout();
      router.push('/login');
    }
  };

  return { user, isAuthenticated, isLoading, login, register, logout: handleLogout };
}
```

### `src/hooks/useFetch.ts`
```typescript
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

export function useFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!!url);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<T>(url);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, isLoading };
}
```

---

## 4️⃣ Create Pages

### `src/app/layout.tsx`
```typescript
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/config/env';
import './styles/globals.css';

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Daily Entertainment Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### `src/app/(auth)/layout.tsx`
```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
      {children}
    </div>
  );
}
```

### `src/app/(auth)/login/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Daily Entertainment
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### `src/app/(auth)/register/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Account
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### `src/app/(dashboard)/layout.tsx`
```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/shared/Navbar';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 container mx-auto py-6 px-4">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
```

### `src/app/(dashboard)/page.tsx`
```typescript
'use client';

import { useFetch } from '@/hooks/useFetch';
import { ApiResponse, Content } from '@/lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const { data, isLoading, error } = useFetch<ApiResponse<Content[]>>('/contents');

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">Error: {error.message}</div>;

  const contents = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          href="/content/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Content
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map((content) => (
          <Link key={content.id} href={`/content/${content.id}`}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden">
              <img
                src={content.thumbnail}
                alt={content.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">{content.title}</h2>
                <p className="text-gray-600 text-sm truncate">{content.description}</p>
                <p className="text-xs text-gray-400 mt-2">👁️ {content.viewsCount} views</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {contents.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          No content available
        </div>
      )}
    </div>
  );
}
```

---

## 5️⃣ Create Components

### `src/components/shared/Navbar.tsx`
```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { APP_NAME } from '@/lib/config/env';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/bookmarks" className="hover:text-blue-600">
            Bookmarks
          </Link>
          <Link href="/subscriptions" className="hover:text-blue-600">
            Subscriptions
          </Link>
          <Link href="/profile" className="hover:text-blue-600">
            {user?.username}
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
```

### `src/components/shared/ProtectedRoute.tsx`
```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  return isAuthenticated ? <>{children}</> : null;
}
```

---

## 6️⃣ Environment Files

### `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Daily Entertainment
```

### `.env.production`
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_NAME=Daily Entertainment
```

---

## 7️⃣ Run Frontend

```bash
# Development mode
npm run dev

# Visit http://localhost:3000
# Test dengan:
# Email: test@example.com
# Password: password123
```

---

## ✅ Checklist

- [ ] Created Next.js project
- [ ] Installed dependencies
- [ ] Created folder structure
- [ ] Created lib/api files
- [ ] Created hooks (useAuth, useFetch)
- [ ] Created pages (login, register, dashboard)
- [ ] Created components (Navbar, ProtectedRoute)
- [ ] Created .env.local
- [ ] Test login flow
- [ ] Test content display

