import Image from 'next/image';

type ListingCategoryProps = {
  icon: string;
  name: string;
};

export const ListingCategory = ({ icon, name }: ListingCategoryProps) => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-row items-center gap-4'>
        <Image
          src={icon}
          alt={name}
          width={20}
          height={20}
          className='text-neutral-600'
        />

        <h4 className='text-lg font-semibold'>{name}</h4>
      </div>
    </div>
  );
};
