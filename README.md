# BuildDevLog - Developer Learning Journal

A modern developer learning journal and project tracker built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and Zod.

## Features

- 📔 **Learning Journal** - Write and organize your development learning entries
- 🏗️ **Project Tracking** - Track your projects with status, tech stack, and links
- 📚 **Resource Collection** - Collect and organize learning resources
- 📊 **Analytics Dashboard** - Visualize your learning progress with charts
- 🏷️ **Tag System** - Organize entries with tags
- ⭐ **Favorites** - Mark important resources as favorites
- 🌓 **Dark Mode** - System-aware dark mode with persistence

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Prisma ORM + SQLite
- **Validation**: Zod
- **State Management**: TanStack React Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up the database:

```bash
npm run prisma:migrate
```

This will create the SQLite database and run all migrations.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── entries/       # Entry CRUD endpoints
│   │   ├── projects/      # Project CRUD endpoints
│   │   └── resources/     # Resource CRUD endpoints
│   ├── dashboard/         # Dashboard page
│   ├── entries/           # Entries page
│   ├── projects/          # Projects page
│   └── resources/         # Resources page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── navbar.tsx        # Top navigation
│   ├── sidebar.tsx       # Left sidebar
│   └── theme-provider.tsx # Dark mode provider
├── lib/
│   ├── db.ts             # Prisma client singleton
│   ├── validations.ts    # Zod schemas
│   └── utils.ts          # Utility functions
├── layout.tsx            # Root layout
└── globals.css           # Global styles
```

## API Endpoints

### Entries
- `GET /api/entries` - Fetch all entries
- `POST /api/entries` - Create entry
- `GET /api/entries/[id]` - Fetch single entry
- `PUT /api/entries/[id]` - Update entry
- `DELETE /api/entries/[id]` - Delete entry

### Projects
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Fetch single project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Resources
- `GET /api/resources` - Fetch resources (with filtering)
- `POST /api/resources` - Create resource
- `PATCH /api/resources` - Bulk update (toggle read/favorite)
- `GET /api/resources/[id]` - Fetch single resource
- `PUT /api/resources/[id]` - Update resource
- `DELETE /api/resources/[id]` - Delete resource

## Database Schema

### Entry
- `id` - Unique identifier
- `title` - Entry title
- `body` - Markdown content
- `tags` - JSON array of tags
- `date` - Entry date
- `projectId` - Optional project reference
- `createdAt` / `updatedAt` - Timestamps

### Project
- `id` - Unique identifier
- `name` - Project name
- `description` - Project description
- `techStack` - JSON array of technologies
- `status` - IDEA | BUILDING | SHIPPED | PAUSED
- `liveUrl` - Deployed project URL
- `repoUrl` - Repository URL
- `createdAt` / `updatedAt` - Timestamps

### Resource
- `id` - Unique identifier
- `url` - Resource URL
- `title` - Resource title
- `category` - DOCUMENTATION | TUTORIAL | ARTICLE | VIDEO | TOOL | LIBRARY | OTHER
- `notes` - User notes
- `isRead` - Read status
- `isFavorite` - Favorite status
- `entryId` / `projectId` - Optional references
- `createdAt` / `updatedAt` - Timestamps

## Key Features

### Backend-First Approach
All data validation happens on the server using Zod schemas that are shared between API and frontend.

### Type Safety
Strict TypeScript configuration ensures type safety throughout the application.

### Pagination
API endpoints support pagination for better performance with large datasets.

### Error Handling
Comprehensive error handling with proper HTTP status codes and validation messages.

### Dark Mode
System-aware dark mode with localStorage persistence using next-themes.

## Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL="file:./dev.db"
```

## Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create/run migrations
npm run prisma:migrate

# Open Prisma Studio (visual database viewer)
npm run prisma:studio
```

## Contributing

Feel free to fork this project and submit pull requests.

## License

MIT
