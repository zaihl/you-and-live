import { SignIn, SignedOut } from "@clerk/nextjs"

const SignInPage = () => {
  return (
    <SignedOut>
      <SignIn />
    </SignedOut>
  )
}

export default SignInPage