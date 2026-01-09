import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Lazy initialization for supabaseAdmin
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const supabaseAdmin = getSupabaseAdmin()
  
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventData = event.data.object as any

    switch (event.type) {
      case 'checkout.session.completed': {
        const userId = eventData.metadata?.supabase_user_id

        if (userId && eventData.subscription) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(
            eventData.subscription as string
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ) as any

          // Determine plan based on price
          const priceId = subscription.items.data[0].price.id
          const plan = priceId === process.env.STRIPE_PRICE_ID_PRO ? 'pro' : 'enterprise'
          const simulacoes = plan === 'pro' ? 100 : 500

          // Update profile
          await supabaseAdmin
            .from('profiles')
            .update({
              plano: plan,
              simulacoes_restantes: simulacoes,
            })
            .eq('id', userId)

          // Create subscription record
          await supabaseAdmin.from('subscriptions').insert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            plano: plan,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        if (eventData.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            eventData.subscription as string
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ) as any
          
          // Find user by stripe customer id
          const { data: profiles } = await supabaseAdmin
            .from('profiles')
            .select('id, plano')
            .eq('stripe_customer_id', eventData.customer as string)

          if (profiles && profiles.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const profile = profiles[0] as any
            const simulacoes = profile.plano === 'pro' ? 100 : 500

            // Reset monthly simulations
            await supabaseAdmin
              .from('profiles')
              .update({ simulacoes_restantes: simulacoes })
              .eq('id', profile.id)

            // Update subscription
            await supabaseAdmin
              .from('subscriptions')
              .update({
                status: subscription.status,
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              })
              .eq('stripe_subscription_id', subscription.id)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        // Find user and downgrade
        const { data: subscriptions } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', eventData.id)

        if (subscriptions && subscriptions.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const userId = (subscriptions[0] as any).user_id

          // Downgrade to free
          await supabaseAdmin
            .from('profiles')
            .update({
              plano: 'free',
              simulacoes_restantes: 3,
            })
            .eq('id', userId)

          // Update subscription status
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('stripe_subscription_id', eventData.id)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
