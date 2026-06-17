import {
  Package,
  Package2,
  Droplets,
  Stethoscope,
  Store,
  Warehouse,
  Truck,
  Wrench,
  HardHat,
  Box,
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  package: Package,
  package2: Package2,
  droplets: Droplets,
  stethoscope: Stethoscope,
  store: Store,
  warehouse: Warehouse,
  truck: Truck,
  wrench: Wrench,
  'hard-hat': HardHat,
};

export function getLocationIcon(icon: string): LucideIcon {
  return ICON_MAP[icon] ?? Box;
}

export const STATUS_COLOR_CLASSES: Record<string, string> = {
  green: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30',
  yellow: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  red: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
  blue: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
  gray: 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30',
};

export const STATUS_COLOR_OPTIONS = ['green', 'yellow', 'red', 'blue', 'gray'];
