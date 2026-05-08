import Link from 'next/link';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ListaTarefas } from '@/app/_components/lista-tarefas';
import { getQueryClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic';

export default async function TarefasPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(
    trpc.tarefas.listar.infiniteQueryOptions(
      { limit: 10 },
      {
        initialCursor: null,
        getNextPageParam: (last) => last.nextCursor ?? undefined,
      },
    ),
  );

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tarefas</h1>
        <Link
          href="/tarefas/nova"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nova tarefa
        </Link>
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ListaTarefas />
      </HydrationBoundary>
    </main>
  );
}
