# Checklist de Variáveis de Ambiente no Vercel

## Variáveis Obrigatórias

Verifique se todas as seguintes variáveis estão configuradas no Vercel Dashboard (Settings → Environment Variables):

### Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Chave de service role (opcional, mas recomendado)

### fal.ai
- [ ] `FAL_KEY` - Chave da API do fal.ai para processamento de imagens

### App
- [ ] `NEXT_PUBLIC_APP_URL` - URL base da aplicação (ex: `https://seu-app.vercel.app`)

## Como Verificar

1. Acesse o Vercel Dashboard: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Verifique se todas as variáveis acima estão presentes
5. Certifique-se de que estão configuradas para os ambientes corretos (Production, Preview, Development)

## Observações

- Variáveis que começam com `NEXT_PUBLIC_` são expostas ao cliente e devem ser públicas
- `SUPABASE_SERVICE_ROLE_KEY` é sensível e não deve ser exposta ao cliente
- `FAL_KEY` é sensível e não deve ser exposta ao cliente
- Após adicionar/modificar variáveis, pode ser necessário fazer um redeploy
