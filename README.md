# Laynote - Simple Note Taking App

A clean, fast note-taking application built with Next.js, Tiptap editor, and Clerk authentication.

## Features

- **Simple Note Creation**: Create new notes with a single click or Ctrl+N shortcut
- **Rich Text Editing**: Powered by Tiptap with formatting options (bold, italic, headings, lists)
- **Auto-save**: Notes are automatically saved as you type
- **Clean Interface**: Minimal, distraction-free design
- **User Authentication**: Secure login with Clerk

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Editor**: Tiptap with Starter Kit
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Clerk authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Database
   DATABASE_URL=your_neon_database_url
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Create a note**: Click "New Note" button or press Ctrl+N
- **Edit title**: Click on the title field and type
- **Edit content**: Use the rich text editor with formatting toolbar
- **Auto-save**: Changes are automatically saved after 1 second of inactivity

## Project Structure

```
src/
├── app/
│   ├── api/notes/          # Note API endpoints
│   ├── notes/              # Notes page
│   └── page.tsx            # Landing page
├── components/
│   ├── Tiptap/             # Rich text editor
│   ├── navbar.tsx          # Navigation bar
│   └── sidebar/            # Note list sidebar
└── db/
    ├── index.ts            # Database connection
    └── schema.ts           # Database schema
```

## Database Schema

- **users**: User accounts linked to Clerk authentication
- **notes**: User notes with title, content, and timestamps

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint