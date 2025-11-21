import { validateSession } from "@/src/lib/auth/validateSession";
import { redirect } from "next/navigation";




export default async function Dashboard(){

    const session = await validateSession();

    if(!session){
        redirect('/login');
    }
    return (
        <></>
    );
}