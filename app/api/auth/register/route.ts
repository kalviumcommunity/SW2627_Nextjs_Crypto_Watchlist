// Import NextResponse object from Next.js server module for constructing HTTP responses
import { NextResponse } from "next/server";
// Import singleton Prisma ORM database client instance
import prisma from "@/lib/prisma";
// Import bcryptjs library for secure password hashing
import bcrypt from "bcryptjs";
// Import Zod server-side validation schema for registration data
import { registerSchema } from "@/lib/validation/auth";

// Export async POST request handler for the /api/auth/register API route
export async function POST(request: Request) {
  try {
    // Parse incoming JSON body payload from request stream
    const body = await request.json();
    // Validate request body data against Zod registration schema
    const parsed = registerSchema.safeParse(body);

    // If request payload fails schema validation, return 400 Bad Request with error details
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Extract validated name, email, and raw password from parsed data object
    const { name, email, password } = parsed.data;

    // Query database using Prisma to check if a user with this email address already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    // If matching user record is found, reject registration with 409 Conflict status
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash user password asynchronously with a salt round factor of 10
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user record in database with hashed password and profile details
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      // Select safe fields to return (excluding password hash)
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Return 201 Created status with created user data
    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );
  } catch (error) {
    // Log unexpected errors to server console
    console.error("Registration error:", error);
    // Return 500 Internal Server Error response to client
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

