# 📦 Full Project Setup - Frontend + Backend

## 📁 Project Structure (Setelah Setup)

```
c:\Dicky File\Celerates\Backend\
├── BackEnd/                         # Your existing Express backend
│   ├── src/
│   ├── database/
│   ├── package.json
│   ├── server.js
│   ├── .env
│   └── ...
│
└── frontend/                        # NEW: Next.js Frontend
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── hooks/
    │   ├── lib/
    │   └── ...
    ├── public/
    ├── package.json
    ├── next.config.js
    ├── tsconfig.json
    └── .env.local
```

---

## 🚀 Step 1: Setup Backend (Existing)

Pastikan backend sudah berjalan:

```bash
cd "c:\Dicky File\Celerates\Backend\BackEnd"

# Install dependencies (jika belum)
npm install

# Start backend
npm run dev
# Server akan berjalan di http://localhost:5000
```

**Pastikan:**
- ✅ Backend running di port 5000
- ✅ Database PostgreSQL connected
- ✅ API endpoints responsif

---

## 🎨 Step 2: Setup Frontend

### 2.1 Create Next.js Project

```bash
# Go to parent directory
cd "c:\Dicky File\Celerates\Backend"

# Create Next.js project
npx create-next-app@latest frontend --typescript --tailwind --app

# Answer prompts:
# ✅ ESLint: Yes
# ✅ Tailwind CSS: Yes
# ✅ App Router: Yes
# ✅ Src directory: Yes
```

### 2.2 Install Dependencies

```bash
cd frontend

npm install \
  axios \
  zustand \
  react-hook-form \
  zod \
  @hookform/resolvers \
  react-query \
  react-hot-toast \
  @headlessui/react \
  lucide-react
```

**Atau copy file ini:**

**`frontend/package.json`** (dependencies section)
```json
{
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.1",
    "zustand": "^4.4.1",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "react-query": "^3.39.3",
    "react-hot-toast": "^2.4.1",
    "@headlessui/react": "^1.7.17",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.9.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

### 2.3 Environment Setup

**`frontend/.env.local`**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Daily Entertainment

# Node Environment
NODE_ENV=development
```

**`frontend/.env.production`**
```env
# API Configuration (update dengan domain Anda)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_NAME=Daily Entertainment

# Node Environment
NODE_ENV=production
```

### 2.4 Create tsconfig.json

**`frontend/tsconfig.json`**
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

---

## 📂 Step 3: Create Folder Structure

Jalankan di `frontend/` directory:

### PowerShell Script

```powershell
# Create all folders at once
$folders = @(
    "src/app/(auth)/login",
    "src/app/(auth)/register",
    "src/app/(dashboard)",
    "src/app/(dashboard)/content",
    "src/app/(dashboard)/bookmarks",
    "src/app/(dashboard)/subscriptions",
    "src/app/(dashboard)/profile",
    "src/app/api/auth",
    "src/app/api/content",
    "src/components/auth",
    "src/components/content",
    "src/components/shared",
    "src/components/subscription",
    "src/hooks",
    "src/lib/api",
    "src/lib/config",
    "src/lib/store",
    "src/lib/types",
    "src/lib/utils",
    "src/lib/styles",
    "public/images",
    "public/icons"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

Write-Host "✅ All folders created successfully!"
```

---

## 💻 Step 4: Copy Files

### Core Library Files

Create these files in `frontend/src/lib/`:

**`lib/types/index.ts`**
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

**`lib/config/env.ts`**
```typescript
export const API_URL = 
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const APP_NAME = 
  process.env.NEXT_PUBLIC_APP_NAME || 'Daily Entertainment';
```

**`lib/api/client.ts`**
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

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

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

**`lib/store/auth.store.ts`**
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
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### Hooks

**`hooks/useAuth.ts`**
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { apiClient } from '@/lib/api/client';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      const { accessToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(user);
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await apiClient.post('/register', { username, email, password });
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      logout();
      router.push('/login');
    }
  };

  return { user, isAuthenticated, isLoading, login, register, logout: handleLogout };
}
```

**`hooks/useFetch.ts`**
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, isLoading };
}
```

### Components

**`components/shared/Navbar.tsx`**
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
          <Link href="/profile">{user?.username}</Link>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
