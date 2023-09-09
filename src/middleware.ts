import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    
    const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail'

    const token = request.cookies.get('token')?.value || ''

    // A user who is already logged in and has auth token should not be able to access login and signup pages again because he has already done both of those tasks
    if(isPublicPath && token) {
        return NextResponse.redirect(new URL('/',request.nextUrl))
    }

    if(!isPublicPath && !token) {
        // Here request.nextUrl is used so that it automatically moves to the next url mentioned in the first argument of the redirect method
        return NextResponse.redirect(new URL('/login',request.nextUrl))

    }

    

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/verifyemail'
  ],
}