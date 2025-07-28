// frontend/src/app/estoque/page.tsx
'use client'; // Marque como Client Component para usar useState, useEffect etc.

import { useState, useEffect } from 'react';

interface Component {
    id: number;
    name: string;
    stock_quantity: number;
}

const EstoquePage: React.FC = () => {
    const [components, setComponents] = useState<Component[]>([]);
    const [name, setName] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false); // Estado para o modal de confirmação
    const [componentToDelete, setComponentToDelete] = useState<Component | null>(null); // Componente a ser deletado

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Função para buscar os componentes do backend
    const fetchComponents = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/estoque`);
            if (!res.ok) {
                throw new Error(`Erro HTTP: ${res.status}`);
            }
            const data = await res.json();
            if (data.success) {
                setComponents(data.data);
            } else {
                throw new Error(data.message || 'Erro ao buscar componentes.');
            }
        } catch (error: any) {
            setMessage(`Erro ao buscar estoque: ${error.message}`);
            setIsError(true);
            console.error('Erro ao buscar estoque:', error);
        }
    };

    // Carrega os componentes ao montar a página
    useEffect(() => {
        fetchComponents();
    }, []);

    // Função para lidar com o envio do formulário (criar/atualizar)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null); // Limpa mensagens anteriores
        setIsError(false);

        if (!name.trim() || quantity < 0) {
            setMessage('Por favor, preencha o nome e uma quantidade válida (não negativa).');
            setIsError(true);
            return;
        }

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE_URL}/estoque/${editingId}` : `${API_BASE_URL}/estoque`;
        const body = {
            name: name,
            stock_quantity: quantity
        };

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage(data.message || (editingId ? 'Estoque atualizado!' : 'Componente cadastrado!'));
                setIsError(false);
                fetchComponents(); // Atualiza a lista após a operação
                setName('');
                setQuantity(0);
                setEditingId(null);
            } else {
                throw new Error(data.message || 'Ocorreu um erro na operação.');
            }
        } catch (error: any) {
            setMessage(`Erro na operação: ${error.message}`);
            setIsError(true);
            console.error('Erro ao enviar formulário:', error);
        }
    };

    // Função para pré-popular o formulário ao clicar em "Editar"
    const handleEdit = (component: Component) => {
        setName(component.name);
        setQuantity(component.stock_quantity);
        setEditingId(component.id);
        setMessage(null);
        setIsError(false);
    };

    // Função para iniciar o processo de exclusão (abre o modal de confirmação)
    const handleDeleteClick = (component: Component) => {
        setComponentToDelete(component);
        setShowConfirmModal(true);
    };

    // Função para confirmar a exclusão
    const confirmDelete = async () => {
        if (!componentToDelete) return;

        setMessage(null);
        setIsError(false);
        setShowConfirmModal(false); // Fecha o modal

        try {
            const res = await fetch(`${API_BASE_URL}/estoque/${componentToDelete.id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage(data.message || `Componente "${componentToDelete.name}" excluído com sucesso!`);
                setIsError(false);
                fetchComponents(); // Atualiza a lista

                // Se o componente deletado era o que estava sendo editado, reseta o formulário de edição
                if (editingId === componentToDelete.id) {
                    setEditingId(null);
                    setName('');
                    setQuantity(0);
                }

            } else {
                throw new Error(data.message || 'Ocorreu um erro ao excluir o componente.');
            }
        } catch (error: any) {
            setMessage(`Erro ao excluir: ${error.message}`);
            setIsError(true);
            console.error('Erro ao excluir componente:', error);
        } finally {
            setComponentToDelete(null); // Limpa o componente a ser deletado
        }
    };

    // Função para cancelar a exclusão
    const cancelDelete = () => {
        setShowConfirmModal(false);
        setComponentToDelete(null);
    };

    return (
        <> {/* Fragmento, pois o layout já está no layout.tsx pai */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gerenciamento de Estoque</h1>

            {message && (
                <div className={`p-3 mb-4 rounded ${isError ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md mb-8 ">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">{editingId ? 'Editar Componente' : 'Cadastrar Novo Componente'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Componente:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={!!editingId} // Desabilita o campo nome ao editar (para manter a consistência da API)
                        />
                        {editingId && <p className="text-sm text-gray-500 mt-1">O nome não pode ser alterado ao editar.</p>}
                    </div>
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantidade em Estoque:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                            {editingId ? 'Atualizar Estoque' : 'Cadastrar Componente'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setName('');
                                    setQuantity(0);
                                    setMessage(null);
                                    setIsError(false);
                                }}
                                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Estoque Atual dos Componentes</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                {components.length === 0 && !message && (
                    <p className="p-4 text-gray-600">Nenhum componente cadastrado ainda. Cadastre um acima!</p>
                )}
                {components.length > 0 && (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Componente</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade em Estoque</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {components.map((component) => (
                                <tr key={component.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{component.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{component.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{component.stock_quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(component)}
                                            className="text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-600 rounded-md transition-colors duration-200"
                                        >
                                            Editar Quantidade
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(component)}
                                            className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-600 rounded-md transition-colors duration-200"
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal de Confirmação de Exclusão */}
            {showConfirmModal && componentToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Exclusão</h3>
                        <p className="text-gray-700 mb-6">
                            Tem certeza que deseja excluir o componente "<strong>{componentToDelete.name}</strong>"?
                            Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EstoquePage;
