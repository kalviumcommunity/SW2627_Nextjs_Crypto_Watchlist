// Import main NextAuth initialization function from next-auth v5 / Auth.js package
import NextAuth from "next-auth";
// Import Credentials provider for email/password sign in
import Credentials from "next-auth/providers/credentials";
// Import Google OAuth provider
import Google from "next-auth/providers/google";
// Import GitHub OAuth provider
import GitHub from "next-auth/providers/github";
// Import PrismaAdapter to link NextAuth session and account management to Prisma database
import { PrismaAdapter } from "@auth/prisma-adapter";
// Import singleton Prisma client instance
import prisma from "@/lib/prisma";
// Import bcryptjs for verifying password hashes during credential login
import bcrypt from "bcryptjs";
// Import validation schema for credential inputs
import { loginSchema } from "@/lib/validation/auth";

// Declare mutable array to hold active authentication providers
const providers: any[] = [];

// Conditionally register Google OAuth provider if environment variables exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Conditionally register GitHub OAuth provider if environment variables exist
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

// Register Credentials Provider for email + password authentication
providers.push(
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    // Async authorize callback function executing when user submits login credentials
    async authorize(credentials) {
      // Validate input payload against login Zod schema
      const parsed = loginSchema.safeParse(credentials);
      // Return null if validation fails to reject sign-in attempt
      if (!parsed.success) return null;

      // Extract validated email and password credentials
      const { email, password } = parsed.data;
      // Look up user record in database by email address
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Reject sign-in if user does not exist or user has no password (e.g. OAuth-only account)
      if (!user || !user.passwordHash) return null;

      // Compare raw input password with stored bcrypt hash in database
      const isValid = await bcrypt.compare(password, user.passwordHash);
      // Return null if password hash comparison fails
      if (!isValid) return null;

      // Return sanitized user object on successful authentication
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    },
  })
);

// Initialize NextAuth configuration and export helper utilities (handlers, signIn, signOut, auth)
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Configure Prisma ORM adapter for database storage
  adapter: PrismaAdapter(prisma),
  // Configure JWT session strategy for stateless authorization tokens
  session: { strategy: "jwt" },
  // Override default auth pages to redirect users to custom /login page
  pages: {
    signIn: "/login",
  },
  // Pass list of configured authentication providers
  providers,
  // Configure session and JWT token callbacks
  callbacks: {
    // Session callback: attach user ID from token sub to session.user object
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    // JWT callback: persist user ID into token sub field upon sign in
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  // Secret key used to sign JWT tokens and encrypt cookies
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "coindcx-auth-secret-key-12345",
});

