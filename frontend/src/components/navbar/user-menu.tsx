'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  Heart,
  House,
  LogOut,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { User } from '@/types/user';

interface UserMenuProps {
  user?: User | null;
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const router = useRouter();

  if (!user) {
    return <Link href='/login'>Login</Link>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex items-center gap-4 cursor-pointer p-2 rounded-lg transition-colors hover:bg-slate-200'>
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className='rounded-lg'>
              {user?.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>{user?.name}</span>
            <span className='truncate text-xs'>{user?.email}</span>
          </div>
          <ChevronsUpDown className='ml-auto size-4' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
        align='end'
        sideOffset={4}
      >
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarFallback className='rounded-lg'>
                {user?.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>{user?.name}</span>
              <span className='truncate text-xs'>{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/favorites')}>
            <Heart />
            My Favorite Properties
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/my-properties')}>
            <House />
            My Properties
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/my-reservations')}>
            <CreditCard />
            My Reservation
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
