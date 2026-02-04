// app/api/profile/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const username = params.username

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data: links } = await supabaseAdmin
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .order('order', { ascending: true })

  return NextResponse.json({ profile, links: links || [] })
}
