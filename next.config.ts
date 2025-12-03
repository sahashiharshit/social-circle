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
        hostname:"social-circle-image-bucket.s3.ap-south-1.amazonaws.com",
        pathname:"/**",
      },
      {
        protocol:"https",
        hostname:'lh3.googleusercontent.com'
      }
    ],
  },
};

export default nextConfig;
