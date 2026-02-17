'use client';

import AppHeader from '@/components/AppHeader';
import ContractForm from '@/components/ContractForm';

export default function GeneratorPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Nowa umowa</h1>
          <p className="text-sm text-white/50 mt-1">
            Rozbudowa instalacji PV o magazyn energii z falownikiem hybrydowym
          </p>
        </div>
        <ContractForm />
      </main>
    </>
  );
}
