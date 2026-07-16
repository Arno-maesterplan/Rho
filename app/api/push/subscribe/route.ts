import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Bewaar een push-abonnement (of verwijder het bij DELETE)
export async function POST(request: NextRequest) {
  const { subscription, name } = await request.json();

  if (!subscription?.endpoint) {
    return NextResponse.json({ error: "subscription required" }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      endpoint: subscription.endpoint,
      subscription,
      name: name ?? null,
    },
    { onConflict: "endpoint" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { endpoint } = await request.json();
  if (!endpoint) return NextResponse.json({ error: "endpoint required" }, { status: 400 });

  const supabase = createClient();
  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
