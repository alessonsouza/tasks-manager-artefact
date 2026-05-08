import Link from 'next/link';
import { FormularioTarefa } from '@/app/_components/formulario-tarefa';

export default function NovaTarefaPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6">
        <Link
          href="/tarefas"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Voltar
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Nova tarefa</h1>
      </header>

      <FormularioTarefa modo="criar" />
    </main>
  );
}
