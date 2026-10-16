import { Text, View } from 'react-native';

export default function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View className='mb-6 gap-1'>
      <Text className='font-hd-bold text-accent-500 text-sm tracking-widest uppercase'>
        Wotum · Toruń
      </Text>
      <Text className='font-hd-bold text-primary-900 text-3xl'>{title}</Text>
      <Text className='font-cnt text-base text-neutral-600'>{subtitle}</Text>
    </View>
  );
}
