import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { access_token, refresh_token } = req.body;
  if (!access_token || !refresh_token) {
    return res.status(400).json({ error: 'Missing tokens' });
  }
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          // req.cookies is an object: { [key: string]: string }
          return Object.entries(req.cookies || {}).map(([name, value]) => ({ name, value: value ?? '' }));
        },
        setAll(cookiesToSet) {
          // Accumulate all cookies in an array and set them at once
          const setCookies = cookiesToSet.map(({ name, value }) => `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`);
          res.setHeader('Set-Cookie', setCookies);
        },
      },
    }
  );
  await supabase.auth.setSession({ access_token, refresh_token });
  res.status(200).json({ success: true });
}
