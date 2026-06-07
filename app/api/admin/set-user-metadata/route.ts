import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Admin endpoint to set user metadata
 * Usage: POST /api/admin/set-user-metadata
 * Body: { name: "Papa" | "Mama" | other }
 */
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated", details: userError?.message },
        { status: 401 }
      );
    }

    console.log(`📝 Setting metadata for user ${user.id}: name = "${name}"`);

    // Update user metadata via admin API (server-side)
    // Note: This uses the service role key which has full permissions
    const adminSupabase = createClient();

    const { data, error } = await adminSupabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          name: name,
        },
      }
    );

    if (error) {
      console.error("❌ Error updating metadata:", error);
      return NextResponse.json(
        { error: "Failed to update metadata", details: error.message },
        { status: 400 }
      );
    }

    console.log(`✅ User metadata updated: ${JSON.stringify(data.user?.user_metadata)}`);

    return NextResponse.json({
      success: true,
      message: `✅ Your name is now set to "${name}"`,
      user_id: user.id,
      metadata: data.user?.user_metadata,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
