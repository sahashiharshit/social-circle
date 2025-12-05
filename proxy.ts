import { NextRequest, NextResponse } from "next/server"
import 'dotenv'

const PUBLIC_PATHS =["/","/signup"]
export async function proxy(request:NextRequest){
    const {pathname} = request.nextUrl
    if(PUBLIC_PATHS.includes(pathname)){
        return NextResponse.next();
    }
    const sessionCookie = request.cookies.get(process.env.COOKIE_TOKEN!)
    if(!sessionCookie){
        const url = new URL("/signup",request.url);
        url.searchParams.set("redirectTo",pathname);
        return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
}
export const config={
    matcher:["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}