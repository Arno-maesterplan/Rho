"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteMilestoneAction(milestoneId: string) {
  const supabase = createClient();

  console.log("🗑️ Server action: deleting milestone ID:", milestoneId);

  // This uses the server's service_role key (bypasses RLS restrictions)
  const { error, data } = await supabase
    .from("milestones")
    .delete()
    .eq("id", milestoneId);

  if (error) {
    console.error("❌ Server delete error:", error);
    throw new Error("Fout bij verwijderen: " + error.message);
  }

  console.log("✅ Milestone deleted via server action, revalidating...");
  revalidatePath("/milestones");

  return { success: true };
}
