import 'server-only';
import type { Tarefa } from './schema';

const globalForStore = globalThis as unknown as {
  __tarefasStore?: Map<string, Tarefa>;
};

const tarefas: Map<string, Tarefa> =
  globalForStore.__tarefasStore ?? new Map<string, Tarefa>();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.__tarefasStore = tarefas;
}

export function criar(input: { titulo: string; descricao?: string }): Tarefa {
  const tarefa: Tarefa = {
    id: crypto.randomUUID(),
    titulo: input.titulo,
    descricao: input.descricao,
    dataCriacao: new Date(),
  };
  tarefas.set(tarefa.id, tarefa);
  return tarefa;
}

export function obterPorId(id: string): Tarefa | undefined {
  return tarefas.get(id);
}

export function atualizar(
  id: string,
  patch: Partial<Pick<Tarefa, 'titulo' | 'descricao'>>,
): Tarefa | undefined {
  const atual = tarefas.get(id);
  if (!atual) return undefined;
  const atualizado: Tarefa = {
    ...atual,
    ...(patch.titulo !== undefined ? { titulo: patch.titulo } : {}),
    ...(patch.descricao !== undefined ? { descricao: patch.descricao } : {}),
  };
  tarefas.set(id, atualizado);
  return atualizado;
}

export function deletar(id: string): boolean {
  return tarefas.delete(id);
}

export function listar(input: {
  limit: number;
  cursor?: string;
}): { items: Tarefa[]; nextCursor: string | null } {
  const ordenados = [...tarefas.values()].reverse();

  const indexInicial = input.cursor
    ? ordenados.findIndex((t) => t.id === input.cursor)
    : 0;
  if (indexInicial === -1) return { items: [], nextCursor: null };

  const fatia = ordenados.slice(indexInicial, indexInicial + input.limit + 1);
  const temMais = fatia.length > input.limit;
  const items = temMais ? fatia.slice(0, input.limit) : fatia;
  const nextCursor = temMais ? fatia[input.limit].id : null;

  return { items, nextCursor };
}
