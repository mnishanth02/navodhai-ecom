import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password too weak (min 8 chars)" }).max(64, {
    message: "Password too long (max 64 chars)",
  }),
});

export const SignupSchema = z.object({
  name: z.string().min(3, { message: "Name too short (min 3 chars)" }),
  email: z.string().nonempty("Please enter you email").email({ message: "Invalid email format" }),
  password: z
    .string()
    .nonempty()
    .min(8, { message: "Password too weak (min 8 chars)" })
    .max(64, {
      message: "Password too long (max 64 chars)",
    })
    .refine((value) => /^[a-zA-Z0-9_.-]*$/.test(value ?? ""), "Use only letters, numbers, and common symbols"),
});

export type SigninSchemaType = z.infer<typeof SigninSchema>;
export type SignupSchemaType = z.infer<typeof SignupSchema>;
