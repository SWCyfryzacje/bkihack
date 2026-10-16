import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import SafeView from '@/components/safe-view';

export default function FormScreen({ children }: { children: ReactNode }) {
  return (
    <SafeView className='bg-canvas flex-1'>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerClassName='grow justify-center gap-4 p-6'
          keyboardShouldPersistTaps='handled'>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeView>
  );
}
