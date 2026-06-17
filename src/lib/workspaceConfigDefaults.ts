// Types and presets for workspace_config — the per-deployment configuration
// that drives locations, statuses, terminology, voice vocabulary, and feature
// flags. The "herbal_clinic" preset reproduces today's hardcoded app behavior
// exactly; other presets adapt the same app to different industries.

export interface LocationFlags {
  /** This location participates in the maceration/batch-tracking workflow. */
  hasMaceration?: boolean;
  /** Quantity for this location is tracked as a bulk weight rather than unit count. */
  isBulkWeight?: boolean;
  /** This is the "front of house" location that triggers availability checks against backstock. */
  isPrimaryDispensary?: boolean;
}

export interface LocationConfig {
  id: string;
  label: string;
  icon: string;
  synonyms: string[];
  flags: LocationFlags;
}

export interface StatusConfig {
  id: string;
  label: string;
  color: string;
  synonyms: string[];
  /** True if this status can be computed from quantity vs. a threshold (e.g. low/out). */
  isThresholdDerived: boolean;
}

export interface VoiceConfig {
  addVerbs: string[];
  removeVerbs: string[];
  changeVerbs: string[];
  /** Maps a UI tab name to the location ids visible/relevant in that tab. */
  tabLocations: Record<string, string[]>;
  /** Maps a UI tab name to the location id to default to when none is spoken. */
  defaultLocationByTab: Record<string, string>;
  /** Location to default to when a low/out status is spoken with no explicit location. */
  lowStockDefaultLocation?: string;
}

export interface FeatureFlags {
  maceration: boolean;
  batchTracking: boolean;
  supplierPricing: boolean;
  bulkWeightCounting: boolean;
}

export interface WorkspaceConfig {
  industry_key: string;
  item_label_singular: string;
  item_label_plural: string;
  locations: LocationConfig[];
  statuses: StatusConfig[];
  voice_config: VoiceConfig;
  features: FeatureFlags;
}

// Reproduces today's hardcoded herbal-clinic behavior exactly. Matches the
// DEFAULT values in supabase/migrations/20260615_workspace_config.sql.
export const DEFAULT_HERBAL_CLINIC_CONFIG: WorkspaceConfig = {
  industry_key: 'herbal_clinic',
  item_label_singular: 'herb',
  item_label_plural: 'herbs',
  locations: [
    {
      id: 'backstock',
      label: 'Backstock',
      icon: 'package',
      synonyms: ['backstock', 'back stock'],
      flags: { hasMaceration: true, isBulkWeight: false },
    },
    {
      id: 'tincture',
      label: 'Tinctures',
      icon: 'droplets',
      synonyms: ['tincture', 'tinctures'],
      flags: { hasMaceration: true, isBulkWeight: false },
    },
    {
      id: 'clinic',
      label: 'Clinic Stock',
      icon: 'stethoscope',
      synonyms: ['clinic'],
      flags: { hasMaceration: false, isBulkWeight: false, isPrimaryDispensary: true },
    },
    {
      id: 'bulk',
      label: 'Bulk Herbs',
      icon: 'package2',
      synonyms: ['bulk'],
      flags: { hasMaceration: false, isBulkWeight: true },
    },
    {
      id: 'bulk_backstock',
      label: 'Bulk Backstock',
      icon: 'package2',
      synonyms: ['bulk backstock'],
      flags: { hasMaceration: false, isBulkWeight: true },
    },
  ],
  statuses: [
    { id: 'full', label: 'Full', color: 'green', synonyms: ['full'], isThresholdDerived: false },
    { id: 'low', label: 'Low', color: 'yellow', synonyms: ['low', 'running low'], isThresholdDerived: true },
    { id: 'out', label: 'Out', color: 'red', synonyms: ['out', 'empty', 'out of stock'], isThresholdDerived: true },
    { id: 'ordered', label: 'Ordered', color: 'blue', synonyms: ['ordered'], isThresholdDerived: false },
  ],
  voice_config: {
    addVerbs: ['add', 'put'],
    removeVerbs: ['remove', 'delete', 'take out'],
    changeVerbs: ['change', 'set', 'mark', 'update'],
    tabLocations: { tinctures: ['clinic', 'backstock', 'tincture'], bulk: ['bulk'] },
    defaultLocationByTab: { bulk: 'bulk' },
    lowStockDefaultLocation: 'clinic',
  },
  features: {
    maceration: true,
    batchTracking: true,
    supplierPricing: true,
    bulkWeightCounting: true,
  },
};

