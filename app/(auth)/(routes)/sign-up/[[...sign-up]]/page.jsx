"use client"
import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
export default function SignUpPage() {
  const router = useRouter();
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      router.push("/nickname");
    }
  }, [user, router]);
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp />
    </div>
  );
}
