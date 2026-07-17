import exifr from "exifr";

// Lees de opnamedatum uit de EXIF-metadata van een foto.
// Geeft "yyyy-mm-dd" terug, of null als er geen datum in zit.
export async function fotoDatum(file: File): Promise<string | null> {
  try {
    const meta = await exifr.parse(file, ["DateTimeOriginal", "CreateDate"]);
    const d: Date | undefined = meta?.DateTimeOriginal ?? meta?.CreateDate;
    if (!d || isNaN(d.getTime())) return null;
    const jaar = d.getFullYear();
    const maand = String(d.getMonth() + 1).padStart(2, "0");
    const dag = String(d.getDate()).padStart(2, "0");
    return `${jaar}-${maand}-${dag}`;
  } catch {
    return null;
  }
}
