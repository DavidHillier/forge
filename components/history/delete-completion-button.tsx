"use client";

import { Trash2 } from "lucide-react";
import { deleteWorkoutCompletionAction } from "@/lib/actions/app-actions";

export function DeleteCompletionButton({ completionId }: { completionId: string }) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm("Delete this session? This removes the record and resets the generated exercises so you can redo it.")) {
      e.preventDefault();
    }
  }

  return (
    <form action={deleteWorkoutCompletionAction} onSubmit={handleSubmit} className="shrink-0">
      <input type="hidden" name="completionId" value={completionId} />
      <button
        type="submit"
        title="Delete this session"
        className="flex size-9 items-center justify-center rounded-full text-[#6B756F] transition hover:bg-[#B94A48]/10 hover:text-[#B94A48]"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
