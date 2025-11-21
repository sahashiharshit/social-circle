"use client";
import { useActionState } from "react";
import { signup } from "../../app/(auth)/signup/actions";


export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  return (
    <form action={action} className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-lg font-semibold text-gray-700">Name</label>
        <input id="name" name="name" placeholder="Enter your name" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      {state?.errors?.name?.[0] && <p className="text-sm text-red-600">{state.errors.name[0]}</p>}
      <div className="flex flex-col gap-1 ">
        <label htmlFor="email" className="text-lg font-semibold text-gray-700">Email</label>
        <input id="email" name="email" type="email" placeholder="Enter your email" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      {state?.errors?.email?.[0] && <p className="text-sm text-red-600">{state.errors.email[0]}</p>}
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-lg font-semibold text-gray-700">Password</label>
        <input id="password" name="password" type="password" placeholder="******" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      {state?.errors?.password && (
        <div className="text-sm text-red-600 mt-1">
          <p className="font-medium">Password must:</p>
          <ul className="list-disc list-inside">
            {state.errors.password.map((error) => (
              <li key={error}>-{error}</li>
            ))}
          </ul>
        </div>
      )}
      <button disabled={pending} type="submit" className={`mt-2 w-full py-2 rounded-lg font-semibold text-white
      ${pending ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
    `}>{pending ? "Please wait..." : "Sign Up"}</button>
    </form>


  );
}