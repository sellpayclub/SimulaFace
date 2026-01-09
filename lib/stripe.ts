import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  }
  return stripeInstance
}

// For backwards compatibility - use getStripe() instead
export const stripe = {
  get customers() {
    return getStripe().customers
  },
  get subscriptions() {
    return getStripe().subscriptions
  },
  get checkout() {
    return getStripe().checkout
  },
  get webhooks() {
    return getStripe().webhooks
  },
}

export const PLANS = {
  pro: {
    name: 'Profissional',
    price: 'R$ 197/mês',
    simulacoes: 100,
    features: [
      '100 simulações por mês',
      'Histórico completo',
      'Exportar resultados em alta qualidade',
      'Suporte prioritário',
    ],
  },
  enterprise: {
    name: 'Clínica',
    price: 'R$ 497/mês',
    simulacoes: 500,
    features: [
      '500 simulações por mês',
      'Múltiplos usuários',
      'Marca personalizada',
      'API de integração',
      'Suporte dedicado',
    ],
  },
}
