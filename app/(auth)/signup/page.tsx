import { SignupForm } from "@/components/auth-components/signup-form"
import PageLoader from "@/components/ui/pageLoader"

export default function Page() {
  return (
    
    <>
      <PageLoader/>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
    </>
    
  )
}
