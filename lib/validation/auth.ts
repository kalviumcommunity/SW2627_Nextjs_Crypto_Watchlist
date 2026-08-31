// Import Zod validation library for constructing runtime type schemas
import { z } from "zod";

// Define Zod schema object for validating login form inputs
export const loginSchema = z.object({
  // Validate email field as a trimmed string matching standard email format
  email: z.string().trim().email("Enter a valid email address"),
  // Validate password field as non-empty string
  password: z.string().min(1, "Password is required"),
  // Validate optional rememberMe checkbox boolean flag
  rememberMe: z.boolean().optional(),
});

// Infer TypeScript type for Login form input object from schema
export type LoginInput = z.infer<typeof loginSchema>;

// Define Zod schema object for validating registration form inputs with refinements
export const registerSchema = z
  .object({
    // Validate name field as non-empty trimmed string
    name: z.string().trim().min(1, "Full name is required"),
    // Validate email field as trimmed string matching email format
    email: z.string().trim().email("Enter a valid email address"),
    // Validate password field with security rules: min length 8, contains digit, contains special char
    password: z
      .string()
      .min(8, "At least 8 characters")
      .refine((val) => /\d/.test(val), "One number")
      .refine((val) => /[^A-Za-z0-9]/.test(val), "One special character"),
    // Validate confirm password field as non-empty string
    confirmPassword: z.string().min(1, "Confirm your password"),
    // Validate terms agreement checkbox to ensure it is explicitly checked (true)
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms of service",
    }),
  })
  // Refine schema to ensure password and confirmPassword fields match exactly
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Infer TypeScript type for Register form input object from schema
export type RegisterInput = z.infer<typeof registerSchema>;

