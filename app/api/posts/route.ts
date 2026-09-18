import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: String(session.user.email).toLowerCase() },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      comments: true,
      likes: true,
    },
  });

  const mappedPosts = posts.map((post) => ({
    ...post,
    likedByMe: post.likes.some((like) => like.userId === user.id),
    _count: {
      likes: post.likes.length,
      comments: post.comments.length,
    },
  }));

  return NextResponse.json({ posts: mappedPosts });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: String(session.user.email).toLowerCase() },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const payload = await request.json();
  const body = String(payload.body ?? "").trim();

  if (!body) {
    return NextResponse.json({ error: "Post body is required." }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      body,
      imageUrl: payload.imageUrl ? String(payload.imageUrl) : null,
      authorId: user.id,
    },
    include: {
      author: true,
      comments: true,
      likes: true,
    },
  });

  return NextResponse.json({ post });
}
