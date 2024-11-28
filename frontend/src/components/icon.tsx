import { icons } from 'lucide-react';

export const Icon = ({
  name,
  color = 'currentColor',
  size = 14,
}: {
  name: string;
  color?: string;
  size?: number;
}) => {
  const LucideIcon = icons[name as keyof typeof icons];

  return <LucideIcon color={color} size={size} />;
};
