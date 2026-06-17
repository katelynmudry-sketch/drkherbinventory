import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isMockMode } from '@/lib/mockMode';
import { mockWorkspaceConfig, setMockWorkspaceConfig } from '@/lib/mockData';
import {
  WorkspaceConfig,
  LocationConfig,
  StatusConfig,
  VoiceConfig,
  FeatureFlags,
  DEFAULT_HERBAL_CLINIC_CONFIG,
} from '@/lib/workspaceConfigDefaults';

export type {
  WorkspaceConfig,
  LocationConfig,
  StatusConfig,
  VoiceConfig,
  FeatureFlags,
};

// Fetches the current user's workspace configuration. If no row exists yet
// (e.g. a new signup that hasn't completed onboarding), falls back to the
// herbal-clinic default so the app behaves exactly as it does today.
export function useWorkspaceConfig() {
  return useQuery({
    queryKey: ['workspace_config'],
    queryFn: async (): Promise<WorkspaceConfig> => {
      if (isMockMode) return mockWorkspaceConfig;

      const { data, error } = await supabase
        .from('workspace_config')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      if (!data) return DEFAULT_HERBAL_CLINIC_CONFIG;

      return {
        industry_key: data.industry_key,
        item_label_singular: data.item_label_singular,
        item_label_plural: data.item_label_plural,
        locations: data.locations as unknown as LocationConfig[],
        statuses: data.statuses as unknown as StatusConfig[],
        voice_config: data.voice_config as unknown as VoiceConfig,
        features: data.features as unknown as FeatureFlags,
      };
    },
  });
}

// Creates or replaces the current user's workspace configuration (used by the
// onboarding wizard and any future settings page).
export function useUpdateWorkspaceConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: WorkspaceConfig) => {
      if (isMockMode) {
        setMockWorkspaceConfig(config);
        return config;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('workspace_config')
        .upsert(
          {
            user_id: user.id,
            industry_key: config.industry_key,
            item_label_singular: config.item_label_singular,
            item_label_plural: config.item_label_plural,
            locations: config.locations as unknown as never,
            statuses: config.statuses as unknown as never,
            voice_config: config.voice_config as unknown as never,
            features: config.features as unknown as never,
          },
          { onConflict: 'user_id' }
        )
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace_config'] });
    },
  });
}
