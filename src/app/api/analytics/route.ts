import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/data-store";

export async function GET() {
  try {
    const summary = await getAnalytics();
    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    console.error("Failed to compute analytics:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memproses data analitik survei." },
      { status: 500 }
    );
  }
}
