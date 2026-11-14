import { NextResponse } from "next/server";
import { getAllResponses, saveResponse, deleteResponse, clearAllResponses } from "@/lib/data-store";
import { extractWibDate } from "@/lib/session-helper";

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
      const todayWib = extractWibDate(new Date());
      // Kunci hanya santri yang SUDAH mengisi pada sesi hari ini
      // Santri yang mengisi pada sesi sebelumnya (misal Senin 02 Nov) otomatis terbuka kembali untuk hari Kamis ini
      const submittedToday = responses.filter((r) => extractWibDate(r.createdAt) === todayWib);
      const submitted = submittedToday.map((r) => ({
        id: r.id,
        nomorId: r.nomorId || "",
        nama: r.nama,
        kategori: r.kategori,
        createdAt: r.createdAt,
      }));
      return NextResponse.json(
        { success: true, data: submitted, sessionDate: todayWib, totalActiveSubmissionsToday: submitted.length },
        { headers: noCacheHeaders }
      );
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
    const { nama, kategori, jenisKelamin, nomorId, answers, feedback, violationsCount, durationSeconds, sessionId, sessionDate } = body;

    if (!nama || !kategori || !answers) {
      return NextResponse.json(
        { success: false, message: "Nama, kelas santri, dan jawaban survei wajib diisi." },
        { status: 400 }
      );
    }

    // Penentuan target sesi evaluasi: Dukungan penuh pengisian seluruh sesi (Sesi 1 s.d. Sesi 4)
    let targetCreatedAt: string | undefined = undefined;
    if (sessionDate && /^\d{4}-\d{2}-\d{2}$/.test(sessionDate)) {
      const nowIsoTime = new Date().toISOString().substring(10);
      targetCreatedAt = `${sessionDate}${nowIsoTime}`;
    } else if (sessionId) {
      const sessionDateMap: Record<string, string> = {
        sesi_1: "2026-11-02",
        sesi_2: "2026-11-05",
        sesi_3: "2026-11-11",
        sesi_4: "2026-11-14",
      };
      if (sessionDateMap[sessionId]) {
        const nowIsoTime = new Date().toISOString().substring(10);
        targetCreatedAt = `${sessionDateMap[sessionId]}${nowIsoTime}`;
      }
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
      durationSeconds: typeof durationSeconds === "number" && durationSeconds > 0 ? Math.max(1, Math.round(durationSeconds)) : undefined,
      createdAt: targetCreatedAt,
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
    const name = searchParams.get("name") || undefined;
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

    await deleteResponse(id, name);
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
