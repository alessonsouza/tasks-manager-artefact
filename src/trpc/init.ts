import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

export const createTRPCContext = async (_opts: { headers: Headers }) => {
  return {};
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    transformer: superjson,
  });

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
