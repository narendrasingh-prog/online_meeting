import UserProvider from '@/contexts/UserProvider'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import "../globals.css"
import { Toaster } from 'sonner'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <html lang='en' suppressHydrationWarning>
        <body >
           
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
         
            
        </body>
    </html>
  )
}

export default layout
