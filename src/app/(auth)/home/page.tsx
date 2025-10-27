"use client"

import UserMenu from "@/components/layout/header/user-menu";
import Footer from "@/components/layout/footer";
import StatCard from "@/components/dashboard/StatCard";
import ModuleCard from "@/components/dashboard/ModuleCard";
import DashboardNavigation from "@/components/dashboard/navigation";

export default function Home() {
  const { statCards, moduleCards } = DashboardNavigation();

  return (
    <div>
      <main className="min-h-screen bg-gradient-to-br from-[#0042D9] via-[#0042D9]/90 to-[#0042D9]/70 p-6 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">Gestão de Estoque</h1>
            <UserMenu />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {statCards.map((card) => (
                <StatCard key={card.id} card={card} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {moduleCards.map((card) => (
                <ModuleCard key={card.id} card={card} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>


  )
}