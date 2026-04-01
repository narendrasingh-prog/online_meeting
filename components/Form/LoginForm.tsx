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

export function LoginForm({
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
      const res = await authService.signIn({
        email: value.email,
        password: value.password,
      });
      if (!res.success) {
        toast.error(`something went wrong ${res.error.message}`);
      } else {
        toast.success(`Welcome ${res.data.email}`);
        router.replace("/");
      }
    },
  });

  const SignUpLink = () => {
    return (
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
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
                            disabled={isSubmitting}
                            className={
                              isSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                            placeholder="m@example.com"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
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
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="password"
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
                      {isSubmitting ? "Submitting..." : "Login"}
                    </Button>
                  );
                }}
              </form.Subscribe>
            </div>
            <SignUpLink />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
