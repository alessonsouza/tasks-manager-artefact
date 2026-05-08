import { TRPCError } from '@trpc/server';
import {
  atualizarTarefaInput,
  criarTarefaInput,
  deletarTarefaInput,
  listarTarefasInput,
  obterTarefaInput,
} from '@/server/tarefas/schema';
import * as store from '@/server/tarefas/store';
import { baseProcedure, createTRPCRouter } from '../init';

export const tarefasRouter = createTRPCRouter({
  listar: baseProcedure.input(listarTarefasInput).query(({ input }) => {
    return store.listar(input);
  }),

  obter: baseProcedure.input(obterTarefaInput).query(({ input }) => {
    const tarefa = store.obterPorId(input.id);
    if (!tarefa) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Tarefa não encontrada',
      });
    }
    return tarefa;
  }),

  criar: baseProcedure.input(criarTarefaInput).mutation(({ input }) => {
    return store.criar(input);
  }),

  atualizar: baseProcedure.input(atualizarTarefaInput).mutation(({ input }) => {
    const { id, ...patch } = input;
    const tarefa = store.atualizar(id, patch);
    if (!tarefa) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Tarefa não encontrada',
      });
    }
    return tarefa;
  }),

  deletar: baseProcedure.input(deletarTarefaInput).mutation(({ input }) => {
    const ok = store.deletar(input.id);
    if (!ok) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Tarefa não encontrada',
      });
    }
    return { id: input.id };
  }),
});
