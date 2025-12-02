
import { LoginForm } from "@/components/auth-components/login-form";
import { auth } from "@/lib/auth";

import { cookies, headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";



export default async function LandingPage() {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("better-auth.session_token");
  if (sessionCookie) {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session) {
      redirect("/dashboard");
    }
  }

  return (
 

    <div className="min-h-screen flex items-center justify-center bg-accent">

      <div className="hidden lg:flex items-center justify-center mr-12">
        {/* Demo: replace with <Image /> from next/image for real images */}
        <div className="relative w-96 h-96">
          <div className="absolute top-8 left-8 w-96 h-96 rounded-2xl overflow-hidden shadow-lg">
            <Image src="/landingImage.png" alt="Social Circle" fill className="w-full h-full object-cover" loading="eager"/>
          </div>
          {/* Add stickers, overlays using more positioned divs */}
        </div>
      </div>
      <LoginForm />
    </div>


    
  )
}



