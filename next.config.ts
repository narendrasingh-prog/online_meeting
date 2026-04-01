import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images:{
    remotePatterns:[
      {hostname:'jllxcfnsmscokcoeuxwx.supabase.co',protocol:'https'}
    ]
  }
};

export default nextConfig;
