import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isOnAdmin = pathname.startsWith("/admin")
  const isStudio = pathname.startsWith("/admin/studio")

  // Redirect to login if accessing /admin but NOT the Studio and NOT logged in
  if (isOnAdmin && !isStudio && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }

  // Inject pathname for Layout check
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-next-pathname", pathname)

  return Response.next({
    request: {
      headers: requestHeaders,
    },
  })
})

export const config = {
  matcher: ["/admin/:path*"],
}
