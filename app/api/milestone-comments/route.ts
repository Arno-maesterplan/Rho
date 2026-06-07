import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const milestoneId = searchParams.get("milestoneId");

  if (!milestoneId) {
    return NextResponse.json(
      { error: "milestoneId required" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("milestone_comments")
    .select("id, author_name, text, created_at")
    .eq("milestone_id", milestoneId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { milestoneId, authorName, text } = await request.json();

  if (!milestoneId || !text || !authorName) {
    return NextResponse.json(
      { error: "milestoneId, authorName, and text required" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase.from("milestone_comments").insert({
    milestone_id: milestoneId,
    author_name: authorName,
    text: text.trim(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/milestones");
  return NextResponse.json({ success: true, data });
}

export async function DELETE(request: NextRequest) {
  const { commentId } = await request.json();

  if (!commentId) {
    return NextResponse.json(
      { error: "commentId required" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("milestone_comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/milestones");
  return NextResponse.json({ success: true });
}
