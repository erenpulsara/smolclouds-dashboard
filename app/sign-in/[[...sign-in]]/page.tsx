import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { AuthFrame } from "@/components/AuthFrame";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthFrame
      title="console"
      caption="SmolClouds is in closed pilot. Sign in with the account on your invite."
      footer="Google · GitHub · email"
    >
      <SignIn appearance={{ elements: { header: { display: "none" } } }} />
    </AuthFrame>
  );
}
