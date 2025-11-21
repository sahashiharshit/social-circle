"use server";
import { SignUpFormState, SignupFormSchema } from "@/src/lib/definitions";
import {z} from "zod";
import passwordHasher, { generateSalt } from "@/src/lib/hashHelper";
import { users } from "@/src/lib/mongodb";
import { createSession } from "@/src/lib/auth/createSession";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";



export async function signup( state:SignUpFormState, formData:FormData):Promise<SignUpFormState> {
    
    const validatedFields = SignupFormSchema.safeParse({
        name:formData.get('name'),
        email:formData.get('email'),
        password:formData.get('password'),
    })
    if(!validatedFields.success){
        const tree = z.treeifyError(validatedFields.error)
        const fieldErrors = {
            name:tree.properties?.name?.errors ??[],
            email:tree.properties?.email?.errors ??[],
            password:tree.properties?.password?.errors ??[],
        }
        return {errors:fieldErrors}
    }
    const {name,email,password}= validatedFields.data;
    const existing = await users.findOne({email});
    if(existing){
        return {errors:{email:["Email already registered."]}}
    }
    //Hash the password
    const salt = generateSalt()
    const hashedPassword = await passwordHasher({password,salt})
     //Save user in database

     const result = await users.insertOne({
        name,email,password:hashedPassword,
        salt,
        createdAt:new Date(),
     })
     const userId= result.insertedId.toString();

     //create a session
     const sessionId = await createSession(userId);

     //set cookie
     const cookieStore = await cookies()
     cookieStore.set("session",sessionId,{
            httpOnly:true,
            secure:true,
            path:'/',
            maxAge:60*60*24*7,
        })
    redirect("/dashboard");
}