```

**`components/shared/ProtectedRoute.tsx`**
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

### Pages

**`app/layout.tsx`**
```typescript
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/config/env';
import './styles/globals.css';

export const metadata: Metadata = {
  title: APP_NAME,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**`app/(auth)/layout.tsx`**
```typescript
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
      {children}
    </div>
  );
}
```

**`app/(auth)/login/page.tsx`**
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        <h1 className="text-3xl font-bold text-center mb-8">Daily Entertainment</h1>
        {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
```

**`app/(dashboard)/layout.tsx`**
```typescript
'use client';

import Navbar from '@/components/shared/Navbar';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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

**`app/(dashboard)/page.tsx`**
```typescript
'use client';

import { useFetch } from '@/hooks/useFetch';
import { ApiResponse, Content } from '@/lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const { data, isLoading } = useFetch<ApiResponse<Content[]>>('/contents');

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  const contents = data?.data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contents.map((content) => (
          <Link key={content.id} href={`/content/${content.id}`}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer">
              <img src={content.thumbnail} alt={content.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="font-semibold truncate">{content.title}</h2>
                <p className="text-sm text-gray-600 truncate">{content.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

## ▶️ Step 5: Run Both Frontend & Backend

### Terminal 1 - Backend

```bash
cd "c:\Dicky File\Celerates\Backend\BackEnd"
npm run dev
# Server running on http://localhost:5000
```

### Terminal 2 - Frontend

```bash
cd "c:\Dicky File\Celerates\Backend\frontend"
npm run dev
# Frontend running on http://localhost:3000
```

---

## 🧪 Step 6: Test Everything

### Test Data untuk Login

Buat user terlebih dahulu atau gunakan yang sudah ada:

```
Email: test@example.com
Password: password123
```

### Test Flow

1. ✅ Buka `http://localhost:3000`
2. ✅ Klik "Register" (jika belum ada akun)
3. ✅ Input username, email, password
4. ✅ Klik "Register"
5. ✅ Anda akan otomatis login dan redirect ke dashboard
6. ✅ Lihat list content dari database
7. ✅ Klik content untuk detail
8. ✅ Klik "Logout"
9. ✅ Anda akan redirect ke login page

---

## 📊 Folder Structure Akhir

```
Daily Entertainment/
├── BackEnd/
│   ├── src/
│   ├── database/
│   ├── package.json
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   ├── (dashboard)/
    │   │   ├── api/
    │   │   └── layout.tsx
    │   ├── components/
    │   ├── hooks/
    │   ├── lib/
    │   │   ├── api/
    │   │   ├── config/
    │   │   ├── store/
    │   │   ├── types/
    │   │   └── utils/
    │   └── middleware.ts
    ├── public/
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    └── .env.local
```

---

## ✅ Checklist Final

- [ ] Backend running di port 5000
- [ ] Database PostgreSQL connected
- [ ] Frontend created dengan Next.js
- [ ] All dependencies installed
- [ ] All folders created
- [ ] Core files created (types, api, store, hooks)
- [ ] Pages created (login, register, dashboard)
- [ ] Components created (Navbar, ProtectedRoute)
- [ ] .env files configured
- [ ] Frontend running di port 3000
- [ ] Login test successful
- [ ] Content display working
- [ ] Logout working

---

## 🔗 Navigation Map

```
http://localhost:3000/
├── /login           (public)
├── /register        (public)
└── /                (protected)
    ├── /content     (dashboard)
    ├── /bookmarks
    ├── /subscriptions
    └── /profile
```

---

## 🚨 Troubleshooting

### Frontend tidak bisa connect ke backend
```bash
# Check backend running
# http://localhost:5000/api/v1/contents

# Check NEXT_PUBLIC_API_URL di .env.local
# Harus: http://localhost:5000/api/v1
```

### CORS Error
```
Pastikan backend CORS configuration:
- Allow origin: http://localhost:3000
- Allow credentials: true
```

### 401 Unauthorized
```
Check:
- Token disimpan di localStorage?
- Authorization header dikirim?
- Backend JWT_SECRET cocok?
```

### Port 3000 atau 5000 sudah digunakan
```bash
# Kill process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Atau ganti port di .env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

