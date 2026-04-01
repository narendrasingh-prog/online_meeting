import z from "zod";

export const AuthSchema = z.object({
  email: z
    .string()
    .min(5, "email is not correct")
    .email("invalid email address"),
  password: z
    .string()
    .trim()
    .min(6, "password length should be greater than 6 character "),
});

export type AuthUser = z.infer<typeof AuthSchema>;


