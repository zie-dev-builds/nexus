import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { id: string } }) {
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

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: currentUser.id,
        postId: params.id,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: currentUser.id,
          postId: params.id,
        },
      },
    });
  } else {
    await prisma.like.create({
      data: {
        userId: currentUser.id,
        postId: params.id,
      },
    });
  }

  const likes = await prisma.like.findMany({
    where: { postId: params.id },
  });

  return NextResponse.json({
    liked: !existingLike,
    likes: likes.length,
  });
}
