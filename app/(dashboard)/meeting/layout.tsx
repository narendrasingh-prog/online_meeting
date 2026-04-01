import QueryProvider from "@/contexts/provider";
import UserProvider from "@/contexts/UserProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "../../globals.css"
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
        
            <Toaster richColors={true}/>
            <UserProvider>
              <main className="relative">
                <div className="w-full">{children}</div>
              </main>
            </UserProvider>
       
       </ThemeProvider>
          </QueryProvider>
      </body>
    </html>
  );
}
