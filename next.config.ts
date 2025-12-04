import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    serverActions:{
      bodySizeLimit:"10mb",
    }
  },
  productionBrowserSourceMaps:false,
  images:{
 
    remotePatterns:[
      {
        protocol:"https",
        hostname:"dupsstqkif8kw.cloudfront.net",
        pathname:"/**",
      },
      {
        protocol:"https",
        hostname:'lh3.googleusercontent.com',
        pathname:"/**",
      }
    ],
  },
};

export default nextConfig;
