"use server"
import { auth } from "@/lib/auth"
import { Errors, FormState } from "@/types/Auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"




export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  const errors: Errors = {}
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  if (!email) {
    errors.email = "Email is required"
  }
  if (!password) {
    errors.password = "Password is required"
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  await auth.api.signInEmail({
    body: {
      email,
      password,
      rememberMe: true,
    },
    headers: await headers(),
  })
  redirect('/dashboard')
}


export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  
  if (!name || !email || !password || !confirmPassword) {
    throw new Error("All fields are required");
  }
  if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)) {
    throw new Error("Invalid email format");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  try {
    await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });
    redirect('/')
  } catch (e: any) {
    throw new Error(e?.message ?? "Sign up failed");
  }

}

export async function logout() {

  await auth.api.signOut({
    headers: await headers(),
  });
  redirect('/');

}
export async function socialProvider() {
  const { redirect: redirectUrl, url } = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/dashboard",
    }

  });
  if (redirectUrl) {
    redirect(url!);
  }

}
