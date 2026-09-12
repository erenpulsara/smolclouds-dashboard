import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { AuthFrame } from "@/components/AuthFrame";

export const metadata: Metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <AuthFrame
      title="request access"
      caption="Create an account, then redeem your invite code. Accounts on an allowlisted work domain are let through automatically."
      footer="Google · GitHub · email"
    >
      <SignUp appearance={{ elements: { header: { display: "none" } } }} />
    </AuthFrame>
  );
}
