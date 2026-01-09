'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Camera, 
  Sparkles, 
  SlidersHorizontal, 
  ArrowRight, 
  Check,
  Star,
  Shield,
  Zap
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button, Card } from '@/components/ui'
import { ImageComparison } from '@/components/comparison'

const features = [
  {
    icon: Camera,
    title: 'Conquiste a Confiança',
    description: 'Mostre exatamente o que sua paciente pode esperar. Quando ela vê o resultado, a venda acontece naturalmente.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Personalize Cada Detalhe',
    description: 'Ajuste nariz, lábios, queixo e mais. Sua paciente escolhe e você fecha o procedimento.',
  },
  {
    icon: Sparkles,
    title: 'Resultados Realistas',
    description: 'IA avançada que mantém a identidade. Nada de resultados artificiais que assustam a paciente.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Foto da paciente',
    description: 'Tire uma foto ou peça que ela envie. Simples e rápido.',
  },
  {
    number: '02',
    title: 'Simule o resultado',
    description: 'Ajuste nariz, lábios, queixo. A paciente escolhe o que quer.',
  },
  {
    number: '03',
    title: 'Feche a venda',
    description: 'Ela vê o resultado, se apaixona e fecha o procedimento.',
  },
]

const plans = [
  {
    name: 'Profissional',
    price: 'R$ 497',
    period: '/mês',
    description: 'Ideal para profissionais autônomos',
    features: [
      '100 simulações por mês',
      'Histórico completo',
      'Exportar em alta qualidade',
      'Suporte prioritário',
    ],
    highlighted: false,
  },
  {
    name: 'Clínica',
    price: 'R$ 997',
    period: '/mês',
    description: 'Para clínicas e equipes',
    features: [
      '500 simulações por mês',
      'Múltiplos usuários',
      'Relatórios avançados',
      'Suporte dedicado',
    ],
    highlighted: true,
  },
]

const testimonials = [
  {
    name: 'Dra. Ana Silva',
    role: 'Dermatologista',
    content: 'Minhas pacientes fecham na hora! Quando elas veem o resultado antes, não tem mais "vou pensar". A conversão triplicou.',
    avatar: '👩‍⚕️',
  },
  {
    name: 'Dr. Carlos Mendes',
    role: 'Cirurgião Plástico',
    content: 'Parei de perder tempo explicando. Mostro a simulação e a paciente já sai agendando. Ferramenta que se paga no primeiro procedimento.',
    avatar: '👨‍⚕️',
  },
  {
    name: 'Clínica Estética Bella',
    role: 'Clínica Premium',
    content: 'Faturamento subiu 40% no primeiro mês. As pacientes compartilham a simulação e ainda indicam amigas. Virou máquina de vendas.',
    avatar: '🏥',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-300 rounded-full blur-3xl opacity-20" />
          </div>

          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  Tecnologia de IA para estética facial
                </span>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                  Venda procedimentos{' '}
                  <span className="text-gradient">com muito mais facilidade</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                  Quando sua paciente visualiza o resultado antes, a decisão de compra se torna natural.
                  Aumente suas conversões e feche mais procedimentos com simulações realistas por IA.
                </p>
              </motion.div>

              {/* Hero Image - Before/After Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-12 relative"
              >
                <div className="max-w-2xl mx-auto">
                  {/* Text above slider */}
                  <p className="text-xl md:text-2xl font-serif font-bold text-gray-800 text-center mb-6">
                    Imagina sua paciente vendo o rosto dela{' '}
                    <span className="text-gradient">antes mesmo do procedimento:</span>
                  </p>
                  
                  {/* Before/After Slider */}
                  <div className="rounded-2xl shadow-2xl overflow-hidden border-4 border-white" style={{ height: '500px' }}>
                    <ImageComparison
                      beforeImage="https://fbyaqybbkfywfhgpjqwb.supabase.co/storage/v1/object/public/fotos/antes.png"
                      afterImage="https://fbyaqybbkfywfhgpjqwb.supabase.co/storage/v1/object/public/fotos/depois.png"
                      beforeLabel="Antes"
                      afterLabel="Depois"
                    />
                  </div>
                  
                  {/* AI Badge */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="px-4 py-2 rounded-full bg-primary-100 border border-primary-200">
                      <span className="text-sm text-primary-700 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Resultado gerado por Inteligência Artificial
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Floating badges */}
                <div className="absolute -left-4 top-1/4 glass p-3 rounded-xl shadow-lg hidden md:flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium">100% Seguro</span>
                </div>
                <div className="absolute -right-4 top-1/3 glass p-3 rounded-xl shadow-lg hidden md:flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent-500" />
                  <span className="text-sm font-medium">Resultado em segundos</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Por que clínicas vendem mais com o SimulaFace?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Paciente que vê o resultado antes, fecha o procedimento na hora.
                Sem objeções, sem "vou pensar", sem perder a venda.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card padding="lg" hoverable className="h-full text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-6">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="como-funciona" className="py-20 bg-secondary-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                3 Passos Para Fechar Mais Vendas
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Da foto ao fechamento em menos de 2 minutos.
                Sua paciente vê e decide na hora.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-primary-200" />
                  )}
                  <div className="text-center relative z-10">
                    <div className="w-24 h-24 mx-auto rounded-full bg-white border-4 border-primary-200 flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-3xl font-serif font-bold text-gradient">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="planos" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Investimento que se Paga no Primeiro Procedimento
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Uma única venda extra por mês já cobre o investimento.
                O resto é lucro.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    padding="lg"
                    className={`h-full ${
                      plan.highlighted
                        ? 'border-2 border-primary-400 shadow-xl relative'
                        : ''
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-white text-sm font-medium">
                        Mais Popular
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-500 mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-gray-500">{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-primary-600" />
                          </div>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/cadastro" className="block">
                      <Button
                        variant={plan.highlighted ? 'primary' : 'secondary'}
                        className="w-full"
                      >
                        Assinar Agora
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-secondary-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Quem usa, vende mais
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Veja o que profissionais como você estão dizendo.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card padding="lg" className="h-full">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-primary">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Quantos procedimentos você está deixando de vender?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Cada paciente que sai sem fechar é dinheiro perdido.
                Com o SimulaFace, ela vê o resultado e fecha na hora.
              </p>
              <Link href="#planos">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-primary-50"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Ver Planos
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
