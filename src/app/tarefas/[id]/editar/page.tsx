import Link from 'next/link';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { CarregadorEdicao } from '@/app/_components/carregador-edicao';
import { getQueryClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic';

export default async function EditarTarefaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.tarefas.obter.queryOptions({ id }));

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6">
        <Link
          href="/tarefas"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Voltar
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Editar tarefa</h1>
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <CarregadorEdicao id={id} />
      </HydrationBoundary>
    </main>
  );
}
