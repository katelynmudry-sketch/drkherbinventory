import { LocationConfig, StatusConfig, WorkspaceConfig } from '@/lib/workspaceConfigDefaults';

export function slugify(label: string, fallback: string): string {
  const slug = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return slug || fallback;
}

export function makeBlankLocation(existing: LocationConfig[]): LocationConfig {
  const id = slugify(`location_${existing.length + 1}`, `location_${existing.length + 1}`);
  return {
    id,
    label: 'New Location',
    icon: 'package',
    synonyms: ['new location'],
    flags: {},
  };
}

export function makeBlankStatus(existing: StatusConfig[]): StatusConfig {
  const id = slugify(`status_${existing.length + 1}`, `status_${existing.length + 1}`);
  return {
    id,
    label: 'New Status',
    color: 'gray',
    synonyms: ['new status'],
    isThresholdDerived: false,
  };
}

// A minimal, mostly-empty starting point for "start from scratch".
export const BLANK_CUSTOM_CONFIG: WorkspaceConfig = {
  industry_key: 'custom',
  item_label_singular: 'item',
  item_label_plural: 'items',
  locations: [
    {
      id: 'primary',
      label: 'Primary Location',
      icon: 'package',
      synonyms: ['primary location'],
      flags: { isPrimaryDispensary: true },
    },
  ],
  statuses: [
    { id: 'in_stock', label: 'In Stock', color: 'green', synonyms: ['in stock', 'full'], isThresholdDerived: false },
    { id: 'low', label: 'Low', color: 'yellow', synonyms: ['low'], isThresholdDerived: true },
    { id: 'out', label: 'Out', color: 'red', synonyms: ['out', 'empty'], isThresholdDerived: true },
  ],
  voice_config: {
    addVerbs: ['add', 'put'],
    removeVerbs: ['remove', 'delete'],
    changeVerbs: ['change', 'set', 'mark', 'update'],
    tabLocations: { inventory: ['primary'] },
    defaultLocationByTab: {},
  },
  features: {
    maceration: false,
    batchTracking: false,
    supplierPricing: false,
    bulkWeightCounting: false,
  },
};
