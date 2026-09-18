# NEXUS

A polished social media experience built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth, and Socket.IO.

## Included in this starter
- Responsive feed with post composer, likes, comments-ready data model, and image posts
- Theme Studio with Default Pink, Dark, Luminous Blue, and Personalized Face modes
- NEXUS logo system: interlocking speech bubbles, negative-space N, and core star burst
- People discovery and follow interaction
- Direct message interface with local optimistic state
- Prisma schema for users, posts, comments, likes, follows, and messages

## Run locally

```bash
npm install
cp .env.example .env
# Set DATABASE_URL and NEXTAUTH_SECRET in .env
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000.

The current UI uses seeded client-side demo data so the experience is immediately visible. Wire the Prisma models to Route Handlers/Server Actions and add a NextAuth provider for production authentication. Socket.IO can be attached to a custom Next server or a standalone realtime service.
