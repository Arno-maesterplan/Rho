import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const updateId = searchParams.get("updateId");

  if (!updateId) {
    return NextResponse.json(
      { error: "updateId required" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("update_comments")
    .select("id, author_name, text, created_at")
    .eq("update_id", updateId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { updateId, authorName, text } = await request.json();

  if (!updateId || !text || !authorName) {
    return NextResponse.json(
      { error: "updateId, authorName, and text required" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase.from("update_comments").insert({
    update_id: updateId,
    author_name: authorName,
    text: text.trim(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/updates");
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
    .from("update_comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/updates");
  return NextResponse.json({ success: true });
}
