import { Alert, Text, View } from 'react-native';
import { router } from 'expo-router';
import SafeView from '@/components/safe-view';
import ReportForm from '@/components/report-form';
import type { ReportFormData } from '@/types/zod-types';
import { insertVoting } from '@/repositories/voting-repository';

export default function Report() {
  const handleSubmit = async (data: ReportFormData): Promise<boolean> => {
    try {
      await insertVoting(data);
      router.replace('/(tabs)');
      return true;
    } catch (error) {
      Alert.alert(
        'Nie udało się opublikować inicjatywy',
        error instanceof Error ? error.message : 'Spróbuj ponownie później.'
      );
      return false;
    }
  };

  return (
    <SafeView className='bg-canvas flex-1 flex-col gap-5 p-4 pb-0'>
      <View className='border-primary-100 bg-primary-50 gap-2 rounded-3xl border p-5'>
        <Text className='font-cnt-bold text-primary-700 text-xs tracking-widest'>
          ZGŁOSZENIE MIESZKAŃCA
        </Text>
        <Text className='font-hd-bold text-3xl text-neutral-900'>
          Zgłoś sprawę
        </Text>
        <Text className='font-cnt text-base leading-6 text-neutral-700'>
          Opisz temat, który warto przedstawić lokalnej społeczności.
        </Text>
      </View>

      <ReportForm onSubmit={handleSubmit} />
    </SafeView>
  );
}
