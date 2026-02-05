import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle successful sale
    if (body.sale_id) {
      const email = body.email
      const productPermalink = body.product_permalink

      // Verify correct product
      if (productPermalink !== 'silovra-pro') {
        return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
      }

      // Find user by email
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const targetUser = users?.users.find(u => u.email === email)

      if (!targetUser) {
        console.log('User not found:', email)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Upgrade to Pro
      await supabaseAdmin
        .from('profiles')
        .update({ 
          is_pro: true,
          gumroad_sale_id: body.sale_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUser.id)

      console.log('User upgraded to Pro:', email)
      return NextResponse.json({ success: true })
    }

    // Handle refunds/disputes/chargebacks
    if (body.refunded === 'true' || body.disputed === 'true' || body.chargebacked === 'true') {
      const saleId = body.sale_id

      await supabaseAdmin
        .from('profiles')
        .update({ 
          is_pro: false,
          updated_at: new Date().toISOString(),
        })
        .eq('gumroad_sale_id', saleId)

      console.log('User downgraded:', saleId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Gumroad webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook failed' },
      { status: 500 }
    )
  }
}
