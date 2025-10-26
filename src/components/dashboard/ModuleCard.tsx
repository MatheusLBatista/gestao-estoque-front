import { ModuleCard as ModuleCardType } from "@/types/Dashboard";

interface ModuleCardProps {
  card: ModuleCardType;
}

export default function ModuleCard({ card }: ModuleCardProps) {
  const { title, description, iconSrc, iconAlt, onClick, href } = card;

  const cardContent = (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-white hover:bg-white/15 transition-colors cursor-pointer min-h-[180px] flex items-center">
      <div className="flex items-center space-x-6 w-full">
        <div className="bg-white/20 p-6 rounded-xl flex items-center pl-8">
          <img src={iconSrc} alt={iconAlt} className="w-14 h-14" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <p className="text-white/80 text-lg">{description}</p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href}>
        {cardContent}
      </a>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick}>
        {cardContent}
      </div>
    );
  }

  return cardContent;
}