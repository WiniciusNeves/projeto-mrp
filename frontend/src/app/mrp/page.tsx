// frontend/src/app/mrp/page.tsx
'use client'; // Marque como Client Component

import { useState } from 'react';

interface MrpResult {
    'Componente': string;
    'Necessario': number;
    'Em Estoque': number;
    'A Comprar': number;
}

const MrpPage: React.FC = () => {
    const [bikes, setBikes] = useState<number | string>(0);
    const [computers, setComputers] = useState<number | string>(0);
    const [mrpResults, setMrpResults] = useState<MrpResult[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState<boolean>(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Sua URL do backend PHP

    const handleCalculateMrp = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsError(false);

        const bikeCount = parseInt(bikes as string);
        const computerCount = parseInt(computers as string);

        if (isNaN(bikeCount) || isNaN(computerCount) || bikeCount < 0 || computerCount < 0) {
            setMessage('As quantidades de produção não podem ser negativas ou inválidas.');
            setIsError(true);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/mrp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bikes: bikeCount, computers: computerCount }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMrpResults(data.data);
                setMessage('Cálculo MRP realizado com sucesso!');
                setIsError(false);
            } else {
                throw new Error(data.message || 'Ocorreu um erro ao calcular o MRP.');
            }
        } catch (error: any) {
            setMessage(`Erro ao calcular MRP: ${error.message}`);
            setIsError(true);
            console.error('Erro ao calcular MRP:', error);
            setMrpResults([]);
        }
    };

    return (
        <> {/* Fragmento, pois o layout já está no layout.tsx pai */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Planejamento de Necessidades de Materiais (MRP)</h1>

            {message && (
                <div className={`p-3 mb-4 rounded ${isError ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Demanda de Produção</h2>
                <form onSubmit={handleCalculateMrp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="bikes" className="block text-sm font-medium text-gray-700 mb-1">Bicicletas a Montar:</label>
                        <input
                            type="number"
                            id="bikes"
                            value={bikes}
                            onChange={(e) => setBikes(e.target.value)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            min="0"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="computers" className="block text-sm font-medium text-gray-700 mb-1">Computadores a Montar:</label>
                        <input
                            type="number"
                            id="computers"
                            value={computers}
                            onChange={(e) => setComputers(e.target.value)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            min="0"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                            Calcular Necessidades MRP
                        </button>
                    </div>
                </form>
            </div>

            {mrpResults.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Resultados do Cálculo MRP</h2>
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Componente</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Necessário</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Em Estoque</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">A Comprar</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mrpResults.map((result, index) => (
                                    <tr key={index} className={result['A Comprar'] > 0 ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result['Componente']}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{result['Necessario']}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{result['Em Estoque']}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${result['A Comprar'] > 0 ? 'font-bold text-red-600' : 'text-gray-700'}`}>
                                            {result['A Comprar']} {result['A Comprar'] > 0 ? '⚠️' : ''}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default MrpPage;
