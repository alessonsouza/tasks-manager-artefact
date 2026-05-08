import { createTRPCRouter } from '../init';
import { tarefasRouter } from './tarefas';

export const appRouter = createTRPCRouter({
  tarefas: tarefasRouter,
});

export type AppRouter = typeof appRouter;
