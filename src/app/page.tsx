'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import { useContractsListStore } from '@/lib/store';
import { formatPLN, getStatusLabel, formatDatePolish } from '@/lib/contract-helpers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus, Search, Eye, Send, CheckCircle,
  Clock,
} from 'lucide-react';
import { NexbeIcon } from '@nexbe/icons';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  GENERATED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  SENT_FOR_SIGNATURE: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  SIGNED: 'bg-green-500/20 text-green-300 border-green-500/30',
};

const STATUS_NEXBE_ICONS: Record<string, string> = {
  GENERATED: 'dokumenty',
};

const STATUS_LUCIDE_ICONS: Record<string, typeof Clock> = {
  DRAFT: Clock,
  SENT_FOR_SIGNATURE: Send,
  SIGNED: CheckCircle,
};

export default function DashboardPage() {
  const { contracts, loadContracts } = useContractsListStore();
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadContracts();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = contracts.filter(c =>
    !search ||
    c.clientName.toLowerCase().includes(search.toLowerCase()) ||
    c.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.productName.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = contracts.reduce((sum, c) => sum + c.grossPrice, 0);
  const signedCount = contracts.filter(c => c.status === 'SIGNED').length;

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Generator Umów</h1>
          <p className="text-white/60 mt-1">Nexbe sp. z o.o. — Umowy na magazyny energii</p>
          <p className="text-white/60 text-xs mt-2">Generuj umowy na magazyny energii BESS — szybko i bezbłędnie</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { nexbeIcon: 'dokumenty', color: '#B5005D', value: contracts.length, label: 'Wszystkie umowy' },
            { icon: CheckCircle, color: '#22c55e', value: signedCount, label: 'Podpisane' },
            { nexbeIcon: 'roi', color: '#f59e0b', value: formatPLN(totalValue), label: 'Łączna wartość' },
            { nexbeIcon: 'smart-ems', color: '#a855f7', value: contracts.length > 0 ? formatPLN(totalValue / contracts.length) : '—', label: 'Śr. wartość' },
          ].map((stat, i) => (
            <Card key={i} className="bg-white/[0.03] border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                    {'nexbeIcon' in stat && stat.nexbeIcon ? (
                      <NexbeIcon name={stat.nexbeIcon} size={20} variant="inherit" style={{ color: stat.color }} />
                    ) : (
                      'icon' in stat && stat.icon ? <stat.icon className="h-5 w-5" style={{ color: stat.color }} /> : null
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/60">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj: klient, numer umowy, produkt..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/60"
            />
          </div>
          <Link href="/generator">
            <Button className="bg-[#B5005D] hover:bg-[#9a004f] text-white w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nowa umowa
            </Button>
          </Link>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="p-12 text-center">
              <NexbeIcon name="dokumenty" size={64} variant="inherit" className="text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white/70 mb-2">
                {contracts.length === 0 ? 'Brak umów' : 'Brak wyników'}
              </h3>
              <p className="text-sm text-white/60 mb-6">
                {contracts.length === 0 ? 'Wygeneruj pierwszą umowę dla klienta' : 'Spróbuj inną frazę'}
              </p>
              {contracts.length === 0 && (
                <Link href="/generator">
                  <Button className="bg-[#B5005D] hover:bg-[#9a004f] text-white">
                    <Plus className="mr-2 h-4 w-4" /> Utwórz pierwszą umowę
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(contract => {
              const StatusLucideIcon = STATUS_LUCIDE_ICONS[contract.status];
              const statusNexbeIcon = STATUS_NEXBE_ICONS[contract.status];
              return (
                <Link key={contract.id} href={`/preview?id=${contract.id}`}>
                  <Card className="bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-sm font-bold text-[#B5005D]">{contract.contractNumber}</p>
                            <Badge className={`text-xs ${STATUS_COLORS[contract.status]}`}>
                              {statusNexbeIcon ? (
                                <NexbeIcon name={statusNexbeIcon} size={12} variant="inherit" className="mr-1" />
                              ) : StatusLucideIcon ? (
                                <StatusLucideIcon className="mr-1 h-3 w-3" />
                              ) : (
                                <Clock className="mr-1 h-3 w-3" />
                              )}
                              {getStatusLabel(contract.status)}
                            </Badge>
                          </div>
                          <p className="text-white font-medium truncate">{contract.clientName}</p>
                          <p className="text-xs text-white/60 truncate">{contract.productName}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">{formatPLN(contract.grossPrice)}</p>
                            <p className="text-xs text-white/60">{formatDatePolish(contract.createdAt)}</p>
                          </div>
                          <Eye className="h-5 w-5 text-white/50" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
