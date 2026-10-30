import { NextResponse } from "next/server";
import { verifyMemberAccess } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const { nama, nis } = await request.json();

    if (!nama || !nis) {
      return NextResponse.json(
        { success: false, message: "Nama pengguna dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const result = verifyMemberAccess(nama, nis);

    if (!result.verified) {
      return NextResponse.json(
        {
          success: false,
          message: "Kombinasi nama pengguna dan kata sandi tidak valid.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Verifikasi berhasil. Selamat datang!",
      member: result.member,
    });

    // Set HTTP-only secure cookie for auth session
    response.cookies.set("vertikal_auth", JSON.stringify({ nis: result.member?.nis, nama: result.member?.nama }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memproses verifikasi akses." },
      { status: 500 }
    );
  }
}
