# 🎨 Frontend Next.js - Struktur Rekomendasi

## 📁 Folder Structure yang Optimal

```
frontend/
├── public/
│   ├── images/
│   ├── icons/
│   └── videos/
│
├── src/
│   ├── app/                          # Next.js 13+ App Directory
│   │   ├── (auth)/                   # Auth pages grup
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/              # Protected pages grup
│   │   │   ├── layout.tsx            # With navbar, sidebar
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── content/
│   │   │   │   ├── page.tsx          # Content list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx      # Content detail
│   │   │   │   └── create/
│   │   │   │       └── page.tsx      # Create content
│   │   │   ├── bookmarks/
│   │   │   │   └── page.tsx
│   │   │   ├── subscriptions/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── admin/                # Admin pages
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       ├── users/page.tsx
│   │   │       └── content/page.tsx
│   │   │
│   │   ├── api/                      # API Routes (Backend for Frontend)
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── refresh/route.ts
│   │   │   ├── content/route.ts
│   │   │   ├── user/route.ts
│   │   │   └── upload/route.ts       # File upload
│   │   │
│   │   ├── error.tsx                 # Global error boundary
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   └── layout.tsx                # Root layout
│   │
│   ├── components/                   # Reusable Components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── LogoutButton.tsx
│   │   │
│   │   ├── content/
│   │   │   ├── ContentCard.tsx
│   │   │   ├── ContentGrid.tsx
│   │   │   ├── ContentDetail.tsx
│   │   │   ├── ContentForm.tsx
│   │   │   └── ContentFilter.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Pagination.tsx
│   │   │
│   │   ├── subscription/
│   │   │   ├── PlanCard.tsx
│   │   │   ├── SubscriptionStatus.tsx
│   │   │   └── PaymentForm.tsx
│   │   │
│   │   └── admin/
│   │       ├── UserManagement.tsx
│   │       ├── ContentManagement.tsx
│   │       ├── AnalyticsDashboard.tsx
│   │       └── RoleManagement.tsx
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useFetch.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useContent.ts
│   │   ├── useSubscription.ts
│   │   └── useUser.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts             # API client instance
│   │   │   ├── auth.api.ts           # Auth API calls
│   │   │   ├── content.api.ts        # Content API calls
│   │   │   ├── user.api.ts           # User API calls
│   │   │   └── subscription.api.ts   # Subscription API calls
│   │   │
│   │   ├── store/                    # State management (Zustand)
│   │   │   ├── auth.store.ts
│   │   │   ├── content.store.ts
│   │   │   ├── ui.store.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── auth.ts
│   │   │   ├── content.ts
│   │   │   ├── user.ts
│   │   │   └── api.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts                 # Class name merger
│   │   │   ├── format.ts             # Format utilities
│   │   │   ├── validation.ts         # Validation helpers
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   │
│   │   ├── config/
│   │   │   ├── env.ts                # Environment variables
│   │   │   ├── api.config.ts
│   │   │   └── routes.ts             # Route constants
│   │   │
│   │   └── styles/
│   │       ├── globals.css
│   │       ├── variables.css
│   │       └── utilities.css
│   │
│   ├── middleware.ts                 # Next.js middleware (auth checks)
│   └── (next-auth)/                 # If using NextAuth.js
│
├── .env.example
├── .env.local
├── .env.production
├── .gitignore
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔄 Alur Data Frontend

```
┌─────────────────────────────────────────────┐
│        USER INTERACTION (UI)                │
└────────────────────┬────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │  React Components       │
        │  ├── useState/useEffect │
        │  ├── Form handlers      │
        │  └── Event listeners    │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  Custom Hooks           │
        │  ├── useAuth            │
        │  ├── useFetch           │
        │  └── useApi             │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  API Client             │
        │  └── HTTP Requests      │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  Express Backend        │
        │  (Port 5000)            │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  PostgreSQL Database    │
        └─────────────────────────┘
```

---

## 📦 Package.json Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    
    "axios": "^1.6.0",          // HTTP client
    "zustand": "^4.4.0",        // State management
    "clsx": "^2.0.0",           // Class name merger
    "dayjs": "^1.11.0",         // Date formatter
    
    "tailwindcss": "^3.3.0",    // CSS framework
    "@headlessui/react": "^1.7.0",  // Headless components
    "lucide-react": "^0.263.0", // Icons library
    
    "react-hook-form": "^7.48.0", // Form management
    "zod": "^3.22.0",           // Validation
    "@hookform/resolvers": "^3.3.0",
    
    "react-query": "^3.39.3",   // Or use @tanstack/react-query
    "react-hot-toast": "^2.4.0" // Toast notifications
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.50.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

---

## 🎯 Key Files Examples

### lib/config/env.ts
```typescript
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Daily Entertainment';
export const NODE_ENV = process.env.NODE_ENV || 'development';
```

### lib/types/index.ts
```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  profile?: {
    fullName: string;
    bio?: string;
    avatar?: string;
  };
  roles: string[];
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
  createdAt: string;
}

export interface Subscription {
  id: number;
  userId: number;
  planId: number;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}
