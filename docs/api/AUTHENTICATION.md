# Autentifikatsiya

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-19

---

## Maqsad

Aishunos platformasida ikki xil autentifikatsiya tizimi mavjud: Admin autentifikatsiyasi va Cron job autentifikatsiyasi.

---

## Autentifikatsiya Turlari

| Tur | Maqsad | Usul |
|-----|--------|------|
| **Admin Auth** | Admin panel kirish | Session cookie |
| **Cron Auth** | Cron job'lar himoyasi | Bearer token |
| **API Auth** | Public API | Hozircha yo'q (kelajakda JWT) |

---

## 1. Admin Autentifikatsiyasi

### Login Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Admin   │────▶│  Login   │────▶│  Verify  │
│   Form   │     │   API    │     │ Password │
└──────────┘     └──────────┘     └────┬─────┘
                                       │
                                       ▼
                               ┌──────────────┐
                               │ Set Cookie   │
                               │ admin_token  │
                               └──────────────┘
```

### Login Endpoint

```typescript
// POST /api/admin/login
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data?: { message: string };
  error?: string;
}
```

### Implementatsiya

```typescript
// apps/web/src/app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Environment'dan admin credentials
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

    // Username tekshiruvi
    if (username !== ADMIN_USERNAME) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Password tekshiruvi
    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH!);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Session token yaratish
    const token = crypto.randomUUID();
    
    // Cookie o'rnatish
    cookies().set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 soat
      path: '/',
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Login successful' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
```

### Logout Endpoint

```typescript
// POST /api/admin/logout
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  cookies().delete('admin_token');
  
  return NextResponse.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
}
```

### Admin Middleware

```typescript
// apps/web/src/lib/admin/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token');

  if (!token) {
    redirect('/admin/login');
  }

  // Token validation (kelajakda database bilan)
  return true;
}

// Admin page'da ishlatish
// app/admin/page.tsx
export default async function AdminPage() {
  await requireAdmin();
  
  return <AdminDashboard />;
}
```

---

## 2. Cron Job Autentifikatsiyasi

### Bearer Token

Cron job'lar `CRON_SECRET` environment variable orqali himoyalanadi.

### Implementatsiya

```typescript
// apps/web/src/app/api/cron/news/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Authorization header tekshiruvi
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    console.warn('Unauthorized cron access attempt');
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Cron logic...
}
```

### Vercel Cron Integration

Vercel avtomatik ravishda `Authorization` header qo'shadi:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/news",
      "schedule": "*/1 * * * *"
    }
  ]
}
```

---

## 3. Environment Variables

### Required Variables

| Variable | Tavsif | Misol |
|----------|--------|-------|
| `ADMIN_USERNAME` | Admin login | `admin` |
| `ADMIN_PASSWORD_HASH` | Bcrypt hashed password | `$2a$10$...` |
| `CRON_SECRET` | Cron authorization | `random_secret_123` |

### Password Hash Yaratish

```bash
# Node.js REPL'da
node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"

# Yoki script orqali
npx ts-node -e "
import bcrypt from 'bcryptjs';
console.log(bcrypt.hashSync('your_secure_password', 10));
"
```

### `.env` Example

```env
# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$K8F8H7rQ9YvZ1X2W3E4R5u...

# Cron
CRON_SECRET=your_very_secure_random_string_here
```

---

## 4. Security Best Practices

### ✅ Tavsiya Qilinadi

```typescript
// HTTP-only cookies
cookies().set('token', value, {
  httpOnly: true,      // JavaScript access yo'q
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF himoya
});

// Rate limiting
const rateLimiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 5, // 5 ta urinish
});

// Password hashing
const hash = await bcrypt.hash(password, 10);
```

### ❌ Qilmang

```typescript
// Parolni ochiq saqlash
const password = 'admin123'; // XATO!

// Cookie'da sensitive data
cookies().set('user', JSON.stringify({ password: '...' })); // XATO!

// Hardcoded secrets
const secret = 'my_secret_key'; // XATO!
```

---

## 5. Kelajak Rejasi

### JWT Implementation (V2)

```typescript
// Kelajakda
interface JWTPayload {
  userId: string;
  role: 'admin' | 'user';
  exp: number;
}

// Token yaratish
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '24h',
});

// Token tekshirish
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### OAuth Integration (V3)

- Google OAuth
- GitHub OAuth
- Telegram OAuth

---

## Bog'liq Hujjatlar

- [API Overview](./README.md) - API umumiy
- [Cron Jobs](./CRON_JOBS.md) - Cron autentifikatsiyasi
- [Deployment](../guidelines/DEPLOYMENT.md) - Environment setup

