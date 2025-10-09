'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Menu } from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  status?: 'implemented' | 'pending';
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', status: 'implemented' },
  { title: 'Kelompok 1 - Rental Baju', href: '/k1', status: 'implemented' },
  { title: 'Kelompok 2 - Tripnesia', href: '/k2', status: 'implemented' },
  { title: 'Kelompok 3 - GadgetHouse', href: '/k3', status: 'implemented' },
  { title: 'Kelompok 4 - Krusit F&B', href: '/k4', status: 'implemented' },
  { title: 'Kelompok 5', href: '/k5', status: 'pending' },
  { title: 'Kelompok 6 - House Cafe', href: '/k6', status: 'implemented' },
  { title: 'Kelompok 7', href: '/k7', status: 'pending' },
  { title: 'Kelompok 8', href: '/k8', status: 'pending' },
  { title: 'Kelompok 9', href: '/k9', status: 'pending' },
  { title: 'Kelompok 10 - Cafeku', href: '/k10', status: 'implemented' },
];

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-neutral-800">
          API Distribution
        </h2>
        <p className="text-sm text-neutral-500 mt-1">Sistem Komputasi</p>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isPending = item.status === 'pending';

          return (
            <Link
              key={item.href}
              href={isPending ? '#' : item.href}
              className={`
                flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                    : isPending
                      ? 'text-neutral-400 cursor-not-allowed'
                      : 'text-neutral-700 hover:bg-neutral-50'
                }
              `}
              onClick={(e) => isPending && e.preventDefault()}
            >
              <span>{item.title}</span>
              {isPending && (
                <span className="text-xs px-2 py-1 rounded bg-neutral-100 text-neutral-500">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4 text-xs text-neutral-500">
        <p>10 API Kelompok Mahasiswa</p>
        <p className="mt-1">Next.js 15 + TypeScript</p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar - Sheet/Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40 shadow-md"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden lg:flex w-64 border-r border-neutral-200 bg-white fixed left-0 top-0 h-screen">
        <SidebarContent />
      </aside>
    </>
  );
}
