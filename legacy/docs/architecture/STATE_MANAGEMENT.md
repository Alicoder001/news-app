# Holat Boshqaruvi (State Management)

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-19

---

## Maqsad

Aishunos platformasida turli xil state management strategiyalari qo'llaniladi. Ushbu hujjat har bir yondashuv va qachon ishlatilishini tavsiflaydi.

---

## State Turlari

| Tur | Tavsif | Texnologiya |
|-----|--------|-------------|
| **Server State** | API'dan keladigan ma'lumotlar | TanStack Query |
| **Client State** | UI holati (modal, theme) | Zustand, React state |
| **URL State** | Router parametrlari | Next.js router |
| **Form State** | Forma qiymatlari | React Hook Form |

---

## 1. Server State (TanStack Query)

### Qachon Ishlatiladi

- API'dan ma'lumot olish
- Caching
- Background refetching
- Infinite scroll pagination

### Misol: Maqolalar Ro'yxati

```typescript
// apps/mobile/src/hooks/useQueries.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export function useArticles(categorySlug?: string) {
  return useInfiniteQuery({
    queryKey: ['articles', categorySlug],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getArticles({
        page: pageParam,
        limit: 10,
        category: categorySlug,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined,
    staleTime: 5 * 60 * 1000, // 5 daqiqa cache
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => apiClient.getArticle(slug),
    staleTime: 10 * 60 * 1000, // 10 daqiqa cache
  });
}
```

### Query Keys Strategiyasi

| Key Pattern | Misol | Vazifasi |
|-------------|-------|----------|
| `['articles']` | Barcha maqolalar | Base key |
| `['articles', category]` | Kategoriya bo'yicha | Filtered |
| `['article', slug]` | Bitta maqola | Detail |
| `['categories']` | Kategoriyalar | Static |

### Cache Invalidation

```typescript
// Yangi maqola qo'shilganda
queryClient.invalidateQueries({ queryKey: ['articles'] });

// Bitta maqola yangilanganda
queryClient.invalidateQueries({ queryKey: ['article', slug] });
```

---

## 2. Client State (Zustand)

### Qachon Ishlatiladi

- Theme (dark/light)
- Saqlangan maqolalar
- Foydalanuvchi sozlamalari
- UI holati (sidebar, modal)

### Store Strukturasi

```typescript
// apps/mobile/src/store/useAppStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  // Theme
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  
  // Saved articles
  savedArticles: string[];
  saveArticle: (slug: string) => void;
  unsaveArticle: (slug: string) => void;
  isArticleSaved: (slug: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: false,
      setDarkMode: (value) => set({ isDarkMode: value }),
      
      // Saved articles
      savedArticles: [],
      saveArticle: (slug) =>
        set((state) => ({
          savedArticles: [...state.savedArticles, slug],
        })),
      unsaveArticle: (slug) =>
        set((state) => ({
          savedArticles: state.savedArticles.filter((s) => s !== slug),
        })),
      isArticleSaved: (slug) => get().savedArticles.includes(slug),
    }),
    {
      name: 'aishunos-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Ishlatish

```typescript
// Komponentda
function ArticleCard({ slug }: { slug: string }) {
  const { isArticleSaved, saveArticle, unsaveArticle } = useAppStore();
  
  const saved = isArticleSaved(slug);
  
  const handleToggle = () => {
    if (saved) {
      unsaveArticle(slug);
    } else {
      saveArticle(slug);
    }
  };
  
  return (
    <Button onPress={handleToggle}>
      {saved ? 'Saqlangan' : 'Saqlash'}
    </Button>
  );
}
```

---

## 3. URL State (Next.js Router)

### Qachon Ishlatiladi

- Pagination
- Filters
- Search queries
- Locale

### Misol: Kategoriya Filter

```typescript
// URL: /articles?category=ai&page=2

// Server Component
export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const category = searchParams.category;
  const page = parseInt(searchParams.page || '1');
  
  const articles = await getArticles({ category, page });
  
  return <ArticleList articles={articles} />;
}
```

### Misol: Locale

```typescript
// URL: /ru/articles (Russian)
// URL: /articles (O'zbek - default)

// Layout'da
export default function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <NextIntlClientProvider locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
```

---

## 4. Form State (React Hook Form)

### Qachon Ishlatiladi

- Admin panel formalari
- Search input
- Settings forms

### Misol: Admin Login

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username talab qilinadi'),
  password: z.string().min(6, 'Kamida 6 belgi'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginForm) => {
    await loginAdmin(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      {errors.username && <span>{errors.username.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        Kirish
      </button>
    </form>
  );
}
```

---

## State Management Qaror Daraxti

```
Ma'lumot kerakmi?
│
├─▶ API'dan keladi? ──────▶ TanStack Query
│
├─▶ URL'da bo'lishi kerak? ▶ URL State (searchParams)
│
├─▶ Forma ma'lumoti? ─────▶ React Hook Form
│
└─▶ Local UI state? ──────┬▶ Oddiy? ──▶ React useState
                          │
                          └▶ Global? ─▶ Zustand
```

---

## Best Practices

### ✅ To'g'ri

```typescript
// Server state uchun TanStack Query
const { data, isLoading } = useArticles();

// Persist qilinadigan client state uchun Zustand
const savedArticles = useAppStore((s) => s.savedArticles);

// URL state uchun router
const searchParams = useSearchParams();
```

### ❌ Noto'g'ri

```typescript
// API data'ni Zustand'da saqlash - XATO!
const articles = useAppStore((s) => s.articles);

// URL state'ni Zustand'da saqlash - XATO!
const currentPage = useAppStore((s) => s.page);
```

---

## Bog'liq Hujjatlar

- [API Endpoints](../api/ENDPOINTS.md) - Server state manbasi
- [Mobile App](../platforms/MOBILE_APP.md) - Zustand ishlatilishi
- [Web App](../platforms/WEB_APP.md) - Server Components

