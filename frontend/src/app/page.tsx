// frontend/src/app/page.tsx
'use client'; // Marque como Client Component se usar hooks como useRouter

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importe de 'next/navigation' para App Router

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página de estoque ao carregar
    router.push('/estoque');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl text-gray-700">Redirecionando para a página de Estoque...</p>
    </div>
  );
}