```

### lib/api/client.ts
```typescript
import axios, { AxiosError } from 'axios';
import { API_URL } from '@/lib/config/env';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add access token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### lib/api/auth.api.ts
```typescript
import { apiClient } from './client';
import { User, ApiResponse } from '@/lib/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export const authApi = {
  login: (data: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/login', data),

  register: (data: RegisterPayload) =>
    apiClient.post<ApiResponse<User>>('/register', data),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout'),

  refresh: () =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh'),
};
```

### lib/api/content.api.ts
```typescript
import { apiClient } from './client';
import { Content, ApiResponse } from '@/lib/types';

export interface ContentFilters {
  page?: number;
  limit?: number;
  status?: string;
  contentTypeId?: number;
}

export interface CreateContentPayload {
  title: string;
  description: string;
  thumbnail: string;
  contentTypeId: number;
}

export const contentApi = {
  getAll: (filters?: ContentFilters) =>
    apiClient.get<ApiResponse<Content[]>>('/contents', { params: filters }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Content>>(`/contents/${id}`),

  create: (data: CreateContentPayload) =>
    apiClient.post<ApiResponse<Content>>('/contents', data),

  update: (id: number, data: Partial<CreateContentPayload>) =>
    apiClient.put<ApiResponse<Content>>(`/contents/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/contents/${id}`),

  search: (query: string) =>
    apiClient.get<ApiResponse<Content[]>>('/contents/search', { params: { q: query } }),
};
```

### lib/store/auth.store.ts (Zustand)
```typescript
import { create } from 'zustand';
import { User } from '@/lib/types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
  }),

  setIsLoading: (isLoading) => set({ isLoading }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
  }),
}));
```

### hooks/useAuth.ts
```typescript
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth.store';
import { authApi } from '@/lib/api/auth.api';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setIsLoading, logout } = useAuthStore();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Optionally validate token with backend
          // For now, just set loading to false
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('accessToken', response.data.data.accessToken);
      setUser(response.data.data.user);
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await authApi.register({ username, email, password });
      // Auto-login after registration
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

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: handleLogout,
  };
}
```

### hooks/useFetch.ts
```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

export function useFetch<T>(url: string, options?: any) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<T>(url, options);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
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

## 📄 Page Examples

### app/(auth)/login/page.tsx
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### app/(dashboard)/page.tsx
```typescript
'use client';

import { useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { Content, ApiResponse } from '@/lib/types';
import ContentGrid from '@/components/content/ContentGrid';

export default function DashboardPage() {
  const { data, isLoading, error } = useFetch<ApiResponse<Content[]>>('/contents');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <ContentGrid contents={data?.data || []} />
    </div>
  );
}
```

### app/(dashboard)/content/[id]/page.tsx
```typescript
'use client';

import { useFetch } from '@/hooks/useFetch';
import { Content, ApiResponse } from '@/lib/types';
import { useParams } from 'next/navigation';

export default function ContentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, error } = useFetch<ApiResponse<Content>>(
    id ? `/contents/${id}` : null
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.data) return <div>Content not found</div>;

  const content = data.data;

  return (
    <div className="max-w-4xl mx-auto">
      <img src={content.thumbnail} alt={content.title} className="w-full h-96 object-cover rounded" />
      <h1 className="text-4xl font-bold mt-6">{content.title}</h1>
      <p className="text-gray-600 mt-2">{content.description}</p>
      <p className="text-sm text-gray-400 mt-4">Views: {content.viewsCount}</p>
    </div>
  );
}
```

---

## 🛡️ ProtectedRoute Component

### components/shared/ProtectedRoute.tsx
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

  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <>{children}</> : null;
}
```

---

## ⚙️ Configuration Files

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  },
};

module.exports = nextConfig;
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
      },
    },
  },
  plugins: [],
};
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Daily Entertainment
```

### .env.production
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_NAME=Daily Entertainment
```

---

## 🚀 Setup Commands

```bash
# Create project
npx create-next-app@latest frontend --typescript --tailwind

# Install dependencies
npm install axios zustand react-hook-form zod @hookform/resolvers react-query react-hot-toast @headlessui/react lucide-react

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📊 Integration dengan Backend

### Data Flow
```
User clicks button
  ↓
Component calls useAuth() atau useFetch()
  ↓
Hook calls API Client (axios)
  ↓
apiClient.post/get/put/delete()
  ↓
Request dikirim ke Express backend
  ↓
Backend validasi & proses
  ↓
Response kembali
  ↓
Hook update state (zustand)
  ↓
Component re-render dengan data baru
  ↓
UI update
```

---

## ✅ Features per Page

| Page | Fitur |
|------|-------|
| `/login` | Form login, validasi, error handling |
| `/register` | Form register, password validation |
| `/` | Dashboard home, content grid |
| `/content` | List semua content, filter, search |
| `/content/:id` | Detail content, related content |
| `/bookmarks` | User bookmarks, bookmark management |
| `/subscriptions` | List plans, subscription status |
| `/profile` | User profile, edit profile |
| `/admin` | (Admin only) User management, content management |

