import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/data-store";

export async function GET() {
  try {
    const summary = await getAnalytics();
    return NextResponse.json(
      { success: true, data: summary },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Failed to compute analytics:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memproses data analitik survei." },
      { status: 500 }
    );
  }
}
