import React, { ReactNode, Suspense } from "react";
import QueryProvider from "@/contexts/provider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "../../globals.css";
import { AuthService } from "@/services/AuthService";
import { AuthProvider } from "@/contexts/AuthContext";

const AuthProviderWrapper = async ({ children }: { children: ReactNode }) => {
  const authService = await AuthService.Server();
  const user = await authService.getUsers();

  return (
    <AuthProvider initialUser={user}>
      <main className="relative">
        <div className="w-full">{children}</div>
      </main>
    </AuthProvider>
  );
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors={true} />
            <Suspense
              fallback={
                <div className="flex justify-center py-20 text-white">
                  Loading user...
                </div>
              }
            >
              <AuthProviderWrapper>{children}</AuthProviderWrapper>
            </Suspense>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
