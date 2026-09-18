import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: String(session.user.email).toLowerCase() },
  });

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: currentUser.id }, { receiverId: currentUser.id }],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: true,
      receiver: true,
    },
  });

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: String(session.user.email).toLowerCase() },
  });

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const payload = await request.json();
  const receiverId = String(payload.receiverId ?? "").trim();
  const body = String(payload.body ?? "").trim();

  if (!receiverId || !body) {
    return NextResponse.json({ error: "Receiver and message are required." }, { status: 400 });
  }

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!receiver) {
    return NextResponse.json({ error: "Recipient not found." }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      senderId: currentUser.id,
      receiverId: receiver.id,
      body,
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
