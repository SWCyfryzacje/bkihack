import { Pressable, Share, Text, View } from 'react-native';

// Adres connectora: zaznaczalny tekst + systemowe "Udostępnij" (bez dodatkowych bibliotek).
export default function ConnectorUrlCard({ url }: { url: string }) {
  return (
    <View className='bg-surface gap-3 rounded-2xl border border-neutral-200 p-4'>
      <Text className='font-cnt-bold text-sm text-neutral-700'>
        Twój adres connectora
      </Text>
      <Text
        selectable
        className='font-cnt text-primary-700 bg-primary-50 rounded-lg p-3 text-sm'>
        {url}
      </Text>
      <Pressable
        onPress={() => Share.share({ message: url })}
        className='bg-primary-500 active:bg-primary-600 items-center rounded-xl py-3'>
        <Text className='font-cnt-bold text-white'>Udostępnij / kopiuj</Text>
      </Pressable>
      <Text className='font-cnt text-xs text-neutral-500'>
        Ten adres działa jak hasło — kto go zna, może głosować w Twoim imieniu.
        Wygenerowanie nowego unieważnia poprzedni.
      </Text>
    </View>
  );
}
