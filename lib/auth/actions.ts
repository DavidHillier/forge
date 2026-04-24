"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { createSession, destroySession, requireUser } from "@/lib/auth/session";
import { loginSchema, signupSchema } from "@/lib/validation/schemas";

export async function signupAction(_: unknown, formData: FormData) {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid name, email and password." };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "An account already exists for that email." };

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      programmeStartDate: new Date(),
      consents: {
        create: {
          privacyAcceptedAt: new Date(),
          termsAcceptedAt: new Date(),
        },
      },
    },
  });

  await createSession(user.id);
  redirect("/app/today");
}

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return { error: "Email or password is incorrect." };

  const validPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!validPassword) return { error: "Email or password is incorrect." };

  await createSession(user.id);
  redirect("/app/today");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function deleteAccountAction() {
  const user = await requireUser();
  await prisma.user.delete({ where: { id: user.id } });
  await destroySession();
  redirect("/signup");
}
