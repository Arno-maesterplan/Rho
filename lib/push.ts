// VAPID public key voor web push (de private key staat in de env var
// VAPID_PRIVATE_KEY op Vercel — nooit in de code)
export const VAPID_PUBLIC_KEY =
  "BFb-Mb8_T7AdTXAxhQ4VvYe8nulZ3jDzG0seDmSfDXeZwbDiSyKt5WLi16Js_gm-6EbHTetP4Hd_zXONNYhsUL0";

// Stuur een pushmelding naar iedereen (fire-and-forget vanaf de client)
export function stuurPushNaarFamilie(opts: {
  title: string;
  body: string;
  url?: string;
  vanNaam?: string;
}) {
  fetch("/api/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  }).catch(() => {
    // meldingen zijn nice-to-have; nooit de hoofdactie blokkeren
  });
}
