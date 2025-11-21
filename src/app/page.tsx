

import { cookies } from "next/headers"
import Link from "next/link"

import { redirect } from "next/navigation";
import { validateSession } from "../lib/auth/validateSession";

export default async function LandingPage() {

    const cookieStore =await cookies();
    const sessionId = cookieStore.get("session")?.value;
    if(sessionId){
        const user = await validateSession();
        if(user){
            redirect('/dashboard');
        }
    }
    return (
        <div className="flex flex-row flex-wrap p-5 items-center justify-center gap-6">
            <div className="flex-1 min-w-[300px] flex justify-center">
                {/* <ImageCard w={500} h={500} src="/landingImage.png" /> */}
            </div>
            <div className="flex-1 min-w-[300px] max-w-md flex flex-row gap-4 justify-center items-center">
                <div className="w-full max-w-xs">
                    <Link href="/login" className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3" >Sign In</Link>
                    <Link href="/signup" className="flex h-12 grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">Sign Up</Link>
                </div>
            </div>
        </div>

    )
}