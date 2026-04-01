import React, { ReactNode, Suspense } from "react";

import QueryProvider from "@/contexts/provider";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "next-themes";
import "../../globals.css";
import { Toaster } from "sonner";
import { AuthService } from "@/services/AuthService";
import { AuthProvider } from "@/contexts/AuthContext";

const AuthProviderWrapper = async ({ children }: { children: ReactNode }) => {
  const authService = await AuthService.Server();
  const user = await authService.getUsers();
  return (
    <AuthProvider initialUser={user}>
      <main className="relative">
        <Navbar />

        <div className="flex">
          <Sidebar />
          <section className="flex mt-28  flex-1 flex-col px-6 max-md:pb-14 sm:px-14">
            <div className="w-full">{children}</div>
          </section>
        </div>
      </main>
    </AuthProvider>
  );
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
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
};

export default HomeLayout;
