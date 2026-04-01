"use client";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "@tanstack/react-form";
import { AuthSchema } from "@/types/Auth";
import { AuthService } from "@/services/AuthService";
import { toast } from "sonner";

import FormError from "../Error/Form-error";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const authService = AuthService.Client();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      const res = await authService.signUp({
        email: value.email,
        password: value.password,
      });
      if (!res.success) {
        toast.error(`${res.error.message}`);
      } else {
        toast.success(`Welcome ${res.data.email}`);
        router.replace("/");
      }
    },
  });

  const LoginLink = () => {
    return (
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <>
                    <form.Field
                      name="email"
                      validators={{ onSubmit: AuthSchema.shape.email }}
                    >
                      {(field) => (
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="enter the email"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isSubmitting}
                            className={
                              isSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          />
                          <FormError error={field.state.meta.errors?.[0]} />
                        </div>
                      )}
                    </form.Field>
                    <form.Field
                      name="password"
                      validators={{ onSubmit: AuthSchema.shape.password }}
                    >
                      {(field) => (
                        <div className="grid gap-2">
                          <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                          </div>
                          <Input
                            id="password"
                            type="password"
                            placeholder="enter password"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isSubmitting}
                            className={
                              isSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          />
                          <FormError error={field.state.meta.errors?.[0]} />
                        </div>
                      )}
                    </form.Field>
                  </>
                )}
              </form.Subscribe>
              <form.Subscribe
                selector={(state) => ({
                  isSubmitting: state.isSubmitting,
                  email: state.values.email,
                  password: state.values.password,
                })}
              >
                {({ isSubmitting, email, password }) => {
                  const isDisabled =
                    isSubmitting ||
                    !email.trim() ||
                    password.trim().length <= 6;

                  return (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isDisabled}
                    >
                      {isSubmitting ? "Signing up..." : "Sign up"}
                    </Button>
                  );
                }}
              </form.Subscribe>
            </div>
            <LoginLink />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
