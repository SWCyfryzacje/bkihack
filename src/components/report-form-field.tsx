import { ReactNode } from 'react';
import { Text, View } from 'react-native';

export default function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View className='gap-2'>
      <View className='flex-row items-baseline justify-between'>
        <Text className='font-sans-semibold text-sm text-neutral-800'>
          {label}
        </Text>
        {hint ? (
          <Text className='font-sans text-xs text-neutral-500'>{hint}</Text>
        ) : null}
      </View>
      {children}
      {error ? (
        <Text
          accessibilityLiveRegion='polite'
          className='text-danger font-sans text-sm'>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
