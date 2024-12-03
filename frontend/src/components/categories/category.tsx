import Image from 'next/image';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryProps {
  icon: string;
  name: string;
  selected?: boolean;
}

export const Category: React.FC<CategoryProps> = ({ icon, name, selected }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    const category = name.toLowerCase();
    router.push(`/?category=${category}`);
  }, [name, router]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer 
        ${selected ? 'border-b-neutral-800' : 'border-transparent'}
        ${selected ? 'text-neutral-800' : 'text-neutral-500'}
      `}
    >
      <Image src={icon} alt={name} width={20} height={20} />
      <h4 className='font-medium text-sm'>{name}</h4>
    </div>
  );
};
