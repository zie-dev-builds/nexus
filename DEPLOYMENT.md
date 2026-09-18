# Deployment

## Local

```bash
cp .env.example .env
npm ci
npx prisma db push
npm run db:seed
npm run dev
```

## Production with Render

1. Create a managed PostgreSQL database and copy its internal `DATABASE_URL`.
2. Connect the repository to Render. `render.yaml` defines the web service.
3. Set `DATABASE_URL`, `NEXTAUTH_URL` (the deployed HTTPS URL), and a long random `NEXTAUTH_SECRET`.
4. Deploy. The service runs the custom Next.js server, which hosts both the web app and Socket.IO endpoint.

## Docker

```bash
docker build -t nexus-social .
docker run --env-file .env -p 3000:3000 nexus-social
```

### Realtime notes

Socket.IO uses the same origin as the Next.js app. The client authenticates the connection with the current user ID, joins a private user room, persists messages through Prisma, and broadcasts `message:new` to both participants. For a hardened deployment, replace the handshake user ID with a verified NextAuth JWT and use a Redis adapter when running multiple web instances.

The reusable live chat UI is in `components/RealtimeChat.tsx`. It requires the authenticated user ID and recipient user ID, and should replace the dashboard's temporary message panel when a conversation participant selector is added.
