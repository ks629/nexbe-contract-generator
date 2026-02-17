'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import { useContractsListStore } from '@/lib/store';
import { ContractSummary } from '@/types/contract';
import { formatPLN, formatDatePolish, getStatusLabel, getOSDName } from '@/lib/contract-helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Download, Send, ExternalLink, ArrowLeft, FileText, User, Package,
  CreditCard, Shield, Zap, Battery, Info,
} from 'lucide-react';

function PreviewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { contracts, loadContracts } = useContractsListStore();
  const [contract, setContract] = useState<ContractSummary | null>(null);
  const [showAutentiDialog, setShowAutentiDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadContracts();
  }, []);

  useEffect(() => {
    if (id && contracts.length > 0) {
      const found = contracts.find(c => c.id === id);
      setContract(found || null);
    }
  }, [id, contracts]);

  const handleDownloadPDF = async () => {
    if (!contract) return;
    setDownloading(true);
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contract.contractData),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Umowa_${contract.contractNumber.replace(/\//g, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF pobrany pomyślnie');
    } catch {
      toast.error('Błąd generowania PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (!contract) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/60 mb-4">Nie znaleziono umowy</h3>
            <Link href="/">
              <Button variant="outline" className="border-white/10 text-white/70">
                <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do listy
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const d = contract.contractData;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <Link href="/" className="text-sm text-white/40 hover:text-white/60 flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Powrót do listy
          </Link>
          <h1 className="text-2xl font-bold text-white">{d.contractNumber}</h1>
          <p className="text-white/50 text-sm mt-1">
            Umowa z dnia {formatDatePolish(d.contractDate)}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-white/10 text-white/70 hover:bg-white/5"
            onClick={handleDownloadPDF}
            disabled={downloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {downloading ? 'Generowanie...' : 'Pobierz PDF'}
          </Button>
          <Button
            className="bg-[#B5005D] hover:bg-[#9a004f] text-white"
            onClick={() => setShowAutentiDialog(true)}
          >
            <Send className="mr-2 h-4 w-4" />
            Wyślij do podpisu
          </Button>
        </div>
      </div>

      {/* Contract Preview */}
      <div className="space-y-6">
        {/* Parties */}
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-[#B5005D]" /> Strony umowy
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-white/40 uppercase mb-2">Wykonawca</p>
              <p className="text-white font-medium">Nexbe sp. z o.o.</p>
              <p className="text-sm text-white/60">ul. Stefana Batorego 18/108</p>
              <p className="text-sm text-white/60">02-591 Warszawa</p>
              <p className="text-sm text-white/60 mt-1">NIP: 7011261848 | KRS: 0001174829</p>
              <p className="text-sm text-white/60">Reprezentowana przez: Zarząd Spółki</p>
              {d.salesRep?.fullName && (
                <p className="text-sm text-white/40">Handlowiec: {d.salesRep.fullName}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase mb-2">Zamawiający</p>
              <p className="text-white font-medium">{d.client?.fullName}</p>
              <p className="text-sm text-white/60">{d.client?.address?.street}</p>
              <p className="text-sm text-white/60">
                {d.client?.address?.postalCode} {d.client?.address?.city}
              </p>
              {d.client?.pesel && <p className="text-sm text-white/60 mt-1">PESEL: {d.client.pesel}</p>}
              {d.client?.nip && <p className="text-sm text-white/60">NIP: {d.client.nip}</p>}
              <p className="text-sm text-white/60">{d.client?.phone} | {d.client?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Product */}
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Package className="h-4 w-4 text-[#B5005D]" /> Przedmiot umowy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-white/60">Magazyn energii:</span>
                  <span className="text-sm text-white font-medium">{d.product?.model}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-white/60">Falownik:</span>
                  <span className="text-sm text-white font-medium">{d.product?.inverterModel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white/60">Backup EPS/SZR:</span>
                  <span className="text-sm text-white font-medium">{d.product?.backupEPS ? 'Tak' : 'Nie'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white/60">
                  Pojemność: <span className="text-white font-medium">{d.product?.batteryCapacity_kWh} kWh</span>
                </p>
                <p className="text-sm text-white/60">
                  Moc falownika: <span className="text-white font-medium">{d.product?.inverterPower_kW} kW</span>
                </p>
                <p className="text-sm text-white/60">
                  EMS: <span className="text-white font-medium">{d.product?.ems}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Address */}
        <Card className="bg-white/[0.03] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Info className="h-4 w-4 text-[#B5005D]" /> Adres inwestycji i istniejąca instalacja PV
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-white/40 uppercase mb-2">Adres montażu</p>
              <p className="text-white">{d.investmentAddress?.street || d.client?.address?.street}</p>
              <p className="text-white/60 text-sm">
                {d.investmentAddress?.postalCode || d.client?.address?.postalCode}{' '}
                {d.investmentAddress?.city || d.client?.address?.city}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase mb-2">Istniejąca instalacja PV</p>
              <p className="text-sm text-white/60">
                Moc: <span className="text-white">{d.existingPV?.power_kWp} kWp</span>
              </p>
              <p className="text-sm text-white/60">
                Falownik: <span className="text-white">{d.existingPV?.inverterBrand} {d.existingPV?.inverterModel}</span>
              </p>
              <p className="text-sm text-white/60">
                OSD: <span className="text-white">{d.existingPV?.osd ? getOSDName(d.existingPV.osd) : '—'}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="bg-[#B5005D]/5 border-[#B5005D]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4 text-[#B5005D]" /> Wynagrodzenie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-[#B5005D]">{formatPLN(d.pricing?.grossPrice || 0)}</p>
              <p className="text-sm text-white/60 mt-1">
                {formatPLN(d.pricing?.netPrice || 0)} netto + {d.pricing?.vatRate}% VAT ({formatPLN(d.pricing?.vatAmount || 0)})
              </p>
            </div>
            {d.pricing?.financing === 'OWN_FUNDS' ? (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-white/40">Transza 1 (30%)</p>
                  <p className="text-lg font-bold text-white">{formatPLN(d.pricing?.tranches?.t1_amount || 0)}</p>
                  <p className="text-xs text-white/30">3 dni od podpisania</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-white/40">Transza 2 (60%)</p>
                  <p className="text-lg font-bold text-white">{formatPLN(d.pricing?.tranches?.t2_amount || 0)}</p>
                  <p className="text-xs text-white/30">3 dni od dostawy</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-white/40">Transza 3 (10%)</p>
                  <p className="text-lg font-bold text-white">{formatPLN(d.pricing?.tranches?.t3_amount || 0)}</p>
                  <p className="text-xs text-white/30">3 dni po montażu</p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-white/5 p-4 text-center">
                <p className="text-sm text-white/60">
                  Forma płatności: <span className="text-white font-medium">{d.pricing?.financing === 'CREDIT' ? 'Kredyt bankowy' : 'Leasing'}</span>
                </p>
                {d.pricing?.ownContribution && d.pricing.ownContribution > 0 && (
                  <p className="text-sm text-white/60 mt-2">
                    Wkład własny: <span className="text-white font-medium">{formatPLN(d.pricing.ownContribution)}</span>
                  </p>
                )}
                <p className="text-xs text-white/30 mt-2">
                  Płatność przez instytucję finansującą
                  {d.pricing?.financingInstitution ? `: ${d.pricing.financingInstitution}` : ''}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AUM Link */}
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Arkusz Ustaleń Montażowych (AUM)</p>
              <p className="text-xs text-white/40">Wypełnij przed rozpoczęciem montażu</p>
            </div>
            <Button
              variant="outline"
              className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
              onClick={() => {
                const params = new URLSearchParams({
                  client: d.client?.fullName || '',
                  address: `${d.investmentAddress?.street || d.client?.address?.street}`,
                  product: `${d.product?.brand} ${d.product?.model}`,
                  contract: d.contractNumber || '',
                });
                window.open(`https://arkusz-montazowy.vercel.app?${params.toString()}`, '_blank');
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Przejdź do AUM
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Autenti Dialog */}
      <Dialog open={showAutentiDialog} onOpenChange={setShowAutentiDialog}>
        <DialogContent className="bg-[#12101f] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Podpis elektroniczny — Autenti</DialogTitle>
            <DialogDescription className="text-white/50">
              Integracja z Autenti API w przygotowaniu
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
              <p className="text-sm text-amber-300">
                Integracja z platformą Autenti jest w trakcie implementacji.
                Na obecnym etapie pobierz PDF i wyślij go ręcznie przez panel Autenti.
              </p>
            </div>
            <div className="text-sm text-white/60 space-y-2">
              <p><strong>Docelowy flow:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-white/40">
                <li>Upload PDF umowy do Autenti</li>
                <li>Dodanie sygnatariuszy (Nexbe + Zamawiający)</li>
                <li>Wysłanie zaproszenia do podpisu</li>
                <li>Webhook zwrotny — zmiana statusu umowy</li>
              </ol>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/10 text-white/70"
                onClick={handleDownloadPDF}
              >
                <Download className="mr-2 h-4 w-4" />
                Pobierz PDF
              </Button>
              <Button
                className="flex-1 bg-[#B5005D] hover:bg-[#9a004f] text-white"
                onClick={() => {
                  window.open('https://app.autenti.com', '_blank');
                  setShowAutentiDialog(false);
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Otwórz Autenti
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function PreviewPage() {
  return (
    <>
      <AppHeader />
      <Suspense fallback={
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/5 rounded w-1/3" />
            <div className="h-64 bg-white/5 rounded" />
          </div>
        </main>
      }>
        <PreviewContent />
      </Suspense>
    </>
  );
}
