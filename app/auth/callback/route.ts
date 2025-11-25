import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/signin';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Successfully verified - redirect to sign in with success message
      return NextResponse.redirect(new URL('/signin?verified=true', requestUrl.origin));
    }
  }

  // If there's an error or no code, redirect to signin with error
  return NextResponse.redirect(new URL('/signin?error=verification_failed', requestUrl.origin));
}
