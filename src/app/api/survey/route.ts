import { NextResponse } from "next/server";
import { getAllResponses, saveResponse, deleteResponse, clearAllResponses } from "@/lib/data-store";

export async function GET() {
  try {
    const responses = await getAllResponses();
    return NextResponse.json({ success: true, data: responses });
  } catch (error) {
    console.error("Failed to fetch responses:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data respon survei" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, kategori, jenisKelamin, nomorId, answers, feedback } = body;

    if (!nama || !kategori || !answers) {
      return NextResponse.json(
        { success: false, message: "Nama, kelas santri, dan jawaban survei wajib diisi." },
        { status: 400 }
      );
    }

    const saved = await saveResponse({
      nama,
      kategori,
      jenisKelamin: jenisKelamin || "Ikhwan",
      nomorId: nomorId || "",
      answers,
      feedback: feedback || "",
    });

    return NextResponse.json({
      success: true,
      message: "Respon survei berhasil disimpan. Terima kasih!",
      data: saved,
    });
  } catch (error) {
    console.error("Failed to save survey:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal saat menyimpan respon." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("all") === "true";

    if (clearAll) {
      await clearAllResponses();
      return NextResponse.json({
        success: true,
        message: "Seluruh data respon survei berhasil dibersihkan.",
      });
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID respon wajib disertakan." },
        { status: 400 }
      );
    }

    await deleteResponse(id);
    return NextResponse.json({
      success: true,
      message: `Data respon ${id} berhasil dihapus.`,
    });
  } catch (error) {
    console.error("Failed to delete response:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat menghapus data respon." },
      { status: 500 }
    );
  }
}
