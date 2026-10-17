import { Alert, Text, View } from 'react-native';
import SafeView from '@/components/safe-view';
import ReportForm from '@/components/report-form';
import type { ReportFormData } from '@/types/zod-types';
import { insertVoting } from '@/repositories/voting-repository';

export default function Report() {
  const handleSubmit = async (data: ReportFormData): Promise<boolean> => {
    try {
      await insertVoting(data);
      Alert.alert('Inicjatywa opublikowana', 'Dziękujemy za zgłoszenie.');
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
    <SafeView className='bg-canvas flex-1 flex-col gap-6 p-6 pb-0'>
      <View>
        <Text className='font-hd text-3xl font-bold text-neutral-900'>
          Stwórz inicjatywę
        </Text>
        <Text className='font-cnt font-bold text-neutral-600'>
          Dodaj głosowanie na temat, który uważasz za warty uwagi społeczności
        </Text>
      </View>

      <ReportForm onSubmit={handleSubmit} />
    </SafeView>
  );
}
