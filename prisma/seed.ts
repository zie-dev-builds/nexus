import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  const passwordHash = await hash("password123", 10);
  const users = await Promise.all([
    prisma.user.upsert({ where: { email: "demo@nexus.dev" }, update: {}, create: { name: "Alex Morgan", username: "alexm", email: "demo@nexus.dev", passwordHash, image: "https://i.pravatar.cc/150?img=68", bio: "Building a more connected corner of the internet." } }),
    prisma.user.upsert({ where: { email: "maya@nexus.dev" }, update: {}, create: { name: "Maya Chen", username: "mayac", email: "maya@nexus.dev", passwordHash, image: "https://i.pravatar.cc/150?img=47", bio: "Ideas, design, and tiny adventures." } }),
  ]);

  const existing = await prisma.post.count({ where: { authorId: users[0].id } });
  if (!existing) await prisma.post.createMany({ data: [{ authorId: users[0].id, body: "Welcome to NEXUS — your people, in sync." }, { authorId: users[1].id, body: "The best ideas usually start out messy. Keep making room for the unexpected ✨" }] });
}

main().finally(() => prisma.$disconnect());
