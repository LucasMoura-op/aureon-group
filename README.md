# AUREON GROUP

Sistema profissional de inteligencia patrimonial, obras, simulacoes financeiras e apoio a tomada de decisao.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Prisma ORM
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Row Level Security
- Recharts
- React Hook Form
- Zod
- TanStack Table
- Zustand
- API Routes
- Vercel-ready

## Seguranca

O login esta preparado para Supabase Auth. Em producao, configure as variaveis de ambiente no Vercel:

```bash
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

Senhas nao sao armazenadas pela aplicacao. O Supabase Auth cuida do hash/criptografia de credenciais e sessao.

O isolamento por organizacao e permissoes esta modelado no Prisma e preparado no SQL de RLS:

```bash
prisma/supabase-rls.sql
```

## Criptografia

- Credenciais: gerenciadas pelo Supabase Auth.
- Trafego: HTTPS/TLS em Supabase e Vercel.
- Banco: Supabase PostgreSQL com criptografia em repouso conforme infraestrutura Supabase.
- Dados sensiveis por campo: ainda nao ha criptografia field-level customizada. Se necessario, implementar antes de guardar documentos ou dados altamente sensiveis.

## Deploy Vercel

1. Crie um projeto no Supabase.
2. Configure as variaveis de ambiente no Vercel.
3. Rode as migrations do Prisma.
4. Execute o SQL de RLS no Supabase.
5. Publique pelo Vercel conectado ao repositorio GitHub.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npx prisma generate
npx prisma migrate dev
```
