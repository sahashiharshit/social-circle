import { createSession } from "@/src/lib/auth/createSession";
import { LoginFormSchema, LoginFormState } from "@/src/lib/definitions";
import { verifyPassword } from "@/src/lib/hashHelper";
import { users } from "@/src/lib/mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z} from 'zod';

export async function login(state:LoginFormState,formData:FormData):Promise<LoginFormState>{

    const validatedFields = LoginFormSchema.safeParse({
        email:formData.get('email'),
        password:formData.get('password'),
    })

        if(!validatedFields.success){
            const tree = z.treeifyError(validatedFields.error)
            const fieldErrors ={
                email:tree.properties?.email?.errors ??[],
                password:tree.properties?.password?.errors ??[],
            }
            return {errors:fieldErrors}
        }
        const {email,password} = validatedFields.data;
        const user = await users.findOne({email},{
            projection:{password:1,salt:1}
        })
        if(!user){
            return {errors:{email:[`Account doesn't exist.`]}}
        }
        const hash = user.password
        const salt = user.salt
        const isPasswordMatch = verifyPassword({password,salt,hash})

        if(!isPasswordMatch) {
            return {
                errors:{
                    password:['Incorrect Password.'],
                },
            }
        }
        const userId = (user._id).toString();
       const sessionId = await createSession(userId);

        const cookieStore = await cookies()
        cookieStore.set('session',sessionId,{
            httpOnly:true,
            secure:true,
            path:'/',
            maxAge:60*60*24*7,
        })
        redirect("/dashboard");
}