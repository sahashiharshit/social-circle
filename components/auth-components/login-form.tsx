"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
 
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { login } from "@/app/actions/auth-actions"
import { useActionState } from "react"
import { FormState } from "@/app/actions/auth-actions"
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const initialState:FormState={
    errors:{}
  }

  const [state,formAction,isPending] = useActionState(
    login,
    initialState
  );

  return (
    
      <Card className="w-full max-w-sm">
        <CardHeader>
         <CardTitle className="text-3xl font-bold mb-2 text-center">Social Circle</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}  className="space-y-4">
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
            <Button variant="outline" className="w-full flex justify-center items-center gap-2">
             
              Log in with Google
            </Button>
            <p className="text-xs text-center mt-2 text-indigo-400 cursor-pointer">Forgot password?</p>
          </form>
        </CardContent>
        <div className="mt-4 text-center">
          <span>Don't have an account?</span>
          <a href="/signup" className="text-indigo-400 ml-1 font-medium">Sign up</a>
        </div>
      </Card>
    
  )
}
