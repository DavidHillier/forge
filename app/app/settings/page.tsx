import { LogOut, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { deleteAccountAction, logoutAction } from "@/lib/auth/actions";
import { resetProgrammeDataAction, updateSettingsAction } from "@/lib/actions/app-actions";
import { requireUser } from "@/lib/auth/session";
import { dateInputValue } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <AppShell active="Settings">
      <div className="mx-auto grid max-w-2xl gap-6">
        <SectionTitle eyebrow="Settings" title="Forge profile" body="Keep your account lean, portable and ready for future app pathways." />
        <Card>
          <form action={updateSettingsAction} className="grid gap-4">
            <Field label="Profile name"><input name="name" defaultValue={user.name} className={inputClass} /></Field>
            <Field label="Email"><input value={user.email} className={inputClass} disabled /></Field>
            <Field label="Programme start date"><input name="programmeStartDate" type="date" defaultValue={dateInputValue(user.programmeStartDate)} className={inputClass} /></Field>
            <Field label="Units">
              <select name="units" defaultValue={user.units} className={inputClass}>
                <option value="metric">Metric (kg, cm)</option>
                <option value="imperial">Imperial (lb, in)</option>
              </select>
            </Field>
            <Field label="Theme"><input value="Forge" className={inputClass} disabled /></Field>
            <Button>Save Settings</Button>
          </form>
        </Card>
        <Card className="grid gap-3">
          <form action={resetProgrammeDataAction}>
            <Button variant="ghost" className="w-full">Reset Programme Data</Button>
          </form>
          <form action={logoutAction}>
            <Button variant="ghost" className="w-full"><LogOut size={16} /> Log Out</Button>
          </form>
          <form action={deleteAccountAction}>
            <Button variant="danger" className="w-full"><Trash2 size={16} /> Delete Account</Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
