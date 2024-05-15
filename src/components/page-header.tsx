import Link from 'next/link';
import { LogOut, Menu, Package2, Search, Settings, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { auth, signOut } from '../auth';
import { ModeToggleButton } from './mode-toggle-button';

import { UserMenu } from './user-menu';
import { Separator } from './ui/separator';
import { ModeToggleSwitch } from './mode-toggle-switch';

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Orders
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Products
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Customers
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Analytics
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="text-md grid gap-6 font-medium">
            <SheetClose asChild>
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Orders
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Analytics
              </Link>
            </SheetClose>
            <Separator />
            <ModeToggleSwitch />
            <Separator />
            {session ? (
              <>
                <SheetClose asChild>
                  <Link
                    href="/users/profile/edit"
                    className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground"
                  >
                    Settings
                    <Settings size={20} />
                  </Link>
                </SheetClose>

                <form
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground"
                  action={async () => {
                    'use server';
                    await signOut();
                  }}
                >
                  <button>Logout</button>
                  <LogOut size={20} />
                </form>
              </>
            ) : (
              <SheetClose asChild>
                <Link
                  href="/login"
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground"
                >
                  Login
                  <User size={20} />
                </Link>
              </SheetClose>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <ModeToggleButton />
        {session ? (
          <UserMenu />
        ) : (
          <>
            <Button asChild variant="outline">
              <Link className="hidden md:block" href="/login">
                Login
              </Link>
            </Button>{' '}
            <Button asChild>
              <Link href="/sign_up">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
