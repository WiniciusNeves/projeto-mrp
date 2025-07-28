// frontend/src/app/layout.tsx
import './globals.css'; // Importa os estilos globais (Tailwind CSS)
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sistema MRP Simples',
  description: 'Sistema de Planejamento de Necessidades de Materiais',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    MRP Simples
                </Link>
                <div className="space-x-4">
                    <Link href="/estoque" className="hover:text-blue-200 transition-colors duration-200">
                        Estoque
                    </Link>
                    <Link href="/mrp" className="hover:text-blue-200 transition-colors duration-200">
                        MRP
                    </Link>
                </div>
            </nav>
        </header>

        <main className="flex-grow container mx-auto p-4 py-8">
            {children} {/* Aqui é onde o conteúdo das suas páginas será renderizado */}
        </main>

        <footer className="bg-gray-800 text-white p-4 text-center mt-auto"> {/* mt-auto para empurrar para baixo */}
            <div className="container mx-auto">
                <p>&copy; {new Date().getFullYear()} Sistema MRP. Todos os direitos reservados. Winicius Neves</p>
            </div>
        </footer>
      </body>
    </html>
  );
}