import { StatCard as StatCardType } from "@/types/Dashboard";

interface StatCardProps {
  card: StatCardType;
}

export default function StatCard({ card }: StatCardProps) {
  const { title, value, icon: Icon } = card;
  
  // Ajusta o tamanho da fonte baseado no comprimento do valor
  const getValueSize = (value: string) => {
    if (value.includes('R$')) return 'text-2xl';
    return 'text-4xl';
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-white min-h-[120px] flex items-center cursor-pointer">
      <div className="flex items-center space-x-4 w-full">
        <Icon className="w-12 h-12" />
        <div>
          <h3 className="text-xl font-medium">{title}</h3>
          <p className={`${getValueSize(value)} font-bold`}>{value}</p>
        </div>
      </div>
    </div>
  );
}