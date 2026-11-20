import { redirect } from "next/navigation";

export default function DataRedirectPage() {
  redirect("/super-admin?tab=tabel");
}
