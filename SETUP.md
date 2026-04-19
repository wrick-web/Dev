# BuildDevLog - First-Time Setup Guide

This guide walks you through setting up BuildDevLog for development.

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher (comes with Node.js)
- **Git**: For version control (optional but recommended)

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including Next.js, Prisma, Zod, React Query, and UI components.

### 2. Set Up the Database

```bash
npm run prisma:migrate
```

This creates a SQLite database file (`prisma/dev.db`) and runs all migrations. The database includes three tables: `Entry`, `Project`, and `Resource`.

### 3. Start the Development Server

```bash
npm run dev
```

The app is now running at [http://localhost:3000](http://localhost:3000). You should see the BuildDevLog home page.

## First Steps in the App

1. **Visit the Dashboard** - See overall statistics and activity charts
2. **Create an Entry** - Click "Entries" → "New Entry" to write your first learning note
3. **Create a Project** - Track a project you're working on
4. **Add Resources** - Collect learning materials (articles, tutorials, docs)

## Project Structure Overview

```
src/
├── app/                          # Next.js pages and API routes
│   ├── api/                      # REST API endpoints
│   │   ├── entries/              # Entry CRUD operations
│   │   ├── projects/             # Project CRUD operations
│   │   └── resources/            # Resource CRUD operations
│   ├── dashboard/                # Analytics dashboard
│   ├── entries/                  # Entry list and detail pages
│   ├── projects/                 # Project list page
│   ├── resources/                # Resource list page
│   ├── layout.tsx                # Root layout with navbar and sidebar
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles and CSS variables
├── components/
│   ├── ui/                       # Reusable UI components (Button, Card, etc.)
│   ├── entry-form.tsx            # Form for creating/editing entries
│   ├── entry-card.tsx            # Card component for entry preview
│   ├── project-form.tsx          # Form for creating projects
│   ├── project-card.tsx          # Card component for projects
│   ├── resource-form.tsx         # Form for adding resources
│   ├── resource-card.tsx         # Card component for resources
│   ├── navbar.tsx                # Top navigation with theme toggle
│   ├── sidebar.tsx               # Left sidebar navigation
│   ├── theme-provider.tsx        # Dark mode provider
│   └── query-provider.tsx        # React Query provider
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── validations.ts            # Zod schemas for validation
│   ├── hooks.ts                  # React Query custom hooks
│   └── utils.ts                  # Utility functions
├── prisma/
│   └── schema.prisma             # Database schema
├── .env.local                    # Environment variables (created by setup)
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Available Commands

### Development
```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Create/run migrations
npm run prisma:studio      # Open visual database viewer
```

### Database Schema

#### Entry (Learning Journal Entries)
- **id**: Unique identifier
- **title**: Entry title
- **body**: Markdown content
- **tags**: Array of tags (stored as JSON)
- **date**: When the entry was written
- **projectId**: Optional link to a project
- **createdAt/updatedAt**: Timestamps

#### Project (Development Projects)
- **id**: Unique identifier
- **name**: Project name (unique)
- **description**: Project description
- **techStack**: Array of technologies (stored as JSON)
- **status**: IDEA | BUILDING | SHIPPED | PAUSED
- **liveUrl**: Deployed URL (optional)
- **repoUrl**: Repository URL (optional)
- **createdAt/updatedAt**: Timestamps

#### Resource (Learning Materials)
- **id**: Unique identifier
- **url**: Resource URL
- **title**: Resource title
- **category**: DOCUMENTATION | TUTORIAL | ARTICLE | VIDEO | TOOL | LIBRARY | OTHER
- **notes**: User notes (optional)
- **isRead**: Read status flag
- **isFavorite**: Favorite status flag
- **entryId/projectId**: Optional links
- **createdAt/updatedAt**: Timestamps

## API Endpoints Reference

### Entries
- `GET /api/entries` - Fetch all entries (supports pagination with `skip` and `take`)
- `POST /api/entries` - Create new entry
- `GET /api/entries/[id]` - Fetch single entry
- `PUT /api/entries/[id]` - Update entry
- `DELETE /api/entries/[id]` - Delete entry

### Projects
- `GET /api/projects` - Fetch all projects (supports filtering by `status`)
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Fetch single project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Resources
- `GET /api/resources` - Fetch resources (supports filtering: `category`, `isRead`, `isFavorite`)
- `POST /api/resources` - Create new resource
- `PATCH /api/resources` - Bulk update (toggle `isRead` or `isFavorite`)
- `GET /api/resources/[id]` - Fetch single resource
- `PUT /api/resources/[id]` - Update resource
- `DELETE /api/resources/[id]` - Delete resource

## Testing the API

### Using curl
```bash
# Create an entry
curl -X POST http://localhost:3000/api/entries \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learned React Hooks",
    "body": "Understanding useState and useEffect...",
    "tags": ["react", "hooks", "javascript"]
  }'

# Get all entries
curl http://localhost:3000/api/entries

# Create a project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "BuildDevLog",
    "description": "Developer learning journal",
    "techStack": ["Next.js", "TypeScript", "Prisma"],
    "status": "BUILDING",
    "repoUrl": "https://github.com/user/builddevlog"
  }'
```

### Using VS Code REST Client Extension
Create a `test.http` file:
```http
@baseUrl = http://localhost:3000

### Get all entries
GET {{baseUrl}}/api/entries

### Create an entry
POST {{baseUrl}}/api/entries
Content-Type: application/json

{
  "title": "My First Entry",
  "body": "This is a test entry",
  "tags": ["test"]
}
```

## Key Features Explained

### Dark Mode
- Located in the navbar (Sun/Moon icon)
- Automatically detects system preference
- Persists to localStorage
- Uses CSS variables for theming

### Dashboard
- **Stats Cards**: Total entries, projects, resources, and current streak
- **Activity Chart**: Shows entries logged per week (last 8 weeks)
- **Streak**: Counts consecutive days of logging
- **Tag Cloud**: Displays top 5 most-used tags

### Form Validation
- All forms use react-hook-form with Zod validation
- Validation happens both on client (form) and server (API)
- Error messages appear inline
- Toast notifications show success/error states

### State Management
- React Query manages all server state
- Automatic caching with 5-minute stale time
- Mutations invalidate relevant queries automatically
- No Redux or Zustand needed

## Troubleshooting

### "Port 3000 is already in use"
```bash
# Find and kill the process (Mac/Linux)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or run on a different port
npm run dev -- -p 3001
```

### Database errors
```bash
# Reset the database (deletes all data!)
rm prisma/dev.db prisma/dev.db-journal
npm run prisma:migrate
```

### "Prisma Client not generated"
```bash
npm run prisma:generate
```

## Next Steps

1. **Customize the UI** - Edit components in `src/components/`
2. **Add more fields** - Update `schema.prisma` and run `npm run prisma:migrate`
3. **Deploy** - See [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)
4. **Add authentication** - Consider NextAuth.js for user accounts
5. **Add search** - Implement full-text search on entries and resources

## Need Help?

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **React Query Docs**: https://tanstack.com/query/latest
- **Zod Docs**: https://zod.dev
- **Tailwind CSS Docs**: https://tailwindcss.com/docs

Happy learning! 🚀
