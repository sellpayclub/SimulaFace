# SimulaFace 🪞

Um SaaS PWA para clínicas de estética que permite simular resultados de procedimentos estéticos usando inteligência artificial.

## ✨ Funcionalidades

- 📸 **Captura de Fotos** - Tire fotos com a câmera ou faça upload de imagens existentes
- 🎚️ **Ajustes Faciais** - Selecione áreas específicas do rosto (nariz, boca, queixo, etc.) com controle de intensidade 0-100%
- 🤖 **IA Avançada** - Processamento de imagens usando fal.ai (Flux 2)
- 🔄 **Comparação Antes/Depois** - Visualize resultados com slider interativo
- 📱 **PWA** - Funciona como app no celular via navegador
- 💳 **Assinaturas** - Integração com Stripe para planos mensais
- 📊 **Histórico** - Salve e reveja simulações anteriores

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Estilização**: Tailwind CSS + Framer Motion
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Pagamentos**: Stripe
- **API de IA**: fal.ai
- **PWA**: next-pwa

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Conta no Stripe
- Chave API do fal.ai

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/simulaface.git
cd simulaface
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id

# fal.ai
FAL_KEY=your_fal_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Configure o banco de dados Supabase:
   - Acesse o SQL Editor no Supabase Dashboard
   - Execute o script `supabase-schema.sql`

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse `http://localhost:3000`

### Gerando Ícones PWA

Para gerar os ícones PNG a partir do SVG:

```bash
npm install sharp --save-dev
node scripts/generate-icons.js
```

## 📁 Estrutura do Projeto

```
simulaface/
├── app/
│   ├── (auth)/           # Páginas de autenticação
│   │   ├── login/
│   │   └── cadastro/
│   ├── (dashboard)/      # Páginas protegidas
│   │   ├── dashboard/
│   │   ├── captura/
│   │   ├── ajustes/
│   │   ├── resultado/
│   │   └── historico/
│   ├── api/              # API Routes
│   │   ├── transform/    # Integração fal.ai
│   │   └── stripe/       # Webhooks Stripe
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Componentes base
│   ├── camera/           # Captura de fotos
│   ├── adjustments/      # Controles de ajuste
│   ├── comparison/       # Slider antes/depois
│   └── layout/           # Header, Footer
├── lib/
│   ├── supabase/         # Cliente Supabase
│   ├── stripe.ts         # Config Stripe
│   ├── fal.ts            # Integração fal.ai
│   ├── store.ts          # Zustand store
│   └── facial-areas.ts   # Dados das áreas faciais
├── types/                # TypeScript types
└── public/
    ├── icons/            # Ícones PWA
    └── manifest.json     # PWA manifest
```

## 🎨 Paleta de Cores

- **Primary**: Rosa (#E8B4BC) / Rose Gold (#B76E79)
- **Secondary**: Branco cremoso (#FFF8F0)
- **Accent**: Dourado (#D4A574)
- **Text**: Cinza escuro (#2D2D2D)

## 📝 Áreas Faciais Disponíveis

| Área | Opções de Ajuste |
|------|------------------|
| Testa | Reduzir rugas, Suavizar linhas |
| Olhos | Reduzir pé de galinha, Levantar pálpebra |
| Nariz | Afinar, Empinar, Reduzir, Engrossar |
| Boca | Aumentar volume, Definir contorno |
| Sulco Nasogeniano | Suavizar, Preencher |
| Maçã do Rosto | Aumentar volume, Definir |
| Queixo | Projetar, Reduzir, Definir |
| Mandíbula | Afinar, Definir ângulo |
| Pescoço | Reduzir papada, Definir |

## 🔒 Segurança

- API key do fal.ai armazenada apenas no servidor
- Validação de assinatura ativa antes de processar
- Row Level Security no Supabase
- Sanitização de inputs

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

Desenvolvido com ❤️ para clínicas de estética
