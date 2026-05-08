import { z } from 'zod';

export const tarefaSchema = z.object({
  id: z.uuid(),
  titulo: z.string().min(1),
  descricao: z.string().optional(),
  dataCriacao: z.date(),
});

export const criarTarefaInput = z.object({
  titulo: z.string().trim().min(1, 'Título é obrigatório'),
  descricao: z.string().trim().optional(),
});

export const atualizarTarefaInput = z.object({
  id: z.uuid(),
  titulo: z.string().trim().min(1, 'Título é obrigatório').optional(),
  descricao: z.string().trim().optional(),
});

export const listarTarefasInput = z.object({
  limit: z.number().int().min(1).max(50).default(10),
  cursor: z.uuid().optional(),
});

export const deletarTarefaInput = z.object({
  id: z.uuid(),
});

export const obterTarefaInput = z.object({
  id: z.uuid(),
});

export type Tarefa = z.infer<typeof tarefaSchema>;
