"use client"

import { Package, Store, FileText, Users } from "lucide-react"

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0042D9] via-[#0042D9]/90 to-[#0042D9]/70 p-6 flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                            <span className="text-[#0042D9] font-bold text-sm">H&R</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-white">João</span>
                        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                            <img src="/api/placeholder/40/40" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Content Container - Centralized */}
                <div className="flex-1 flex flex-col justify-center">
                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-white min-h-[120px] flex items-center">
                        <div className="flex items-center space-x-4 w-full">
                            <Package className="w-12 h-12" />
                            <div>
                                <h3 className="text-xl font-medium">Categoria</h3>
                                <p className="text-4xl font-bold">A</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-white min-h-[120px] flex items-center">
                        <div className="flex items-center space-x-4 w-full">
                            <Package className="w-12 h-12" />
                            <div>
                                <h3 className="text-xl font-medium">Categoria</h3>
                                <p className="text-4xl font-bold">B</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-white min-h-[120px] flex items-center">
                        <div className="flex items-center space-x-4 w-full">
                            <Package className="w-12 h-12" />
                            <div>
                                <h3 className="text-xl font-medium">Categoria</h3>
                                <p className="text-4xl font-bold">C</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-white min-h-[120px] flex items-center">
                        <div className="flex items-center space-x-4 w-full">
                            <FileText className="w-12 h-12" />
                            <div>
                                <h3 className="text-xl font-medium">Saídas</h3>
                                <p className="text-2xl font-bold">R$120.000,00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Produtos Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-white hover:bg-white/15 transition-colors cursor-pointer min-h-[180px] flex items-center">
                        <div className="flex items-center space-x-6 w-full">
                            <div className="bg-white/20 p-6 rounded-xl flex items-center pl-8">
                                <img src="/produtos_icon.png" alt="Produtos" className="w-14 h-14" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-3">Produtos</h2>
                                <p className="text-white/80 text-lg">Cadastre e gerencie seus produtos</p>
                            </div>
                        </div>
                    </div>

                    {/* Fornecedores Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-white hover:bg-white/15 transition-colors cursor-pointer min-h-[180px] flex items-center">
                        <div className="flex items-center space-x-6 w-full">
                            <div className="bg-white/20 p-6 rounded-xl flex items-center pl-8">
                                <img src="/fornecedores_icon.png" alt="Fornecedores" className="w-14 h-14" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-3">Fornecedores</h2>
                                <p className="text-white/80 text-lg">Acesse o cadastro de fornecedores</p>
                            </div>
                        </div>
                    </div>

                    {/* Movimentações Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-white hover:bg-white/15 transition-colors cursor-pointer min-h-[180px] flex items-center">
                        <div className="flex items-center space-x-6 w-full">
                            <div className="bg-white/20 p-6 rounded-xl flex items-center pl-8">
                                <img src="/movimentacoes_icon.png" alt="Movimentações" className="w-14 h-14" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-3">Movimentações</h2>
                                <p className="text-white/80 text-lg">Gerencie suas movimentações</p>
                            </div>
                        </div>
                    </div>

                    {/* Funcionários Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-white hover:bg-white/15 transition-colors cursor-pointer min-h-[180px] flex items-center">
                        <div className="flex items-center space-x-6 w-full">
                            <div className="bg-white/20 p-6 rounded-xl flex items-center pl-8">
                                <img src="/funcionarios_icon.png" alt="Funcionários" className="w-14 h-14" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-3">Funcionários</h2>
                                <p className="text-white/80 text-lg">Acesse o cadastro de funcionários</p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </main>
    )
}