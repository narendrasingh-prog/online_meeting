"use client";
import React, { ReactNode } from "react";


import QueryProvider from "@/contexts/provider";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar";

import UserProvider from "@/contexts/UserProvider";
import { ThemeProvider } from "next-themes";
import "../../globals.css"
import { Toaster } from "sonner";

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
            <Toaster  richColors={true}/>
            <UserProvider>
              <main className="relative">
                <Navbar />

                <div className="flex">
                  <Sidebar />
                  <section className="flex mt-28  flex-1 flex-col px-6 max-md:pb-14 sm:px-14">
                    <div className="w-full">{children}</div>
                  </section>
                </div>
              </main>
            </UserProvider>
        </ThemeProvider>
          </QueryProvider>
      </body>
    </html>
  );
};

export default HomeLayout;
