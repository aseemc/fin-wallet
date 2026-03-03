import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/admin/login" ||
    pathname === "/admin/signup";

  if (isAuthPage) {
    if (user) {
      const role = user.user_metadata?.role as string | undefined;
      const redirectTo =
        role === "advisor"
          ? new URL("/admin", request.url)
          : new URL("/", request.url);
      return NextResponse.redirect(redirectTo);
    }
    return supabaseResponse;
  }

  if (!user) {
    const isAdminRoute = pathname.startsWith("/admin");
    const loginUrl = isAdminRoute
      ? new URL("/admin/login", request.url)
      : new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const role = user.user_metadata?.role as string | undefined;
  const isAdminRoute = pathname.startsWith("/admin");

  if (role === "advisor" && !isAdminRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (role === "client" && isAdminRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}
