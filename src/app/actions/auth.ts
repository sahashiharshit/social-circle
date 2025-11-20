import { FormState, SignupFormSchema } from "@/src/app/lib/definitions";
import z from "zod";
import passwordHasher, { generateSalt } from "./hashHelper";

export async function signup( state:FormState, formData:FormData) {
    
    const validatedFields = SignupFormSchema.safeParse({
        name:formData.get('name'),
        email:formData.get('email'),
        password:formData.get('password'),
    })
    if(!validatedFields.success){
        const flattenedErrors = z.flattenError(validatedFields.error);
        return flattenedErrors;
    }
    const {name,email,password}= validatedFields.data;
    const salt = generateSalt()
    const hashedPassword = await passwordHasher({password,salt})
    console.log(hashedPassword)

}