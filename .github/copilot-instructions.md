<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# BuildDevLog - Development Guidelines

## Project Overview
BuildDevLog is a developer learning journal and project tracker built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma, and React Query.

## Architecture Principles
- **Backend-First**: All validation happens server-side using Zod schemas shared with frontend
- **Type-Safe**: Strict TypeScript mode throughout, no `any` types
- **Server State**: React Query manages all async data fetching
- **Database**: SQLite with Prisma ORM using cuid() for IDs

## File Structure
```
src/
├── app/                     # Next.js App Router
│   ├── api/                 # API routes with Zod validation
│   ├── dashboard/           # Analytics dashboard
│   ├── entries/             # Journal entries management
│   ├── projects/            # Project tracking
│   └── resources/           # Learning resources collection
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── forms/               # Form components with validation
│   └── cards/               # Card components for content display
├── lib/
│   ├── db.ts                # Prisma client singleton
│   ├── validations.ts       # Zod schemas (API & form)
│   ├── hooks.ts             # React Query hooks
│   └── utils.ts             # Utility functions
```

## Key Implementation Details

### API Routes
All routes must include JSDoc comments explaining the "why" behind the implementation.

- **Validation**: Use Zod schemas from `lib/validations.ts`
- **Error Handling**: Return proper HTTP status codes (400, 404, 409, 500)
- **JSON Storage**: Tags, techStack stored as JSON strings, parsed with `parseJSON()` utility
- **Pagination**: All list endpoints support `skip` and `take` query params

### React Query Hooks (`lib/hooks.ts`)
- Create one hook per mutation/query
- Always invalidate relevant queries on mutations
- Use `queryKey` arrays for proper cache management

### UI Components
- Use shadcn/ui components from `components/ui/`
- Implement loading states with Skeleton components
- Use `cn()` utility from `lib/utils.ts` for class merging
- All mutations should show toast notifications (success/error)

### Dark Mode
- Handled by `next-themes` + CSS variables in `globals.css`
- System-aware with localStorage persistence
- Toggle in Navbar component

## Coding Standards

1. **TypeScript**: No `any` types, use explicit type annotations
2. **Components**: Functional components with hooks
3. **Forms**: react-hook-form + Zod + shadcn/ui patterns
4. **Styling**: Tailwind classes with responsive design
5. **Error Handling**: Comprehensive error messages with context
6. **Comments**: JSDoc for public APIs, explain "why" not "what"

## Database Models

### Entry
- Markdown content storage
- Tags as JSON array
- Date tracking for streak calculation
- Optional project association

### Project
- Status enum: IDEA, BUILDING, SHIPPED, PAUSED
- Tech stack as JSON array
- URLs for live deployment and repository
- Relation to entries and resources

### Resource
- Category enum for organization
- Read/favorite boolean flags
- Optional association with entries and projects
- External URL storage

## Development Workflow

### Adding a New Feature
1. Update `schema.prisma` if needed
2. Run `npm run prisma:migrate`
3. Update `lib/validations.ts` with Zod schemas
4. Create API route with validation
5. Add React Query hooks in `lib/hooks.ts`
6. Build UI components using forms and cards
7. Test with Postman/curl for API endpoints

### Common Tasks
- **Generate Prisma**: `npm run prisma:generate`
- **Migrate DB**: `npm run prisma:migrate`
- **View DB**: `npm run prisma:studio`
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`

## Important Patterns

### Form Validation
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(validationSchema),
})
```

### React Query
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: async () => { /* fetch */ }
})
```

### Toast Notifications
```typescript
import { toast } from 'sonner'
toast.success('Success message')
toast.error('Error message')
```

## Notes
- Always check existing Zod schemas before creating new ones
- Reuse existing hooks in `lib/hooks.ts`
- Maintain consistent spacing and formatting
- Use semantic HTML and ARIA labels for accessibility
