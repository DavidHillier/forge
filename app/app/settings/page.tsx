import { LogOut, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { deleteAccountAction, logoutAction } from "@/lib/auth/actions";
import { resetProgrammeDataAction, updateEquipmentProfileAction, updateSettingsAction } from "@/lib/actions/app-actions";
import { requireUser } from "@/lib/auth/session";
import { dateInputValue } from "@/lib/utils";

const EQUIPMENT_OPTIONS = [
  "Dumbbells",
  "Barbell",
  "Kettlebells",
  "Cable machine",
  "Pull-up bar",
  "Resistance bands",
  "Bench",
  "Box / step",
];

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
        <Card>
          <h2 className="mb-1 font-semibold">Equipment available</h2>
          <p className="mb-4 text-sm text-[#6B756F]">Tick what you have access to. Used to surface relevant exercise substitutes.</p>
          <form action={updateEquipmentProfileAction} className="grid gap-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {EQUIPMENT_OPTIONS.map((item) => (
                <label key={item} className="flex items-center gap-3 rounded-md border border-[#E4DCCB] p-3 cursor-pointer hover:border-[#1B3D2F] transition-colors">
                  <input
                    type="checkbox"
                    name="equipment"
                    value={item}
                    defaultChecked={(user.equipmentProfile as string[] ?? []).includes(item)}
                    className="h-4 w-4 accent-[#1B3D2F]"
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
            <Button variant="secondary">Save Equipment</Button>
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
