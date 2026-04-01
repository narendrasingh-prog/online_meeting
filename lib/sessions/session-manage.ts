import { cookies } from "next/headers"

const saveSession=async (userId:string,session:any)=>{
    const cookieStore=await cookies();
   cookieStore.set(`sb-session-${userId}-access-token`,session.access_Token,{path:'/'});
   cookieStore.set(`sb-session-${userId}-refresh-token`,session.refresh_Token,{path:'/'});


}