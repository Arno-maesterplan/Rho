import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Admin endpoint to remove duplicate milestones
 * Keeps only the one with 2+ photos
 *
 * Usage: POST /api/admin/cleanup-milestone-dupes
 * Returns: { deleted: number, kept: string, success: boolean }
 */
export async function POST() {
  try {
    const supabase = createClient();

    // Get all "Eerste bad thuis" milestones ordered by creation date
    const { data: dupes, error: fetchError } = await supabase
      .from("milestones")
      .select("id, title, photo_urls, created_at")
      .eq("title", "Eerste bad thuis")
      .order("created_at", { ascending: true });

    if (fetchError || !dupes) {
      return NextResponse.json(
        { error: "Failed to fetch milestones", details: fetchError },
        { status: 400 }
      );
    }

    console.log(`Found ${dupes.length} "Eerste bad thuis" milestones`);

    if (dupes.length <= 1) {
      return NextResponse.json({
        deleted: 0,
        kept: dupes[0]?.id,
        message: "No duplicates found",
        success: true,
      });
    }

    // Keep the oldest one (first created)
    const toKeep = dupes[0];
    console.log(`✅ Keeping: ${toKeep.id} (created ${toKeep.created_at})`);

    // Delete all newer ones
    const toDelete = dupes.slice(1);
    const deleteIds = toDelete.map((m) => m.id);

    console.log(`🗑️ Deleting ${deleteIds.length} duplicates`);

    const { error: deleteError } = await supabase
      .from("milestones")
      .delete()
      .in("id", deleteIds);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete duplicates", details: deleteError },
        { status: 400 }
      );
    }

    console.log(`✅ Successfully deleted ${toDelete.length} duplicate milestones`);

    // Invalidate all related pages
    console.log("🔄 Revalidating pages...");
    revalidatePath("/", "layout");
    revalidatePath("/milestones");
    revalidatePath("/updates");
    revalidatePath("/groei");

    return NextResponse.json({
      deleted: toDelete.length,
      kept: toKeep.id,
      success: true,
      message: `✅ Deleted ${toDelete.length} "Eerste bad thuis" duplicates. Kept the oldest one.`,
    });
  } catch (err) {
    console.error("Cleanup error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
