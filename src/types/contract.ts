// =====================================================
// NEXBE Contract Generator — TypeScript Types
// =====================================================

export type OSDOperator = 'PGE' | 'TAURON' | 'ENEA' | 'ENERGA' | 'STOEN' | 'INNY';

export type BuildingType = 'RESIDENTIAL_UNDER_300' | 'RESIDENTIAL_OVER_300' | 'NON_RESIDENTIAL';

export type FinancingType = 'OWN_FUNDS' | 'CREDIT' | 'LEASING';

export type MeetingType = 'SCHEDULED' | 'UNSCHEDULED' | 'REMOTE';

export type SubsidyProgram = 'MOJ_PRAD' | 'CZYSTE_POWIETRZE' | 'OTHER';

export type ContractStatus = 'DRAFT' | 'GENERATED' | 'SENT_FOR_SIGNATURE' | 'SIGNED';

export type ProductType = 'AC_RETROFIT' | 'DC_HYBRID';

export interface Address {
  street: string;
  postalCode: string;
  city: string;
}

export interface ClientData {
  fullName: string;
  address: Address;
  pesel?: string;
  nip?: string;
  phone: string;
  email: string;
}

export interface CoOwnerData {
  fullName: string;
  address: Address;
  pesel?: string;
  phone: string;
  email: string;
}

export interface ExistingPV {
  power_kWp: number;
  inverterBrand: string;
  inverterModel: string;
  osd: OSDOperator;
  osdCustom?: string;
  currentConnectionPower_kW: number;
  needsPowerIncrease: boolean;
  targetConnectionPower_kW?: number;
}

export interface ProductSelection {
  id: string;
  brand: string;
  model: string;
  batteryCapacity_kWh: number;
  inverterModel: string;
  inverterPower_kW: number;
  type: ProductType;
  ems: string;
  backupEPS: boolean;
  evCharger?: { power_kW: number };
  additionalItems?: string[];
}

export interface Pricing {
  offerPrice: number;
  contractPrice: number;
  vatRate: 8 | 23;
  netPrice: number;
  vatAmount: number;
  grossPrice: number;
  financing: FinancingType;
  ownContribution?: number;
  financingInstitution?: string;
  tranches: {
    t1_percent: 30;
    t1_amount: number;
    t2_percent: 60;
    t2_amount: number;
    t3_percent: 10;
    t3_amount: number;
  };
}

export interface Declarations {
  buildingType: BuildingType;
  buildingArea_m2?: number;
  connectionReady: boolean;
  electricalCompliant: boolean;
  meetingType: MeetingType;
  electronicInvoices: boolean;
}

export interface Attachments {
  poaOSD: boolean;
  poaSubsidy: boolean;
  subsidyProgram?: SubsidyProgram;
  subsidyProgramCustom?: string;
  aum: boolean;
}

export interface SalesRep {
  fullName: string;
  position: string;
}

export interface ContractData {
  // Meta
  contractNumber: string;
  contractDate: string;
  contractCity: string;

  // Zamawiający
  client: ClientData;
  coOwner?: CoOwnerData;

  // Adres inwestycji
  investmentAddress: Address;

  // Istniejąca instalacja PV
  existingPV: ExistingPV;

  // Produkt
  product: ProductSelection;

  // Cena
  pricing: Pricing;

  // Oświadczenia
  declarations: Declarations;

  // Załączniki
  attachments: Attachments;

  // Handlowiec
  salesRep: SalesRep;
}

// Dla dashboardu — podsumowanie umowy
export interface ContractSummary {
  id: string;
  contractNumber: string;
  clientName: string;
  productName: string;
  grossPrice: number;
  status: ContractStatus;
  createdAt: string;
  contractData: ContractData;
}

// Produkt z katalogu
export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  batteryModel: string;
  batteryCapacity_kWh: number;
  inverterModel: string;
  inverterPower_kW: number;
  type: ProductType;
  segment: string;
  price_gross_a: number; // Wariant A (EPS)
  price_gross_b: number; // Wariant B (pełny backup SZR)
  warranty_battery_years: number;
  warranty_inverter_years: number;
  image: string;
}
