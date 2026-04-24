import Link from "next/link";
import { Crest } from "@/components/brand/crest";
import { AuthForm } from "@/components/auth/auth-form";
import { loginAction } from "@/lib/auth/actions";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-[#E4DCCB] bg-[#FBF8F1] p-6 shadow-2xl shadow-[#082F23]/10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B9903D]">Forge</p>
            <h1 className="font-[var(--font-display)] text-4xl font-semibold">Welcome back</h1>
          </div>
          <Crest />
        </div>
        <p className="mb-6 text-sm leading-6 text-[#6B756F]">Discipline today. Results tomorrow.</p>
        <AuthForm mode="login" action={loginAction} />
        <p className="mt-6 text-center text-sm text-[#6B756F]">
          New to Forge? <Link className="font-semibold text-[#0F4A32]" href="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
