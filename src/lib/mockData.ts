// In-memory sample backend used when isMockMode is true (see mockMode.ts).
// Lets the UI be clicked through and edited without a real Supabase project.
import type { User } from '@supabase/supabase-js';
import type { Herb, InventoryItem, InventoryLocation, InventoryStatus } from '@/hooks/useInventory';
import type { TinctureBatch } from '@/hooks/useTinctureBatches';
import { DEFAULT_HERBAL_CLINIC_CONFIG, type WorkspaceConfig } from '@/lib/workspaceConfigDefaults';

export const MOCK_USER_ID = 'mock-user';

export const mockUser = {
  id: MOCK_USER_ID,
  email: 'demo@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as unknown as User;

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;
const now = () => new Date().toISOString();

function makeHerb(overrides: Partial<Herb> & { name: string }): Herb {
  return {
    id: nextId('herb'),
    user_id: MOCK_USER_ID,
    common_name: null,
    latin_name: null,
    pinyin_name: null,
    preferred_name: null,
    low_threshold_lb: 2,
    notes: null,
    created_at: now(),
    updated_at: now(),
    ...overrides,
  };
}

export const mockHerbs: Herb[] = [
  makeHerb({ name: 'Echinacea', common_name: 'Echinacea', latin_name: 'Echinacea purpurea', preferred_name: 'common' }),
  makeHerb({ name: 'Elderberry', latin_name: 'Sambucus nigra' }),
  makeHerb({ name: 'Ashwagandha', latin_name: 'Withania somnifera' }),
  makeHerb({ name: 'Milk Thistle', latin_name: 'Silybum marianum' }),
  makeHerb({ name: 'Damiana', latin_name: 'Turnera diffusa' }),
  makeHerb({ name: 'Yarrow', latin_name: 'Achillea millefolium' }),
];

function makeInventory(herb: Herb, overrides: Partial<InventoryItem> & { location: InventoryLocation; status: InventoryStatus }): InventoryItem {
  return {
    id: nextId('inv'),
    user_id: MOCK_USER_ID,
    herb_id: herb.id,
    quantity: 5,
    tincture_started_at: null,
    tincture_ready_at: null,
    current_batch_id: null,
    notes: null,
    created_at: now(),
    updated_at: now(),
    herbs: herb,
    ...overrides,
  };
}

export const mockInventory: InventoryItem[] = [
  makeInventory(mockHerbs[0], { location: 'clinic', status: 'full', quantity: 8 }),
  makeInventory(mockHerbs[1], { location: 'clinic', status: 'low', quantity: 1 }),
  makeInventory(mockHerbs[2], { location: 'backstock', status: 'full', quantity: 12 }),
  makeInventory(mockHerbs[3], { location: 'backstock', status: 'out', quantity: 0 }),
  makeInventory(mockHerbs[4], {
    location: 'tincture',
    status: 'full',
    quantity: 3,
    tincture_started_at: now(),
    tincture_ready_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  }),
  makeInventory(mockHerbs[5], { location: 'bulk', status: 'low', quantity: 4 }),
];

export const mockBatches: TinctureBatch[] = [
  {
    id: nextId('batch'),
    user_id: MOCK_USER_ID,
    herb_id: mockHerbs[4].id,
    batch_number: 'DAM-2026-01',
    batch_date: now().split('T')[0],
    status: 'active',
    pressed_date: now().split('T')[0],
    notes: null,
    bulk_inventory_id: null,
    created_at: now(),
    updated_at: now(),
    herbs: mockHerbs[4],
  },
];

export let mockWorkspaceConfig: WorkspaceConfig = structuredClone(DEFAULT_HERBAL_CLINIC_CONFIG);
export function setMockWorkspaceConfig(config: WorkspaceConfig) {
  mockWorkspaceConfig = config;
}

export function findHerb(id: string): Herb | undefined {
  return mockHerbs.find((h) => h.id === id);
}

export function findHerbByName(name: string): Herb | undefined {
  const target = name.toLowerCase().trim();
  return mockHerbs.find((h) =>
    [h.name, h.common_name, h.latin_name, h.pinyin_name].some((n) => n?.toLowerCase().trim() === target)
  );
}

export function findInventoryByHerbNameAndLocation(herbName: string, location: InventoryLocation): InventoryItem | undefined {
  const target = herbName.toLowerCase().trim();
  return mockInventory.find(
    (item) =>
      item.location === location &&
      item.herbs &&
      [item.herbs.name, item.herbs.common_name, item.herbs.latin_name, item.herbs.pinyin_name].some(
        (n) => n?.toLowerCase().trim() === target
      )
  );
}

export { nextId, now };
