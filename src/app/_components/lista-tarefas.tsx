'use client';

import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { ItemTarefa } from './item-tarefa';

export function ListaTarefas() {
  const trpc = useTRPC();
  const sentinelaRef = useRef<HTMLDivElement>(null);

  const query = useInfiniteQuery(
    trpc.tarefas.listar.infiniteQueryOptions(
      { limit: 10 },
      {
        initialCursor: null,
        getNextPageParam: (last) => last.nextCursor ?? undefined,
      },
    ),
  );

  const tarefas = query.data?.pages.flatMap((p) => p.items) ?? [];

  useEffect(() => {
    const el = sentinelaRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          query.hasNextPage &&
          !query.isFetchingNextPage
        ) {
          void query.fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  if (query.isPending) {
    return <p className="text-sm text-gray-500">Carregando…</p>;
  }

  if (query.isError) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        Erro ao carregar tarefas: {query.error.message}
      </div>
    );
  }

  if (tarefas.length === 0) {
    return (
      <p className="rounded border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        Nenhuma tarefa cadastrada ainda.
      </p>
    );
  }

  return (
    <div>
      <ul className="space-y-3">
        {tarefas.map((tarefa) => (
          <ItemTarefa key={tarefa.id} tarefa={tarefa} />
        ))}
      </ul>

      <div ref={sentinelaRef} className="h-8" />

      {query.isFetchingNextPage && (
        <p className="mt-4 text-center text-sm text-gray-500">
          Carregando mais…
        </p>
      )}
      {!query.hasNextPage && tarefas.length > 0 && (
        <p className="mt-4 text-center text-xs text-gray-400">Fim da lista.</p>
      )}
    </div>
  );
}
