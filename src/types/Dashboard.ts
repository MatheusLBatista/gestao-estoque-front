import { LucideIcon } from "lucide-react";

export interface StatCard {
  id: string;
  title: string;
  value: string;
  icon: LucideIcon;
}

export interface ModuleCard {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
  href?: string;
  onClick?: () => void;
}