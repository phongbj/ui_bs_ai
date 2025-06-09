// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Nếu truy cập đúng trang chủ "/" mà chưa có token thì redirect về /chat
  if (pathname === "/" && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/chat";
    return NextResponse.redirect(url);
  }

  // Các route khác đều next bình thường
  return NextResponse.next();
}

export const config = {
  // Chỉ áp dụng middleware cho đúng path "/"
  matcher: ["/"],
};
