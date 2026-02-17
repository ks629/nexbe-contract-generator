'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useContractStore, useContractsListStore } from '@/lib/store';
import { CatalogProduct, ContractData, ContractSummary } from '@/types/contract';
import { catalogProducts, existingInverterBrands } from '@/lib/products';
import { calculateNetFromGross, calculateTranches, formatPLN, generateContractNumber } from '@/lib/contract-helpers';
import ProductSelector from './ProductSelector';
import PriceEditor from './PriceEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ChevronLeft, ChevronRight, User, MapPin, Sun, Package, CreditCard, FileText, UserCheck,
  Building, Phone, Mail, Hash, AlertCircle, ExternalLink,
} from 'lucide-react';

const STEPS = [
  { label: 'Zamawiający', icon: User },
  { label: 'Instalacja PV', icon: Sun },
  { label: 'Produkt', icon: Package },
  { label: 'Cena', icon: CreditCard },
  { label: 'Załączniki', icon: FileText },
  { label: 'Handlowiec', icon: UserCheck },
  { label: 'Podsumowanie', icon: FileText },
];

export default function ContractForm() {
  const router = useRouter();
  const {
    currentStep, setCurrentStep, nextStep, prevStep,
    contractData, updateContractData, initializeContract,
  } = useContractStore();
  const addContract = useContractsListStore(s => s.addContract);

  useEffect(() => {
    if (!contractData.contractNumber) {
      initializeContract();
    }
  }, []);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const updateField = (path: string, value: unknown) => {
    const parts = path.split('.');
    if (parts.length === 1) {
      updateContractData({ [parts[0]]: value } as Partial<ContractData>);
    } else if (parts.length === 2) {
      updateContractData({
        [parts[0]]: { [parts[1]]: value },
      } as unknown as Partial<ContractData>);
    } else if (parts.length === 3) {
      updateContractData({
        [parts[0]]: { [parts[1]]: { [parts[2]]: value } },
      } as unknown as Partial<ContractData>);
    }
  };

  const getField = (path: string): unknown => {
    const parts = path.split('.');
    let obj: unknown = contractData;
    for (const p of parts) {
      if (obj && typeof obj === 'object') {
        obj = (obj as Record<string, unknown>)[p];
      } else {
        return undefined;
      }
    }
    return obj;
  };

  const handleProductSelect = (product: CatalogProduct, withBackup: boolean) => {
    const price = withBackup ? product.price_gross_b : product.price_gross_a;
    updateContractData({
      product: {
        id: product.id,
        brand: product.brand,
        model: product.batteryModel,
        batteryCapacity_kWh: product.batteryCapacity_kWh,
        inverterModel: product.inverterModel,
        inverterPower_kW: product.inverterPower_kW,
        type: product.type,
        ems: 'KENO EMS',
        backupEPS: withBackup,
      },
      pricing: {
        ...contractData.pricing!,
        offerPrice: price,
        contractPrice: price,
        ...calculateNetFromGross(price, contractData.pricing?.vatRate || 8),
        tranches: calculateTranches(price),
      },
    });
  };

  const handlePriceChange = (newPrice: number) => {
    const vatRate = contractData.pricing?.vatRate || 8;
    const { netPrice, vatAmount } = calculateNetFromGross(newPrice, vatRate);
    const tranches = calculateTranches(newPrice);
    updateContractData({
      pricing: {
        ...contractData.pricing!,
        contractPrice: newPrice,
        grossPrice: newPrice,
        netPrice,
        vatAmount,
        tranches,
      },
    });
  };

  const handleVatChange = (vat: string) => {
    const vatRate = parseInt(vat) as 8 | 23;
    const price = contractData.pricing?.contractPrice || 0;
    const { netPrice, vatAmount } = calculateNetFromGross(price, vatRate);
    updateContractData({
      pricing: {
        ...contractData.pricing!,
        vatRate,
        netPrice,
        vatAmount,
      },
    });
  };

  const handleGenerate = () => {
    const data = contractData as ContractData;
    const summary: ContractSummary = {
      id: crypto.randomUUID(),
      contractNumber: data.contractNumber,
      clientName: data.client?.fullName || 'Brak danych',
      productName: data.product?.model || 'Brak produktu',
      grossPrice: data.pricing?.grossPrice || 0,
      status: 'GENERATED',
      createdAt: new Date().toISOString(),
      contractData: data,
    };
    addContract(summary);
    toast.success('Umowa wygenerowana pomyślnie!');
    router.push(`/preview?id=${summary.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {STEPS[currentStep].label}
          </h2>
          <Badge variant="outline" className="border-white/20 text-white/60">
            Krok {currentStep + 1} z {STEPS.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-1.5" />
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  i === currentStep
                    ? 'bg-[#B5005D] text-white'
                    : i < currentStep
                    ? 'bg-[#B5005D]/20 text-[#B5005D]'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-6">
          {currentStep === 0 && <StepClient getField={getField} updateField={updateField} contractData={contractData} updateContractData={updateContractData} />}
          {currentStep === 1 && <StepExistingPV getField={getField} updateField={updateField} />}
          {currentStep === 2 && <StepProduct contractData={contractData} onSelect={handleProductSelect} />}
          {currentStep === 3 && <StepPricing contractData={contractData} onPriceChange={handlePriceChange} onVatChange={handleVatChange} updateField={updateField} />}
          {currentStep === 4 && <StepAttachments getField={getField} updateField={updateField} />}
          {currentStep === 5 && <StepSalesRep getField={getField} updateField={updateField} />}
          {currentStep === 6 && <StepSummary contractData={contractData} onGenerate={handleGenerate} />}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="border-white/10 text-white/70 hover:bg-white/5"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Wstecz
        </Button>
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={nextStep} className="bg-[#B5005D] hover:bg-[#9a004f] text-white">
            Dalej
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleGenerate} className="bg-green-600 hover:bg-green-700 text-white">
            <FileText className="mr-2 h-4 w-4" />
            Generuj umowę
          </Button>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// STEP COMPONENTS
// ════════════════════════════════════════════

interface StepProps {
  getField: (path: string) => unknown;
  updateField: (path: string, value: unknown) => void;
  contractData?: Partial<ContractData>;
  updateContractData?: (data: Partial<ContractData>) => void;
}

function FieldRow({ children, label, required }: { children: React.ReactNode; label: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-white/50 uppercase tracking-wide">
        {label} {required && <span className="text-[#B5005D]">*</span>}
      </Label>
      {children}
    </div>
  );
}

function FormInput({ path, getField, updateField, placeholder, type = 'text' }: {
  path: string; getField: (p: string) => unknown; updateField: (p: string, v: unknown) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <Input
      type={type}
      value={(getField(path) as string) || ''}
      onChange={(e) => updateField(path, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
      placeholder={placeholder}
      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
    />
  );
}

// ──── Step 0: Client Data ────
function StepClient({ getField, updateField, contractData, updateContractData }: StepProps) {
  const hasCoOwner = !!(contractData?.coOwner?.fullName);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-white/60 mb-2">
        <User className="h-4 w-4" />
        <span className="text-sm font-medium">Dane Zamawiającego</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldRow label="Imię i nazwisko / Firma" required>
          <FormInput path="client.fullName" getField={getField} updateField={updateField} placeholder="Jan Kowalski" />
        </FieldRow>
        <FieldRow label="PESEL">
          <FormInput path="client.pesel" getField={getField} updateField={updateField} placeholder="00000000000" />
        </FieldRow>
        <FieldRow label="NIP (jeśli firma)">
          <FormInput path="client.nip" getField={getField} updateField={updateField} placeholder="0000000000" />
        </FieldRow>
        <FieldRow label="Telefon" required>
          <FormInput path="client.phone" getField={getField} updateField={updateField} placeholder="+48 600 000 000" />
        </FieldRow>
        <FieldRow label="E-mail" required>
          <FormInput path="client.email" getField={getField} updateField={updateField} placeholder="jan@example.com" type="email" />
        </FieldRow>
      </div>

      <div className="flex items-center gap-2 text-white/60 pt-4">
        <MapPin className="h-4 w-4" />
        <span className="text-sm font-medium">Adres Zamawiającego</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <FieldRow label="Ulica i numer" required>
            <FormInput path="client.address.street" getField={getField} updateField={updateField} placeholder="ul. Przykładowa 1/2" />
          </FieldRow>
        </div>
        <FieldRow label="Kod pocztowy" required>
          <FormInput path="client.address.postalCode" getField={getField} updateField={updateField} placeholder="00-000" />
        </FieldRow>
        <FieldRow label="Miejscowość" required>
          <FormInput path="client.address.city" getField={getField} updateField={updateField} placeholder="Warszawa" />
        </FieldRow>
      </div>

      <div className="flex items-center gap-2 text-white/60 pt-4">
        <Building className="h-4 w-4" />
        <span className="text-sm font-medium">Adres inwestycji (jeśli inny)</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <FieldRow label="Ulica i numer">
            <FormInput path="investmentAddress.street" getField={getField} updateField={updateField} placeholder="Pozostaw puste jeśli taki sam" />
          </FieldRow>
        </div>
        <FieldRow label="Kod pocztowy">
          <FormInput path="investmentAddress.postalCode" getField={getField} updateField={updateField} />
        </FieldRow>
        <FieldRow label="Miejscowość">
          <FormInput path="investmentAddress.city" getField={getField} updateField={updateField} />
        </FieldRow>
      </div>

      {/* Co-owner toggle */}
      <div className="flex items-center space-x-2 pt-4">
        <Checkbox
          id="coowner"
          checked={hasCoOwner}
          onCheckedChange={(checked) => {
            if (!checked && updateContractData) {
              updateContractData({ coOwner: undefined });
            } else if (checked && updateContractData) {
              updateContractData({
                coOwner: { fullName: '', address: { street: '', postalCode: '', city: '' }, phone: '', email: '' },
              });
            }
          }}
        />
        <label htmlFor="coowner" className="text-sm text-white/70 cursor-pointer">
          Dodaj współwłaściciela nieruchomości
        </label>
      </div>
      {hasCoOwner && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-[#B5005D]/30">
          <FieldRow label="Imię i nazwisko współwłaściciela" required>
            <FormInput path="coOwner.fullName" getField={getField} updateField={updateField} />
          </FieldRow>
          <FieldRow label="PESEL współwłaściciela">
            <FormInput path="coOwner.pesel" getField={getField} updateField={updateField} />
          </FieldRow>
          <FieldRow label="Telefon">
            <FormInput path="coOwner.phone" getField={getField} updateField={updateField} />
          </FieldRow>
          <FieldRow label="E-mail">
            <FormInput path="coOwner.email" getField={getField} updateField={updateField} />
          </FieldRow>
        </div>
      )}
    </div>
  );
}

// ──── Step 1: Existing PV ────
function StepExistingPV({ getField, updateField }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-white/60 mb-2">
        <Sun className="h-4 w-4" />
        <span className="text-sm font-medium">Istniejąca instalacja fotowoltaiczna</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldRow label="Moc instalacji PV (kWp)" required>
          <FormInput path="existingPV.power_kWp" getField={getField} updateField={updateField} type="number" placeholder="10" />
        </FieldRow>
        <FieldRow label="Marka falownika" required>
          <Select
            value={(getField('existingPV.inverterBrand') as string) || ''}
            onValueChange={(v) => updateField('existingPV.inverterBrand', v)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Wybierz markę" />
            </SelectTrigger>
            <SelectContent>
              {existingInverterBrands.map(b => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="Model falownika">
          <FormInput path="existingPV.inverterModel" getField={getField} updateField={updateField} placeholder="np. SUN2000-10KTL" />
        </FieldRow>
        <FieldRow label="Operator Systemu Dystrybucyjnego (OSD)" required>
          <Select
            value={(getField('existingPV.osd') as string) || 'PGE'}
            onValueChange={(v) => updateField('existingPV.osd', v)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PGE">PGE Dystrybucja</SelectItem>
              <SelectItem value="TAURON">TAURON Dystrybucja</SelectItem>
              <SelectItem value="ENEA">ENEA Operator</SelectItem>
              <SelectItem value="ENERGA">ENERGA-OPERATOR</SelectItem>
              <SelectItem value="STOEN">Stoen Operator</SelectItem>
              <SelectItem value="INNY">Inny</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="Obecna moc przyłączeniowa (kW)">
          <FormInput path="existingPV.currentConnectionPower_kW" getField={getField} updateField={updateField} type="number" />
        </FieldRow>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="powerIncrease"
          checked={(getField('existingPV.needsPowerIncrease') as boolean) || false}
          onCheckedChange={(checked) => updateField('existingPV.needsPowerIncrease', checked === true)}
        />
        <label htmlFor="powerIncrease" className="text-sm text-white/70 cursor-pointer">
          Wymaga zwiększenia mocy przyłączeniowej
        </label>
      </div>

      {(getField('existingPV.needsPowerIncrease') as boolean) && (
        <div className="pl-6 border-l-2 border-amber-500/30">
          <FieldRow label="Docelowa moc przyłączeniowa (kW)">
            <FormInput path="existingPV.targetConnectionPower_kW" getField={getField} updateField={updateField} type="number" />
          </FieldRow>
        </div>
      )}
    </div>
  );
}

// ──── Step 2: Product ────
function StepProduct({ contractData, onSelect }: { contractData: Partial<ContractData>; onSelect: (p: CatalogProduct, b: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/60 mb-2">
        <Package className="h-4 w-4" />
        <span className="text-sm font-medium">Wybierz zestaw magazynu energii z falownikiem</span>
      </div>
      <ProductSelector
        selectedProductId={contractData.product?.id}
        backupEPS={contractData.product?.backupEPS}
        onSelect={onSelect}
      />
    </div>
  );
}

// ──── Step 3: Pricing ────
function StepPricing({ contractData, onPriceChange, onVatChange, updateField }: {
  contractData: Partial<ContractData>;
  onPriceChange: (p: number) => void;
  onVatChange: (v: string) => void;
  updateField: (path: string, value: unknown) => void;
}) {
  const pricing = contractData.pricing;
  if (!pricing || !pricing.offerPrice) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
        <p className="text-white/60">Najpierw wybierz produkt w kroku 3</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* VAT */}
      <div className="space-y-3">
        <Label className="text-xs text-white/50 uppercase tracking-wide">Stawka VAT</Label>
        <RadioGroup
          value={String(pricing.vatRate)}
          onValueChange={onVatChange}
          className="flex flex-col gap-3"
        >
          <div className="flex items-start space-x-3 rounded-lg bg-white/5 border border-white/10 p-3">
            <RadioGroupItem value="8" id="vat8" />
            <label htmlFor="vat8" className="text-sm text-white/80 cursor-pointer">
              <strong>8% VAT</strong> — Budynek mieszkalny do 300 m²
            </label>
          </div>
          <div className="flex items-start space-x-3 rounded-lg bg-white/5 border border-white/10 p-3">
            <RadioGroupItem value="23" id="vat23" />
            <label htmlFor="vat23" className="text-sm text-white/80 cursor-pointer">
              <strong>23% VAT</strong> — Budynek powyżej 300 m² / nierezydenialny
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Price Editor */}
      <PriceEditor
        offerPrice={pricing.offerPrice}
        vatRate={pricing.vatRate}
        value={pricing.contractPrice}
        onChange={onPriceChange}
        financing={pricing.financing}
      />

      {/* Financing */}
      <div className="space-y-3">
        <Label className="text-xs text-white/50 uppercase tracking-wide">Forma płatności</Label>
        <RadioGroup
          value={pricing.financing}
          onValueChange={(v) => {
            updateField('pricing.financing', v);
            if (v === 'OWN_FUNDS') {
              updateField('pricing.ownContribution', 0);
              updateField('pricing.financingInstitution', '');
            }
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-start space-x-3 rounded-lg bg-white/5 border border-white/10 p-3">
            <RadioGroupItem value="OWN_FUNDS" id="own" />
            <label htmlFor="own" className="text-sm text-white/80 cursor-pointer">
              <strong>Gotówka (środki własne)</strong>
              <p className="text-xs text-white/40 mt-0.5">Płatność w 3 transzach: 30% / 60% / 10%</p>
            </label>
          </div>
          <div className="flex items-start space-x-3 rounded-lg bg-white/5 border border-white/10 p-3">
            <RadioGroupItem value="CREDIT" id="credit" />
            <label htmlFor="credit" className="text-sm text-white/80 cursor-pointer">
              <strong>Kredyt bankowy</strong>
              <p className="text-xs text-white/40 mt-0.5">Płatność przez bank kredytujący</p>
            </label>
          </div>
          <div className="flex items-start space-x-3 rounded-lg bg-white/5 border border-white/10 p-3">
            <RadioGroupItem value="LEASING" id="leasing" />
            <label htmlFor="leasing" className="text-sm text-white/80 cursor-pointer">
              <strong>Leasing</strong>
              <p className="text-xs text-white/40 mt-0.5">Płatność przez firmę leasingową</p>
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Own Contribution — for credit/leasing */}
      {(pricing.financing === 'CREDIT' || pricing.financing === 'LEASING') && (
        <div className="space-y-4 pl-4 border-l-2 border-[#B5005D]/30">
          <FieldRow label="Wkład własny (brutto, zł) — opcjonalnie">
            <Input
              type="number"
              value={pricing.ownContribution || ''}
              onChange={(e) => updateField('pricing.ownContribution', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 w-48"
            />
          </FieldRow>
          <FieldRow label="Nazwa instytucji finansującej (opcjonalnie)">
            <Input
              type="text"
              value={pricing.financingInstitution || ''}
              onChange={(e) => updateField('pricing.financingInstitution', e.target.value)}
              placeholder={pricing.financing === 'CREDIT' ? 'np. PKO BP, mBank' : 'np. PKO Leasing'}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 w-64"
            />
          </FieldRow>
          <p className="text-xs text-white/30">
            Pozostała kwota ({formatPLN(pricing.grossPrice - (pricing.ownContribution || 0))}) zostanie opłacona przez instytucję finansującą.
          </p>
        </div>
      )}
    </div>
  );
}

// ──── Step 4: Attachments ────
function StepAttachments({ getField, updateField }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-white/60 mb-2">
        <FileText className="h-4 w-4" />
        <span className="text-sm font-medium">Załączniki do umowy</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 rounded-lg bg-white/5 border border-white/10 p-4">
          <Checkbox
            id="poaOSD"
            checked={(getField('attachments.poaOSD') as boolean) ?? true}
            onCheckedChange={(c) => updateField('attachments.poaOSD', c === true)}
          />
          <div>
            <label htmlFor="poaOSD" className="text-sm text-white/80 cursor-pointer font-medium">
              Pełnomocnictwo OSD (przyłączenie mikroinstalacji)
            </label>
            <p className="text-xs text-white/40 mt-1">Upoważnienie do zgłoszenia/aktualizacji przyłączenia u operatora sieci</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg bg-white/5 border border-white/10 p-4">
          <Checkbox
            id="poaSubsidy"
            checked={(getField('attachments.poaSubsidy') as boolean) ?? true}
            onCheckedChange={(c) => updateField('attachments.poaSubsidy', c === true)}
          />
          <div>
            <label htmlFor="poaSubsidy" className="text-sm text-white/80 cursor-pointer font-medium">
              Pełnomocnictwo do złożenia wniosku o dofinansowanie
            </label>
            <p className="text-xs text-white/40 mt-1">NFOŚiGW — Mój Prąd, Czyste Powietrze</p>
            {(getField('attachments.poaSubsidy') as boolean) && (
              <div className="mt-3">
                <Select
                  value={(getField('attachments.subsidyProgram') as string) || 'MOJ_PRAD'}
                  onValueChange={(v) => updateField('attachments.subsidyProgram', v)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MOJ_PRAD">Mój Prąd (aktualna edycja)</SelectItem>
                    <SelectItem value="CZYSTE_POWIETRZE">Czyste Powietrze</SelectItem>
                    <SelectItem value="OTHER">Inny program</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg bg-green-500/5 border border-green-500/20 p-4">
          <Checkbox checked disabled className="opacity-60" />
          <div>
            <p className="text-sm text-white/80 font-medium">Klauzula informacyjna RODO</p>
            <p className="text-xs text-white/40 mt-1">Zawsze dołączana — Załącznik nr 4</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg bg-blue-500/5 border border-blue-500/20 p-4">
          <div className="flex-1">
            <p className="text-sm text-white/80 font-medium">Arkusz Ustaleń Montażowych (AUM)</p>
            <p className="text-xs text-white/40 mt-1">Wypełniany osobno — Załącznik nr 1</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
            onClick={() => window.open('https://konfigurator-delta.vercel.app', '_blank')}
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Przejdź do AUM
          </Button>
        </div>
      </div>

      {/* Declarations */}
      <div className="space-y-4 pt-4">
        <p className="text-xs text-white/50 uppercase tracking-wide">Oświadczenia</p>

        <FieldRow label="Typ budynku">
          <Select
            value={(getField('declarations.buildingType') as string) || 'RESIDENTIAL_UNDER_300'}
            onValueChange={(v) => updateField('declarations.buildingType', v)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RESIDENTIAL_UNDER_300">Budynek mieszkalny do 300 m² (VAT 8%)</SelectItem>
              <SelectItem value="RESIDENTIAL_OVER_300">Budynek mieszkalny powyżej 300 m²</SelectItem>
              <SelectItem value="NON_RESIDENTIAL">Budynek niemieszkalny (VAT 23%)</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>

        <FieldRow label="Spotkanie z Wykonawcą">
          <Select
            value={(getField('declarations.meetingType') as string) || 'SCHEDULED'}
            onValueChange={(v) => updateField('declarations.meetingType', v)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SCHEDULED">Spotkanie wcześniej umówione</SelectItem>
              <SelectItem value="UNSCHEDULED">Spotkanie nie było umówione</SelectItem>
              <SelectItem value="REMOTE">Umowa zawierana na odległość</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="eInvoice"
            checked={(getField('declarations.electronicInvoices') as boolean) ?? true}
            onCheckedChange={(c) => updateField('declarations.electronicInvoices', c === true)}
          />
          <label htmlFor="eInvoice" className="text-sm text-white/70 cursor-pointer">
            Zgoda na przesyłanie faktur elektronicznych
          </label>
        </div>
      </div>
    </div>
  );
}

// ──── Step 5: Sales Rep ────
function StepSalesRep({ getField, updateField }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-white/60 mb-2">
        <UserCheck className="h-4 w-4" />
        <span className="text-sm font-medium">Dane handlowca / przedstawiciela</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldRow label="Imię i nazwisko" required>
          <FormInput path="salesRep.fullName" getField={getField} updateField={updateField} placeholder="Jan Nowak" />
        </FieldRow>
        <FieldRow label="Stanowisko">
          <FormInput path="salesRep.position" getField={getField} updateField={updateField} placeholder="Przedstawiciel handlowy" />
        </FieldRow>
      </div>
    </div>
  );
}

// ──── Step 6: Summary ────
function StepSummary({ contractData, onGenerate }: { contractData: Partial<ContractData>; onGenerate: () => void }) {
  const d = contractData;
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">Podsumowanie umowy</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-xs text-white/40 uppercase">Numer umowy</p>
          <p className="text-lg font-bold text-[#B5005D]">{d.contractNumber}</p>
        </div>
        <div className="space-y-3">
          <p className="text-xs text-white/40 uppercase">Data</p>
          <p className="text-white">{d.contractDate}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2">
        <p className="text-xs text-white/40 uppercase">Zamawiający</p>
        <p className="text-white font-medium">{d.client?.fullName || '—'}</p>
        <p className="text-sm text-white/60">
          {d.client?.address?.street}, {d.client?.address?.postalCode} {d.client?.address?.city}
        </p>
        <p className="text-sm text-white/60">{d.client?.phone} | {d.client?.email}</p>
      </div>

      <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2">
        <p className="text-xs text-white/40 uppercase">Produkt</p>
        <p className="text-white font-medium">{d.product?.brand} — {d.product?.model}</p>
        <p className="text-sm text-white/60">
          Magazyn: {d.product?.batteryCapacity_kWh} kWh | Falownik: {d.product?.inverterModel} ({d.product?.inverterPower_kW} kW)
        </p>
        <p className="text-sm text-white/60">
          Backup EPS: {d.product?.backupEPS ? 'Tak' : 'Nie'} | EMS: {d.product?.ems}
        </p>
      </div>

      <div className="rounded-lg bg-[#B5005D]/10 border border-[#B5005D]/30 p-4 space-y-2">
        <p className="text-xs text-white/40 uppercase">Wynagrodzenie</p>
        <p className="text-2xl font-bold text-[#B5005D]">{formatPLN(d.pricing?.grossPrice || 0)}</p>
        <p className="text-sm text-white/60">
          Netto: {formatPLN(d.pricing?.netPrice || 0)} + VAT {d.pricing?.vatRate}%: {formatPLN(d.pricing?.vatAmount || 0)}
        </p>
      </div>

      <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2">
        <p className="text-xs text-white/40 uppercase">Handlowiec</p>
        <p className="text-white font-medium">{d.salesRep?.fullName || '—'}</p>
        <p className="text-sm text-white/60">{d.salesRep?.position}</p>
      </div>
    </div>
  );
}
