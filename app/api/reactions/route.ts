import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Emoji-reacties op updates en milestones (tabel: item_reactions)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");
  const itemType = searchParams.get("itemType");

  if (!itemId || !itemType) {
    return NextResponse.json({ error: "itemId and itemType required" }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("item_reactions")
    .select("id, author_name, emoji")
    .eq("item_id", itemId)
    .eq("item_type", itemType);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

// POST = toggle: bestaat dezelfde reactie van deze persoon al → verwijderen,
// anders toevoegen
export async function POST(request: NextRequest) {
  const { itemId, itemType, authorName, emoji } = await request.json();

  if (!itemId || !itemType || !authorName || !emoji) {
    return NextResponse.json(
      { error: "itemId, itemType, authorName and emoji required" },
      { status: 400 }
    );
  }

  const supabase = createClient();

  const { data: existing } = await supabase
    .from("item_reactions")
    .select("id")
    .eq("item_id", itemId)
    .eq("item_type", itemType)
    .eq("author_name", authorName)
    .eq("emoji", emoji)
    .limit(1);

  if (existing && existing.length > 0) {
    const { error } = await supabase.from("item_reactions").delete().eq("id", existing[0].id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, toggled: "removed" });
  }

  const { error } = await supabase.from("item_reactions").insert({
    item_id: itemId,
    item_type: itemType,
    author_name: authorName,
    emoji,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, toggled: "added" });
}
