import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  cookieStore.delete("memento-auth-storage");
  cookieStore.delete("user-storage");

  return NextResponse.json({ success: true });
}
