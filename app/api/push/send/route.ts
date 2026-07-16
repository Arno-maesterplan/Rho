import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { VAPID_PUBLIC_KEY } from "@/lib/push";

// Stuur een pushmelding naar alle geabonneerde familieleden.
// De afzender zelf (vanNaam) wordt overgeslagen.
export async function POST(request: NextRequest) {
  const { title, body, url, vanNaam } = await request.json();

  if (!title || !body) {
    return NextResponse.json({ error: "title and body required" }, { status: 400 });
  }

  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      { error: "VAPID_PRIVATE_KEY niet ingesteld op de server" },
      { status: 500 }
    );
  }

  webpush.setVapidDetails("mailto:arno@maesterplan.be", VAPID_PUBLIC_KEY, privateKey);

  const supabase = createClient();
  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, subscription, name");

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const payload = JSON.stringify({ title, body, url: url ?? "/" });
  let verzonden = 0;

  await Promise.all(
    (subs ?? []).map(async (sub) => {
      if (vanNaam && sub.name === vanNaam) return; // niet naar jezelf sturen
      try {
        await webpush.sendNotification(sub.subscription, payload);
        verzonden++;
      } catch (err: unknown) {
        // Abonnement bestaat niet meer (uitgezet/verlopen) → opruimen
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        }
      }
    })
  );

  return NextResponse.json({ success: true, verzonden });
}
