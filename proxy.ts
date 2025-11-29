import { NextRequest, NextResponse } from "next/server"


const PUBLIC_PATHS =["/","/signup"]
export async function proxy(request:NextRequest){
    const {pathname} = request.nextUrl
    if(PUBLIC_PATHS.includes(pathname)){
        return NextResponse.next();
    }
    const sessionCookie = request.cookies.get('better-auth.session_token')
    if(!sessionCookie){
        const url = new URL("/signup",request.url);
        url.searchParams.set("redirectTo",pathname);
        return NextResponse.redirect(url);
    }
    // const session = await auth.api.getSession({
    //     headers: await headers()
    // })
    return NextResponse.next();
}
export const config={
    matcher:["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}