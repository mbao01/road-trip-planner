import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
  return (
    <Suspense>
      <AuthCard
        title="Sign In"
        description="Choose your preferred sign in method"
        footerText="Don't have an account?"
        footerLink="/auth/signup"
        footerLinkText="Sign up"
      >
        <GoogleSignInButton />
        <div className="my-4 flex items-center">
          <Separator className="flex-1" />
          <span className="mx-4 text-xs text-gray-500">OR</span>
          <Separator className="flex-1" />
        </div>
        <SignInForm />
      </AuthCard>
    </Suspense>
  );
}
