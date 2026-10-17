import { supabase } from '@/lib/supabase';
import type { OnboardingFormData } from '@/types/zod-types';

export async function isProfileComplete(): Promise<boolean> {
  const { data: profileId, error: identityError } =
    await supabase.rpc('current_profile_id');
  if (identityError) {
    throw new Error(
      `Nie udało się sprawdzić profilu: ${identityError.message}`
    );
  }
  if (!profileId) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, last_name, area_id')
    .eq('id', profileId)
    .maybeSingle();
  if (error) {
    throw new Error(`Nie udało się pobrać profilu: ${error.message}`);
  }

  return Boolean(
    data?.first_name.trim() && data.last_name.trim() && data.area_id
  );
}

export async function completeOnboarding(
  profile: OnboardingFormData
): Promise<void> {
  const { error } = await supabase.rpc('complete_onboarding', {
    p_first_name: profile.firstName.trim(),
    p_last_name: profile.lastName.trim(),
    p_area_id: profile.areaId,
  });
  if (error) {
    throw new Error(`Nie udało się zapisać profilu: ${error.message}`);
  }
}
