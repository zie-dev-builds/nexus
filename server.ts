import { createServer } from "node:http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { prisma } from "./lib/prisma";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function main() {
  await app.prepare();
  const httpServer = createServer((request, response) => handle(request, response));
  const io = new SocketIOServer(httpServer, {
    cors: { origin: process.env.NEXTAUTH_URL || true, credentials: true },
  });

  io.use((socket, nextMiddleware) => {
    const userId = String(socket.handshake.auth?.userId || "").trim();
    if (!userId) return nextMiddleware(new Error("Authentication required"));
    socket.data.userId = userId;
    nextMiddleware();
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;

    socket.emit("connected", { ok: true });
    socket.join(`user:${userId}`);

    socket.on("conversation:join", (conversationId: string) => {
      if (conversationId) socket.join(`conversation:${conversationId}`);
    });

    socket.on("message:send", async (payload: { receiverId?: string; body?: string }) => {
      const receiverId = String(payload?.receiverId || "").trim();
      const body = String(payload?.body || "").trim();
      if (!receiverId || !body || body.length > 5000) return;

      const recipient = await prisma.user.findUnique({ where: { id: receiverId }, select: { id: true } });
      if (!recipient) return socket.emit("message:error", { error: "Recipient not found" });

      const message = await prisma.message.create({
        data: { senderId: userId, receiverId, body },
        include: { sender: true, receiver: true },
      });

      io.to(`user:${userId}`).to(`user:${receiverId}`).emit("message:new", message);
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`NEXUS listening on http://${hostname}:${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
