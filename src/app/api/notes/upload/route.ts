import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const ALLOWED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "image/png", "image/jpeg"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    await requireAuth();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }
    const type = file.type;
    if (!ALLOWED_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "File type not allowed. Use PDF, DOC, DOCX, TXT, PNG, or JPG." },
        { status: 400 }
      );
    }
    const ext = type === "application/pdf" ? "pdf" :
      type === "application/msword" ? "doc" :
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? "docx" :
      type === "text/plain" ? "txt" :
      type === "image/png" ? "png" : "jpg";
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const name = `${randomBytes(12).toString("hex")}.${ext}`;
    const filePath = path.join(dir, name);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));
    const fileUrl = `/uploads/${name}`;
    const fileType = ext;
    return NextResponse.json({ fileUrl, fileType });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
