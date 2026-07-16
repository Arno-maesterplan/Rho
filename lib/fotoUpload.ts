import { createClient } from "@/lib/supabase/client";

// Upload een foto (base64 data-URL) naar Supabase Storage en geef de
// publieke URL terug. Bij een fout valt hij terug op de data-URL zelf,
// zodat opslaan altijd blijft werken.
export async function uploadFoto(dataUrl: string, map: string): Promise<string> {
  if (!dataUrl.startsWith("data:")) return dataUrl; // is al een URL

  try {
    const supabase = createClient();
    const blob = await (await fetch(dataUrl)).blob();
    const pad = `${map}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

    const { data, error } = await supabase.storage
      .from("photos")
      .upload(pad, blob, { contentType: "image/jpeg" });

    if (error || !data) {
      console.error("Foto-upload naar storage mislukt:", error);
      return dataUrl;
    }

    const { data: pub } = supabase.storage.from("photos").getPublicUrl(data.path);
    return pub.publicUrl;
  } catch (err) {
    console.error("Foto-upload fout:", err);
    return dataUrl;
  }
}

export async function uploadFotos(dataUrls: string[], map: string): Promise<string[]> {
  return Promise.all(dataUrls.map((d) => uploadFoto(d, map)));
}
