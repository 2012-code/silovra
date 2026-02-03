import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Gumroad sends different events
    // https://help.gumroad.com/article/266-gumroad-ping
    
    if (body.sale_id) {
      // This is a sale notification
      const email = body.email
      const productPermalink = body.product_permalink

      // Verify it's the right product
      if (productPermalink !== process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_PERMALINK) {
        return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
      }

      // Find user by email
      const { data: user } = await supabaseAdmin.auth.admin.listUsers()
      const targetUser = user.users.find(u => u.email === email)

      if (!targetUser) {
        console.log('User not found for email:', email)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Update user to Pro
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

    // Handle refunds
    if (body.refunded === 'true' || body.disputed === 'true' || body.chargebacked === 'true') {
      const saleId = body.sale_id

      // Downgrade user
      await supabaseAdmin
        .from('profiles')
        .update({ 
          is_pro: false,
          updated_at: new Date().toISOString(),
        })
        .eq('gumroad_sale_id', saleId)

      console.log('User downgraded from Pro:', saleId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Gumroad webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
