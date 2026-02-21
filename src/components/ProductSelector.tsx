'use client';

import { useState } from 'react';
import { CatalogProduct } from '@/types/contract';
import { catalogProducts, productBrands } from '@/lib/products';
import { formatPLN } from '@/lib/contract-helpers';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { NexbeIcon } from '@nexbe/icons';

interface ProductSelectorProps {
  selectedProductId?: string;
  backupEPS?: boolean;
  onSelect: (product: CatalogProduct, withBackup: boolean) => void;
}

export default function ProductSelector({ selectedProductId, backupEPS = true, onSelect }: ProductSelectorProps) {
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [withBackup, setWithBackup] = useState(backupEPS);

  const filteredProducts = brandFilter === 'all'
    ? catalogProducts
    : catalogProducts.filter(p => p.brand === brandFilter);

  const handleSelect = (product: CatalogProduct) => {
    onSelect(product, withBackup);
  };

  const handleBackupChange = (checked: boolean) => {
    setWithBackup(checked);
    const selected = catalogProducts.find(p => p.id === selectedProductId);
    if (selected) {
      onSelect(selected, checked);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label className="text-xs text-white/50 uppercase tracking-wide">Marka</Label>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Wszystkie marki" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie marki</SelectItem>
              {productBrands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex items-center space-x-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5">
            <Checkbox
              id="backup"
              checked={withBackup}
              onCheckedChange={(checked) => handleBackupChange(checked === true)}
            />
            <label htmlFor="backup" className="text-sm text-white/80 cursor-pointer flex items-center gap-2">
              <NexbeIcon name="blackout-ochrona" size={16} variant="inherit" className="text-green-400" />
              Pełny backup 3F (SZR)
            </label>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredProducts.map(product => {
          const isSelected = product.id === selectedProductId;
          const price = withBackup ? product.price_gross_b : product.price_gross_a;

          return (
            <Card
              key={product.id}
              className={`cursor-pointer transition-all duration-200 p-4 ${
                isSelected
                  ? 'bg-[#B5005D]/10 border-[#B5005D]/50 ring-1 ring-[#B5005D]/30'
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
              }`}
              onClick={() => handleSelect(product)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-white text-sm">{product.brand}</p>
                  <p className="text-xs text-white/50">{product.segment}</p>
                </div>
                {isSelected && (
                  <Badge className="bg-[#B5005D] text-white text-xs">Wybrany</Badge>
                )}
              </div>

              <p className="text-sm text-white/80 mb-3">{product.name}</p>

              <div className="flex gap-3 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-white/60">
                  <NexbeIcon name="magazyn-energii" size={14} variant="inherit" className="text-green-400" />
                  {product.batteryCapacity_kWh} kWh
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/60">
                  <NexbeIcon name="smart-ems" size={14} variant="inherit" className="text-amber-400" />
                  {product.inverterPower_kW} kW
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-white/40">Falownik</p>
                  <p className="text-xs text-white/60">{product.inverterModel}</p>
                </div>
                <p className="text-lg font-bold text-[#B5005D]">{formatPLN(price)}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
