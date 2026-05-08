# tasks-manager-artefact

CRUD de tarefas em memoria com Next.js + tRPC. Resposta do desafio.

## rodar

```
bun install
bun run dev
```

Abre em http://localhost:3000.

## stack

- Next 16
- tRPC 11 + tanstack-react-query 5
- Zod 4
- Tailwind 4
- TypeScript

## estrutura

```
src/
  server/tarefas/   schema (zod) e store em memoria (Map)
  trpc/             config do trpc, router de tarefas
  app/
    api/trpc/       route handler
    tarefas/        listagem (SSR + scroll infinito), nova, [id]/editar
    _components/    lista, item, formulario
```

## notas

- Store em memoria: zera quando o processo reinicia.
- Listagem usa cursor pagination + useInfiniteQuery + IntersectionObserver.
- superjson como transformer pra Date atravessar o SSR.
