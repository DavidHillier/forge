"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (state: unknown, formData: FormData) => Promise<{ error?: string } | void>;
};

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const error = state && typeof state === "object" && "error" in state ? String(state.error) : null;

  return (
    <form action={formAction} className="grid gap-4">
      {mode === "signup" ? (
        <Field label="Name">
          <input name="name" autoComplete="name" className={inputClass} required />
        </Field>
      ) : null}
      <Field label="Email">
        <input name="email" type="email" autoComplete="email" className={inputClass} required />
      </Field>
      <Field label="Password">
        <input name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} className={inputClass} required minLength={8} />
      </Field>
      {error ? <p className="rounded-md border border-[#B94A48]/30 bg-[#B94A48]/10 p-3 text-sm text-[#B94A48]">{error}</p> : null}
      <Button disabled={pending}>{mode === "signup" ? "Create Account" : "Log In"}</Button>
    </form>
  );
}
