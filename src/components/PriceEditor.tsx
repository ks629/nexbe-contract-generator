'use client';

import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { AlertTriangle, Check } from 'lucide-react';
import { formatPLN, validatePriceChange, calculateNetFromGross, calculateTranches } from '@/lib/contract-helpers';

interface PriceEditorProps {
  offerPrice: number;
  vatRate: 8 | 23;
  onChange: (price: number) => void;
  value?: number;
}

export default function PriceEditor({ offerPrice, vatRate, onChange, value }: PriceEditorProps) {
  const [contractPrice, setContractPrice] = useState(value || offerPrice);
  const [inputValue, setInputValue] = useState(String(value || offerPrice));

  const validation = validatePriceChange(offerPrice, contractPrice);
  const pricing = calculateNetFromGross(contractPrice, vatRate);
  const tranches = calculateTranches(contractPrice);

  useEffect(() => {
    if (value !== undefined && value !== contractPrice) {
      setContractPrice(value);
      setInputValue(String(value));
    }
  }, [value]);

  useEffect(() => {
    if (offerPrice > 0 && contractPrice === 0) {
      setContractPrice(offerPrice);
      setInputValue(String(offerPrice));
    }
  }, [offerPrice]);

  const handleSliderChange = (values: number[]) => {
    const newPrice = Math.round(values[0]);
    setContractPrice(newPrice);
    setInputValue(String(newPrice));
    onChange(newPrice);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      const clamped = Math.max(validation.minPrice, Math.min(validation.maxPrice, num));
      setContractPrice(clamped);
      onChange(clamped);
    }
  };

  const handleInputBlur = () => {
    setInputValue(String(contractPrice));
  };

  if (offerPrice <= 0) return null;

  const sliderPercent = ((contractPrice - offerPrice) / offerPrice) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-white/50 uppercase tracking-wide">Cena z oferty</Label>
          <p className="text-lg font-bold text-white/80">{formatPLN(offerPrice)}</p>
        </div>
        <div>
          <Label className="text-xs text-white/50 uppercase tracking-wide">Cena umowna</Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="h-10 text-lg font-bold bg-white/5 border-white/10 text-white"
            />
            <span className="text-sm text-white/40">zł</span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>-5% ({formatPLN(validation.minPrice)})</span>
          <span className={`font-medium ${validation.valid ? 'text-green-400' : 'text-red-400'}`}>
            {sliderPercent >= 0 ? '+' : ''}{sliderPercent.toFixed(1)}%
          </span>
          <span>+5% ({formatPLN(validation.maxPrice)})</span>
        </div>
        <Slider
          value={[contractPrice]}
          min={validation.minPrice}
          max={validation.maxPrice}
          step={1}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>

      {/* Validation Alert */}
      {!validation.valid && (
        <Alert className="bg-red-500/10 border-red-500/30 text-red-300">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <div className="ml-2 text-sm">
            Zmiana ceny przekracza dopuszczalny zakres ±5%. Zakres: {formatPLN(validation.minPrice)} – {formatPLN(validation.maxPrice)}
          </div>
        </Alert>
      )}

      {validation.valid && contractPrice !== offerPrice && (
        <Alert className="bg-green-500/10 border-green-500/30 text-green-300">
          <Check className="h-4 w-4 text-green-400" />
          <div className="ml-2 text-sm">
            Zmiana ceny w dopuszczalnym zakresie ({validation.percentChange > 0 ? '+' : ''}{validation.percentChange}%)
          </div>
        </Alert>
      )}

      {/* Price Breakdown */}
      <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-3">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-white/40">Netto</span>
            <p className="font-semibold text-white">{formatPLN(pricing.netPrice)}</p>
          </div>
          <div>
            <span className="text-white/40">VAT {vatRate}%</span>
            <p className="font-semibold text-white">{formatPLN(pricing.vatAmount)}</p>
          </div>
          <div>
            <span className="text-white/40">Brutto</span>
            <p className="font-semibold text-[#B5005D]">{formatPLN(pricing.grossPrice)}</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Harmonogram płatności</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-white/40">Transza 1 (30%)</span>
              <p className="font-medium text-white">{formatPLN(tranches.t1_amount)}</p>
            </div>
            <div>
              <span className="text-white/40">Transza 2 (60%)</span>
              <p className="font-medium text-white">{formatPLN(tranches.t2_amount)}</p>
            </div>
            <div>
              <span className="text-white/40">Transza 3 (10%)</span>
              <p className="font-medium text-white">{formatPLN(tranches.t3_amount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
