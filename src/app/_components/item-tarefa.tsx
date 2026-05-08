'use client';

import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import type { Tarefa } from '@/server/tarefas/schema';

export function ItemTarefa({ tarefa }: { tarefa: Tarefa }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deletar = useMutation(
    trpc.tarefas.deletar.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tarefas.pathFilter());
      },
    }),
  );

  return (
    <li className="flex items-start justify-between rounded border border-gray-200 bg-white p-4 shadow-sm">
      <div className="min-w-0 flex-1">
        <h3 className="font-medium">{tarefa.titulo}</h3>
        {tarefa.descricao && (
          <p className="mt-1 text-sm text-gray-600">{tarefa.descricao}</p>
        )}
        <p className="mt-2 text-xs text-gray-400">
          Criada em {tarefa.dataCriacao.toLocaleString('pt-BR')}
        </p>
        {deletar.isError && (
          <p className="mt-2 text-xs text-red-600">
            Erro ao excluir: {deletar.error.message}
          </p>
        )}
      </div>

      <div className="ml-4 flex shrink-0 gap-2">
        <Link
          href={`/tarefas/${tarefa.id}/editar`}
          className="rounded border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
        >
          Editar
        </Link>
        <button
          type="button"
          onClick={() => deletar.mutate({ id: tarefa.id })}
          disabled={deletar.isPending}
          className="rounded border border-red-300 px-3 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          {deletar.isPending ? 'Excluindo…' : 'Excluir'}
        </button>
      </div>
    </li>
  );
}
