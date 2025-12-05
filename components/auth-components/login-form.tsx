"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { login, socialProvider } from "@/app/actions/auth-actions"
import { useActionState, useState } from "react"
import { FormState } from "@/types/Auth"
import Link from "next/link"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const initialState: FormState = {
    errors: {}
  }

  const [state, formAction, isPending] = useActionState(
    login,
    initialState
  );
  const [googleLoading, setGoogleLoading] = useState(false);
  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await socialProvider();
    } catch (error) {
      toast.error("Google login failed")
      setGoogleLoading(false);
    }

  }
  return (

    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-3xl font-bold mb-2 text-center">Social Circle</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Input
              name="email"
              type="text"
              placeholder="Email"
            />
            {
              state.errors.email && <p className="text-red-500">{state.errors.email}</p>
            }
          </div>
          <div>
            <Input name="password" type="password" placeholder="Password" />
            {
              state.errors.password && <p className="text-red-500">{state.errors.password}</p>
            }
          </div>
          <Button className="w-full">Log in</Button>
          <div className="my-4 flex items-center">
            <span className="border-t w-full"></span>
            <span className="mx-2 text-gray-500">OR</span>
            <span className="border-t w-full"></span>
          </div>


        </form>
        <Button variant="outline" className="relative w-full h-10 flex justify-center items-center " onClick={
          handleGoogleLogin
        }
          disabled={googleLoading}>
          {googleLoading && (
            <span
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className="animate-spin h-5 w-5 rounded-full border-2 border-current border-t-transparent "
              ></span>
            </span>
          )}
          <span className={googleLoading ? "opacity-0" : "opacity-100"}>
            Log in with Google
          </span>
        </Button>
        <Link href="/forget-password">  <p className="text-xs text-center mt-2 text-indigo-400 cursor-pointer">Forgot password?</p></Link>
      </CardContent>
      <div className="mt-4 text-center">
        <span>Don't have an account?</span>
        <a href="/signup" className="text-indigo-400 ml-1 font-medium">Sign up</a>
      </div>
    </Card>

  )
}
