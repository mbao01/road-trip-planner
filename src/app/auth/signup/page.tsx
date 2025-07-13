import { AuthCard } from "@/components/auth/auth-card"
import { SignUpForm } from "@/components/auth/sign-up-form"

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create an Account"
      description="Get started by creating a new account"
      footerText="Already have an account?"
      footerLink="/auth/signin"
      footerLinkText="Sign in"
    >
      <SignUpForm />
    </AuthCard>
  )
}
