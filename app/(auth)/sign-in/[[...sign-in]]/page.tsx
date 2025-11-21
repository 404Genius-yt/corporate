"use client"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState("")
  const router = useRouter()

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(value)) setEmailError("Invalid email format")
    else setEmailError("")
  }

  // validate password
  const validatePassword = (value: string) => {
    if (value.length < 8) setPasswordError("Password must be at least 8 characters")
    else setPasswordError("")
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError("") // clear error
    setLoading(true)

    validateEmail(email)
    validatePassword(password)

    if (emailError || passwordError) {
      setLoading(false)
      return
    }

    if (!isLoaded) return

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/")
      }
    } catch (err: any) {
      // Try to extract error message safely
      const errorMsg =
        (err &&
          typeof err === "object" &&
          "errors" in err &&
          Array.isArray((err as any).errors) &&
          (err as any).errors[0]?.message) ||
        err?.message ||
        "Something went wrong";
      setGeneralError(errorMsg);
      console.log(err); // debug
    }

    setLoading(false);
  }

  return (
    <div className="grid w-full items-center px-4 sm:justify-center bg-[#FAFAFA]">
      <form
        onSubmit={handleSubmit}
        className="
          w-full space-y-6 rounded-2xl 
          bg-white px-4 py-10 
          shadow-lg 
          ring-1 ring-inset ring-[#00B4D8]/30 
          sm:w-96 sm:px-8
        "
      >
        <header className="text-center">
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-[#222222]">
            Sign in
          </h1>
        </header>

        {/* email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#222222]">Email</label>
          <input
            value={email}
            required
            onChange={(e) => {
              setEmail(e.target.value)
              validateEmail(e.target.value)
            }
            }
            className="
              w-full rounded-md bg-[#FAFAFA] 
              px-3.5 py-2 text-sm text-[#222222]
              ring-1 ring-inset ring-[#00B4D8]/40
              focus:ring-[#0077B6]
            "
          />
          {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
        </div>

        {/* password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#222222]">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            validatePassword(e.target.value)
            }}
            className="
              w-full rounded-md bg-[#FAFAFA] 
              px-3.5 py-2 text-sm text-[#222222]
              ring-1 ring-inset ring-[#00B4D8]/40
              focus:ring-[#0077B6]
            "
          />
          {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
        </div>

        {generalError && <p className="text-sm text-red-500 text-center">{generalError}</p>}

        {/* sign in button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full rounded-md 
            bg-[#0077B6] text-white 
            px-3.5 py-2 text-center text-sm font-medium
            hover:bg-[#00B4D8] transition
          "
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-[#222222]/60">
          Don’t have an account?{" "}
          <a
            href="/sign-up"
            className="font-medium text-[#0077B6] underline-offset-4 hover:underline"
          >
            Create one
          </a>
        </p>
      </form>
    </div>
  )
}
