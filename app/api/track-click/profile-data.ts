import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { username, linkId } = await req.json()

    await supabaseAdmin
      .from('analytics')
      .insert({
        username,
        link_id: linkId,
        type: 'click',
        timestamp: new Date().toISOString(),
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track click error:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}
