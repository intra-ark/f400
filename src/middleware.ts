import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token,
    },
    pages: {
        signIn: '/login',
    }
});

// Protect all routes except login and auth API
export const config = {
    matcher: [
        '/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)',
    ]
};
