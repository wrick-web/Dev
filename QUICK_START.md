# BuildDevLog - Quick Start Card

**Copy & paste these commands to get started:**

## Installation (1 minute)
```bash
npm install
npm run prisma:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) ✨

---

## Architecture at a Glance

### Database (Prisma)
- **Entry** (title, body, tags, date, projectId)
- **Project** (name, description, techStack, status, URLs)
- **Resource** (url, title, category, notes, isRead, isFavorite)

### API Routes
```
/api/entries        → GET (list), POST (create)
/api/entries/[id]   → GET, PUT, DELETE
/api/projects       → GET (list), POST (create)
/api/projects/[id]  → GET, PUT, DELETE
/api/resources      → GET (list), POST, PATCH (bulk)
/api/resources/[id] → GET, PUT, DELETE
```

### Pages
```
/                    → Home
/dashboard           → Analytics & stats
/entries             → List & create
/entries/new         → New entry form
/entries/[id]        → View/edit entry
/projects            → List & create
/projects/new        → New project form
/resources           → List & create
/resources/new       → New resource form
```

---

## Key Tools & Patterns

### Forms
```tsx
// react-hook-form + Zod + shadcn/ui
const { register, handleSubmit, formState } = useForm({
  resolver: zodResolver(createEntrySchema)
})
```

### Data Fetching
```tsx
// React Query hooks
const { data, isLoading, error } = useEntries()
const mutation = useCreateEntry()
```

### Database Operations
```tsx
// Prisma (with Zod validation)
// Tags & techStack are stored as JSON strings
parseJSON(entry.tags, [])        // Parse from DB
stringifyJSON(['react', 'ts'])   // Store to DB
```

### Styling
```tsx
// Tailwind + shadcn/ui
<Button variant="outline" size="sm">Click me</Button>
<Card><CardHeader>...</CardHeader></Card>
```

### Dark Mode
```tsx
// Built-in via next-themes
import { useTheme } from 'next-themes'
const { theme, setTheme } = useTheme()
```

---

## Common Tasks

### Add Database Field
1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Update `src/lib/validations.ts`
4. Update API route & React hooks

### Create New API Endpoint
1. Create `src/app/api/[resource]/route.ts`
2. Add validation schema to `validations.ts`
3. Add React Query hook to `hooks.ts`
4. Use hook in component

### Add UI Component
1. Create in `src/components/ui/`
2. Base on shadcn/ui patterns
3. Use `cn()` for class merging
4. Export and import as needed

---

## Essential Commands

```bash
# Development
npm run dev                  # Start server
npm run build              # Build for production
npm start                  # Run production server

# Database
npm run prisma:migrate     # Run migrations
npm run prisma:generate    # Generate Prisma Client
npm run prisma:studio      # Visual database editor

# Code Quality
npm run lint               # Run ESLint
```

---

## File Locations Cheat Sheet

| What | Where |
|------|-------|
| Database schema | `prisma/schema.prisma` |
| API validation | `src/lib/validations.ts` |
| API routes | `src/app/api/[resource]/route.ts` |
| React hooks | `src/lib/hooks.ts` |
| Utilities | `src/lib/utils.ts` |
| Pages | `src/app/*/page.tsx` |
| Components | `src/components/*.tsx` |
| UI library | `src/components/ui/*.tsx` |
| Global CSS | `src/app/globals.css` |
| Environment | `.env.local` |

---

## Validation Schema Quick Reference

```typescript
// In src/lib/validations.ts

// Zod schemas define both API validation AND frontend types
export const createEntrySchema = z.object({
  title: z.string().min(3),
  body: z.string().min(1),
  tags: z.array(z.string()).default([]),
  projectId: z.string().optional().nullable(),
})

export type CreateEntryInput = z.infer<typeof createEntrySchema>
```

---

## Environment Setup

```bash
# .env.local (created during setup)
DATABASE_URL="file:./prisma/dev.db"

# For PostgreSQL instead of SQLite:
# DATABASE_URL="postgresql://user:password@host/db"
```

---

## Debugging Tips

```bash
# View database visually
npm run prisma:studio

# Check database schema
cat prisma/schema.prisma

# View Prisma logs
# Add to lib/db.ts: log: ['query', 'error', 'warn']

# Test API with curl
curl -X GET http://localhost:3000/api/entries

# Clear database (⚠️ deletes all data)
rm prisma/dev.db && npm run prisma:migrate
```

---

## Project Stats

- **Files Created**: 50+
- **Components**: 20+
- **API Routes**: 9
- **Database Tables**: 3
- **Zod Schemas**: 15+
- **React Hooks**: 13+
- **Lines of Code**: 3000+

---

## Tech Stack Summary

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, TypeScript |
| **Framework** | Next.js 15 |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Forms** | react-hook-form, Zod |
| **State** | React Query |
| **Database** | Prisma, SQLite |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Theme** | next-themes |

---

## Key Principles

✨ **Backend-First** - Validation on server, shared schemas  
✨ **Type-Safe** - Strict TypeScript, no `any` types  
✨ **Component-Driven** - Reusable, composable UI  
✨ **API-First** - Well-designed REST API  
✨ **User-Friendly** - Dark mode, responsive, accessible  
✨ **DRY Code** - Shared schemas, utilities, hooks  

---

## Next: Run It!

```bash
npm install && npm run prisma:migrate && npm run dev
```

Then visit http://localhost:3000 🚀
