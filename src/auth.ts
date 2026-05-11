import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

const protectedRoutes = ["/cart", "/checkout", "/orders", "/profile"];
const authRoutes = ["/login", "/register"];
const hasFacebookAuth =
  Boolean(process.env.AUTH_FACEBOOK_ID) &&
  Boolean(process.env.AUTH_FACEBOOK_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [Google, ...(hasFacebookAuth ? [Facebook] : [])],
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = Boolean(auth?.user);
      const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);

      if (isProtectedRoute) {
        return isLoggedIn;
      }

      if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
});
