import { getUser } from '@/lib/dal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { CircleUser, LogOut, Settings } from 'lucide-react';

import { signOut } from '@/auth';
import Link from 'next/link';

export async function UserMenu() {
  const user = await getUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name ?? undefined}
            />
            <AvatarFallback>
              {' '}
              <CircleUser className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/users/profile/edit">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" /> <button>Logout</button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
