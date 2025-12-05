"use client"
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,

} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signup, socialProvider } from "@/app/actions/auth-actions"
import { useState } from 'react'
import { toast } from 'sonner'
import { SignupValues } from '@/types/Auth'

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, } = useForm<SignupValues>();
  const password = watch('password');
  const onSubmit = async (data: SignupValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      await signup(formData);
    } catch (error: any) {
      toast.error("Error in Signup")
    }
  }
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
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-3xl font-bold mb-2 text-center">Social Circle</CardTitle>
        <CardDescription>Sign up to see photos and videos from your friends.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

          <Input id="name" type="text" placeholder="Full Name" {...register("name", { required: "Full name is required" })}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <span className="text-red-600">{errors.name.message}</span>
          )}
          <Input

            id="email"
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
                message: "Invalid email address",
              },
            })}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <span className="text-red-600">{errors.email.message}</span>
          )}
          <Input id="password" type="password" placeholder='Password' {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <span className="text-red-600">{errors.password.message}</span>
          )}
          <Input id="confirm-password" type="password" placeholder='Confirm Password' {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          {errors.confirmPassword && (
            <span className="text-red-600">{errors.confirmPassword.message}</span>
          )}
          <FieldGroup>
            <Field>
              <Button type="submit" disabled={isSubmitting}>Create Account</Button>
              <div className="my-4 flex items-center">
                <span className="border-t w-full"></span>
                <span className="mx-2 text-gray-500">OR</span>
                <span className="border-t w-full"></span>
              </div>
            </Field>
          </FieldGroup>

        </form>
        <FieldGroup>
          <Field>
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
            <FieldDescription className="px-6 text-center">
              Already have an account? <a href="/">Sign in</a>
            </FieldDescription>
          </Field>
        </FieldGroup>

      </CardContent>
    </Card>
  )
}
