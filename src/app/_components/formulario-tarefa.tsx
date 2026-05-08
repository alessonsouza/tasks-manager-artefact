'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import type { Tarefa } from '@/server/tarefas/schema';

const LABELS_SUBMIT = {
  criar: 'Criar tarefa',
  editar: 'Salvar alterações',
} as const;

type Props =
  | { modo: 'criar'; tarefaInicial?: never }
  | { modo: 'editar'; tarefaInicial: Tarefa };

export function FormularioTarefa(props: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const inicial = props.modo === 'editar' ? props.tarefaInicial : null;
  const [titulo, setTitulo] = useState(inicial?.titulo ?? '');
  const [descricao, setDescricao] = useState(inicial?.descricao ?? '');
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  const onSuccess = async () => {
    await queryClient.invalidateQueries(trpc.tarefas.pathFilter());
    router.push('/tarefas');
  };

  const criar = useMutation(trpc.tarefas.criar.mutationOptions({ onSuccess }));
  const atualizar = useMutation(
    trpc.tarefas.atualizar.mutationOptions({ onSuccess }),
  );
  const mutationAtiva = props.modo === 'criar' ? criar : atualizar;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroValidacao(null);

    const tituloLimpo = titulo.trim();
    if (tituloLimpo.length === 0) {
      setErroValidacao('Título é obrigatório');
      return;
    }
    const descricaoLimpa = descricao.trim() || undefined;

    if (props.modo === 'criar') {
      criar.mutate({ titulo: tituloLimpo, descricao: descricaoLimpa });
    } else {
      atualizar.mutate({
        id: props.tarefaInicial.id,
        titulo: tituloLimpo,
        descricao: descricaoLimpa,
      });
    }
  }

  const labelSubmit = mutationAtiva.isPending
    ? 'Salvando…'
    : LABELS_SUBMIT[props.modo];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium">
          Título <span className="text-red-600">*</span>
        </label>
        <input
          id="titulo"
          type="text"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          disabled={mutationAtiva.isPending}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="descricao"
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          disabled={mutationAtiva.isPending}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
        />
      </div>

      {erroValidacao && (
        <p className="text-sm text-red-600">{erroValidacao}</p>
      )}
      {mutationAtiva.isError && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {mutationAtiva.error.message}
        </div>
      )}

      <button
        type="submit"
        disabled={mutationAtiva.isPending}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {labelSubmit}
      </button>
    </form>
  );
}
