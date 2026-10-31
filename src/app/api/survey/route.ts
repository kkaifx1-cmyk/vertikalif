import { NextResponse } from "next/server";
import { getAllResponses, saveResponse, deleteResponse, clearAllResponses } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const submittedOnly = searchParams.get("submitted_only") === "true";
    const responses = await getAllResponses();

    const noCacheHeaders = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    };

    if (submittedOnly) {
      const submitted = responses.map((r) => ({
        id: r.id,
        nomorId: r.nomorId || "",
        nama: r.nama,
        kategori: r.kategori,
        createdAt: r.createdAt,
      }));
      return NextResponse.json({ success: true, data: submitted }, { headers: noCacheHeaders });
    }

    return NextResponse.json({ success: true, data: responses }, { headers: noCacheHeaders });
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
    const { nama, kategori, jenisKelamin, nomorId, answers, feedback, violationsCount } = body;

    if (!nama || !kategori || !answers) {
      return NextResponse.json(
        { success: false, message: "Nama, kelas santri, dan jawaban survei wajib diisi." },
        { status: 400 }
      );
    }

    // Pengecekan Limit Pengisian: 1 Santri hanya dapat mengisi 1 kali
    const existing = await getAllResponses();
    const cleanName = nama.trim().toLowerCase();
    const cleanNomorId = (nomorId || "").trim();

    const isDuplicate = existing.some((r) => {
      // 1. Cek kecocokan nomor ID / NIS
      if (cleanNomorId && r.nomorId && r.nomorId.trim() === cleanNomorId) {
        return true;
      }
      // 2. Cek kecocokan nama lengkap dan kategori kelas
      if (
        r.nama.trim().toLowerCase() === cleanName &&
        r.kategori.trim().toLowerCase() === kategori.trim().toLowerCase()
      ) {
        return true;
      }
      return false;
    });

    if (isDuplicate) {
      return NextResponse.json(
        {
          success: false,
          code: "STUDENT_LIMIT_EXCEEDED",
          message: `Pengisian ditolak: Santri atas nama "${nama}" (${cleanNomorId ? `NIS: ${cleanNomorId}` : kategori}) sudah pernah menyelesaikan pengisian survei ini sebelumnya. Kuota pengisian dibatasi tepat 1 kali per santri demi integritas dan validitas data instrumen.`,
        },
        { status: 409 }
      );
    }

    // Format catatan masukan santri beserta log integritas jika ada
    let finalFeedback = (feedback || "").trim();
    if (typeof violationsCount === "number" && violationsCount > 0) {
      const integrityNote = `[Catatan Sistem: Terdeteksi ${violationsCount} kali perpindahan tab/jendela selama pengisian]`;
      finalFeedback = finalFeedback ? `${finalFeedback}\n\n${integrityNote}` : integrityNote;
    }

    const saved = await saveResponse({
      nama,
      kategori,
      jenisKelamin: jenisKelamin || "Ikhwan",
      nomorId: nomorId || "",
      answers,
      feedback: finalFeedback,
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
