'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { FormularioTarefa } from './formulario-tarefa';

export function CarregadorEdicao({ id }: { id: string }) {
  const trpc = useTRPC();
  const query = useQuery(trpc.tarefas.obter.queryOptions({ id }));

  if (query.isPending) {
    return <p className="text-sm text-gray-500">Carregando…</p>;
  }

  if (query.isError) {
    return (
      <div className="space-y-3">
        <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {query.error.message}
        </div>
        <Link
          href="/tarefas"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          Voltar para a lista
        </Link>
      </div>
    );
  }

  return <FormularioTarefa modo="editar" tarefaInicial={query.data} />;
}
