import Link from "next/link";
import { Crest } from "@/components/brand/crest";
import { AuthForm } from "@/components/auth/auth-form";
import { signupAction } from "@/lib/auth/actions";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-[#E4DCCB] bg-[#FBF8F1] p-6 shadow-2xl shadow-[#082F23]/10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B9903D]">Forge</p>
            <h1 className="font-[var(--font-display)] text-4xl font-semibold">Begin the work</h1>
          </div>
          <Crest />
        </div>
        <p className="mb-6 text-sm leading-6 text-[#6B756F]">Build consistency through a guided 9-week fat-loss and conditioning system.</p>
        <AuthForm mode="signup" action={signupAction} />
        <p className="mt-6 text-center text-sm text-[#6B756F]">
          Already have an account? <Link className="font-semibold text-[#0F4A32]" href="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
