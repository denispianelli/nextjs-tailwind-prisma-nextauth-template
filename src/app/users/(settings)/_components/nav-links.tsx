'use client';

import { CircleUserRound, KeyRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';

const links = [
  { name: 'Profile', href: '/users/profile/edit', icon: CircleUserRound },
  { name: 'Password', href: '/users/edit', icon: KeyRound },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx('flex items-center gap-2', {
              'font-semibold text-primary': isActive,
            })}
          >
            <LinkIcon size={20} />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
