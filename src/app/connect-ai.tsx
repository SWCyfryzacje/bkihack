import { Pressable, ScrollView, Text } from 'react-native';
import { router } from 'expo-router';
import SafeView from '@/components/safe-view';
import AuthHeader from '@/components/form/auth-header';
import FormError from '@/components/form/form-error';
import PrimaryButton from '@/components/form/primary-button';
import SetupSteps from '@/components/connect-ai/setup-steps';
import ConnectorUrlCard from '@/components/connect-ai/connector-url-card';
import { useConnectorUrl } from '@/components/connect-ai/use-connector-url';

// Ekran "Połącz z AI": użytkownik dostaje osobisty adres serwera MCP
// i podpina go w Claude / ChatGPT, żeby zgłaszać i głosować z czatu.
export default function ConnectAi() {
  const { url, error, loading, generate } = useConnectorUrl();

  return (
    <SafeView className='bg-canvas flex-1'>
      <ScrollView contentContainerClassName='gap-6 p-6'>
        <Pressable onPress={() => router.back()}>
          <Text className='font-cnt text-primary-600 text-base'>← Wróć</Text>
        </Pressable>
        <AuthHeader
          title='Połącz z AI'
          subtitle='Zgłaszaj problemy i głosuj, rozmawiając z Claude lub ChatGPT.'
        />
        <SetupSteps />
        <FormError message={error} />
        {url && <ConnectorUrlCard url={url} />}
        <PrimaryButton
          title={url ? 'Wygeneruj nowy adres' : 'Wygeneruj adres'}
          onPress={generate}
          loading={loading}
        />
      </ScrollView>
    </SafeView>
  );
}