// General retail: a storefront with backroom storage and an online warehouse.
// No maceration/batch tracking; supplier pricing remains useful for reordering.
export const GENERAL_RETAIL_CONFIG: WorkspaceConfig = {
  industry_key: 'general_retail',
  item_label_singular: 'product',
  item_label_plural: 'products',
  locations: [
    {
      id: 'storefront',
      label: 'Storefront',
      icon: 'store',
      synonyms: ['storefront', 'store', 'floor', 'shop floor'],
      flags: { hasMaceration: false, isBulkWeight: false, isPrimaryDispensary: true },
    },
    {
      id: 'storage',
      label: 'Storage',
      icon: 'package',
      synonyms: ['storage', 'back room', 'backroom', 'stockroom'],
      flags: { hasMaceration: false, isBulkWeight: false },
    },
    {
      id: 'online_warehouse',
      label: 'Online Warehouse',
      icon: 'package2',
      synonyms: ['online warehouse', 'warehouse', 'online'],
      flags: { hasMaceration: false, isBulkWeight: false },
    },
  ],
  statuses: [
    { id: 'in_stock', label: 'In Stock', color: 'green', synonyms: ['in stock', 'stocked', 'full'], isThresholdDerived: false },
    { id: 'low_stock', label: 'Low Stock', color: 'yellow', synonyms: ['low', 'low stock', 'running low'], isThresholdDerived: true },
    { id: 'out_of_stock', label: 'Out of Stock', color: 'red', synonyms: ['out', 'out of stock', 'empty'], isThresholdDerived: true },
    { id: 'discontinued', label: 'Discontinued', color: 'gray', synonyms: ['discontinued'], isThresholdDerived: false },
  ],
  voice_config: {
    addVerbs: ['add', 'put', 'received', 'receive'],
    removeVerbs: ['remove', 'delete', 'take out', 'sold'],
    changeVerbs: ['change', 'set', 'mark', 'update'],
    tabLocations: { inventory: ['storefront', 'storage', 'online_warehouse'] },
    defaultLocationByTab: {},
    lowStockDefaultLocation: 'storefront',
  },
  features: {
    maceration: false,
    batchTracking: false,
    supplierPricing: true,
    bulkWeightCounting: false,
  },
};

// Construction/trades: materials tracked across a job site, warehouse, truck,
// and tool crib. Statuses reflect equipment condition/availability rather than
// simple stock levels.
export const CONSTRUCTION_TRADES_CONFIG: WorkspaceConfig = {
  industry_key: 'construction_trades',
  item_label_singular: 'material',
  item_label_plural: 'materials',
  locations: [
    {
      id: 'jobsite',
      label: 'Job Site',
      icon: 'hard-hat',
      synonyms: ['job site', 'jobsite', 'site'],
      flags: { hasMaceration: false, isBulkWeight: false, isPrimaryDispensary: true },
    },
    {
      id: 'warehouse',
      label: 'Warehouse',
      icon: 'warehouse',
      synonyms: ['warehouse', 'shop'],
      flags: { hasMaceration: false, isBulkWeight: false },
    },
    {
      id: 'truck',
      label: 'Truck',
      icon: 'truck',
      synonyms: ['truck', 'van'],
      flags: { hasMaceration: false, isBulkWeight: false },
    },
    {
      id: 'tool_crib',
      label: 'Tool Crib',
      icon: 'wrench',
      synonyms: ['tool crib', 'tools'],
      flags: { hasMaceration: false, isBulkWeight: false },
    },
  ],
  statuses: [
    { id: 'available', label: 'Available', color: 'green', synonyms: ['available', 'full', 'in stock'], isThresholdDerived: false },
    { id: 'in_use', label: 'In Use', color: 'blue', synonyms: ['in use', 'checked out', 'out on site'], isThresholdDerived: false },
    { id: 'needs_repair', label: 'Needs Repair', color: 'yellow', synonyms: ['needs repair', 'broken', 'damaged'], isThresholdDerived: false },
    { id: 'out_of_stock', label: 'Out of Stock', color: 'red', synonyms: ['out', 'out of stock', 'empty', 'none left'], isThresholdDerived: true },
  ],
  voice_config: {
    addVerbs: ['add', 'put', 'delivered', 'received'],
    removeVerbs: ['remove', 'delete', 'take out', 'used'],
    changeVerbs: ['change', 'set', 'mark', 'update'],
    tabLocations: { inventory: ['jobsite', 'warehouse', 'truck', 'tool_crib'] },
    defaultLocationByTab: {},
    lowStockDefaultLocation: 'warehouse',
  },
  features: {
    maceration: false,
    batchTracking: false,
    supplierPricing: true,
    bulkWeightCounting: false,
  },
};

export const PRESET_CONFIGS: Record<string, WorkspaceConfig> = {
  herbal_clinic: DEFAULT_HERBAL_CLINIC_CONFIG,
  general_retail: GENERAL_RETAIL_CONFIG,
  construction_trades: CONSTRUCTION_TRADES_CONFIG,
};
