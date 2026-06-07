import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { milestoneId } = await request.json();

    if (!milestoneId) {
      return NextResponse.json(
        { error: "milestone ID required" },
        { status: 400 }
      );
    }

    console.log("🗑️ API route: deleting milestone", milestoneId);

    const supabase = createClient();

    const { error, data } = await supabase
      .from("milestones")
      .delete()
      .eq("id", milestoneId);

    if (error) {
      console.error("❌ Delete error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.log("✅ Milestone deleted:", data);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("❌ API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
