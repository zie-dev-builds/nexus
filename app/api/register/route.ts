import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { name, username, email, password } = payload;

    if (!name || !username || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: String(email).toLowerCase() }, { username: String(username) }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "A user with that email or username already exists." }, { status: 409 });
    }

    const passwordHash = await hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        name: String(name),
        username: String(username),
        email: String(email).toLowerCase(),
        passwordHash,
        image: `https://i.pravatar.cc/150?u=${encodeURIComponent(String(username))}`,
        bio: "Freshly joined NEXUS — sharing ideas and moments.",
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Something went wrong while creating your account." }, { status: 500 });
  }
}
