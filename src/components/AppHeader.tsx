'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { NexbeIcon } from '@nexbe/icons';
import { Button } from '@/components/ui/button';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a14]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-white.svg"
            alt="NEXBE"
            width={110}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-white/50">|</span>
            <span className="text-sm font-medium text-white/70">Generator Umów</span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/5">
              <NexbeIcon name="dokumenty" size={16} variant="inherit" className="mr-2" />
              <span className="hidden sm:inline">Umowy</span>
            </Button>
          </Link>
          <Link href="/generator">
            <Button size="sm" className="bg-[#B5005D] hover:bg-[#9a004f] text-white">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nowa umowa</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
