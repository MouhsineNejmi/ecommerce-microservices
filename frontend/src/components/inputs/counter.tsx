import { Minus, Plus } from 'lucide-react';
import React from 'react';

interface CounterProps {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
}

export const Counter: React.FC<CounterProps> = ({
  title,
  subtitle,
  value,
  onChange,
}) => {
  const onAdd = () => {
    onChange(value + 1);
  };

  const onReduce = () => {
    if (value === 1) return;
    onChange(value - 1);
  };

  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-col'>
        <h3 className='text-sm font-medium'>{title}</h3>
        <p className='text-sm text-neutral-500'>{subtitle}</p>
      </div>

      <div className='flex flex-row items-center gap-4'>
        <button
          onClick={onReduce}
          className='w-8 h-8 rounded-full border border-neutral-400 text-neutral-600 flex justify-center items-center hover:opacity-80 transition'
        >
          <Minus />
        </button>
        <h4 className='font-light text-neutral-800'>{value}</h4>
        <button
          onClick={onAdd}
          className='w-8 h-8 rounded-full border border-neutral-400 text-neutral-600 flex justify-center items-center hover:opacity-80 transition'
        >
          <Plus />
        </button>
      </div>
    </div>
  );
};
