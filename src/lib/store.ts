// =====================================================
// NEXBE Contract Generator — Zustand Store
// =====================================================

import { create } from 'zustand';
import { ContractData, ContractSummary } from '@/types/contract';
import { generateContractNumber, calculateNetFromGross, calculateTranches } from './contract-helpers';

interface ContractFormState {
  // Current step in the multi-step form
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Contract data being edited
  contractData: Partial<ContractData>;
  updateContractData: (data: Partial<ContractData>) => void;
  resetContractData: () => void;

  // Initialize with defaults
  initializeContract: () => void;

  // Pricing helpers
  updatePricing: (grossPrice: number, vatRate: 8 | 23) => void;
}

const initialContractData: Partial<ContractData> = {
  contractNumber: '',
  contractDate: new Date().toISOString().split('T')[0],
  contractCity: 'Warszawa',
  client: {
    fullName: '',
    address: { street: '', postalCode: '', city: '' },
    pesel: '',
    nip: '',
    phone: '',
    email: '',
  },
  investmentAddress: { street: '', postalCode: '', city: '' },
  existingPV: {
    power_kWp: 0,
    inverterBrand: '',
    inverterModel: '',
    osd: 'PGE',
    currentConnectionPower_kW: 0,
    needsPowerIncrease: false,
  },
  product: {
    id: '',
    brand: '',
    model: '',
    batteryCapacity_kWh: 0,
    inverterModel: '',
    inverterPower_kW: 0,
    type: 'DC_HYBRID',
    ems: 'KENO EMS',
    backupEPS: true,
  },
  pricing: {
    offerPrice: 0,
    contractPrice: 0,
    vatRate: 8,
    netPrice: 0,
    vatAmount: 0,
    grossPrice: 0,
    financing: 'OWN_FUNDS',
    tranches: {
      t1_percent: 30, t1_amount: 0,
      t2_percent: 60, t2_amount: 0,
      t3_percent: 10, t3_amount: 0,
    },
  },
  declarations: {
    buildingType: 'RESIDENTIAL_UNDER_300',
    connectionReady: true,
    electricalCompliant: true,
    meetingType: 'SCHEDULED',
    electronicInvoices: true,
  },
  attachments: {
    poaOSD: true,
    poaSubsidy: true,
    subsidyProgram: 'MOJ_PRAD',
    aum: true,
  },
  salesRep: {
    fullName: '',
    position: 'Przedstawiciel handlowy',
  },
};

export const useContractStore = create<ContractFormState>((set, get) => ({
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

  contractData: { ...initialContractData },

  updateContractData: (data) =>
    set((state) => ({
      contractData: deepMerge(state.contractData, data),
    })),

  resetContractData: () =>
    set({
      currentStep: 0,
      contractData: { ...initialContractData },
    }),

  initializeContract: () => {
    const contractNumber = generateContractNumber();
    set((state) => ({
      contractData: {
        ...state.contractData,
        contractNumber,
        contractDate: new Date().toISOString().split('T')[0],
      },
    }));
  },

  updatePricing: (grossPrice, vatRate) => {
    const { netPrice, vatAmount } = calculateNetFromGross(grossPrice, vatRate);
    const tranches = calculateTranches(grossPrice);
    set((state) => ({
      contractData: {
        ...state.contractData,
        pricing: {
          ...state.contractData.pricing!,
          contractPrice: grossPrice,
          grossPrice,
          netPrice,
          vatAmount,
          vatRate,
          tranches,
        },
      },
    }));
  },
}));

// ──────────── Contracts List Store ────────────

interface ContractsListState {
  contracts: ContractSummary[];
  addContract: (contract: ContractSummary) => void;
  updateContractStatus: (id: string, status: ContractSummary['status']) => void;
  loadContracts: () => void;
  saveContracts: () => void;
}

export const useContractsListStore = create<ContractsListState>((set, get) => ({
  contracts: [],

  addContract: (contract) => {
    set((state) => {
      const updated = [contract, ...state.contracts];
      return { contracts: updated };
    });
    get().saveContracts();
  },

  updateContractStatus: (id, status) => {
    set((state) => ({
      contracts: state.contracts.map((c) =>
        c.id === id ? { ...c, status } : c
      ),
    }));
    get().saveContracts();
  },

  loadContracts: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nexbe_contracts');
      if (stored) {
        try {
          set({ contracts: JSON.parse(stored) });
        } catch {
          set({ contracts: [] });
        }
      }
    }
  },

  saveContracts: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexbe_contracts', JSON.stringify(get().contracts));
    }
  },
}));

// ──────────── Deep Merge Utility ────────────

function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceVal = source[key];
      const targetVal = target[key];
      if (
        sourceVal &&
        typeof sourceVal === 'object' &&
        !Array.isArray(sourceVal) &&
        targetVal &&
        typeof targetVal === 'object' &&
        !Array.isArray(targetVal)
      ) {
        (result as Record<string, unknown>)[key] = deepMerge(
          targetVal as Record<string, unknown>,
          sourceVal as Record<string, unknown>
        );
      } else {
        (result as Record<string, unknown>)[key] = sourceVal;
      }
    }
  }
  return result;
}
