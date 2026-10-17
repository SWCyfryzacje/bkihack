import SafeView from '@/components/safe-view';
import AuthHeader from '@/components/auth-header';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { VerifyCodeSchema, VerifyCodeData } from '@/types/zod-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProcessedErrors } from '@/types/type';

type Props = {
  fetchStatus: 'fetching' | 'idle';
  errors: ProcessedErrors | null;
  email: string;
  onVerify: (data: VerifyCodeData) => void;
  codeResend: () => void;
};

export default function SignVerify({
  fetchStatus,
  errors,
  email,
  onVerify,
  codeResend,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors: zodErrors },
    getValues,
    watch,
  } = useForm<VerifyCodeData>({ resolver: zodResolver(VerifyCodeSchema) });

  const code = watch('code') || '';

  return (
    <SafeView className='bg-canvas flex-1'>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          className='flex-1'
          contentContainerClassName='grow justify-center gap-4 p-6'
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}>
          <View className='w-full gap-4'>
            <AuthHeader
              title='Zweryfikuj konto'
              subtitle={`Wysłaliśmy kod weryfikacyjny na adres ${email}`}
            />

            <View className='gap-4'>
              <View className='gap-1.5'>
                <Text className='font-cnt-bold text-sm text-neutral-700'>
                  Kod weryfikacyjny
                </Text>
                <Controller
                  control={control}
                  name='code'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className='bg-surface font-cnt rounded-xl border border-neutral-200 py-3 pr-14 pl-4 text-base text-neutral-900'
                      placeholderTextColor='#9c9c95'
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder='Enter 6-digit code'
                      keyboardType='number-pad'
                      autoComplete='one-time-code'
                    />
                  )}
                />
                {errors?.email && (
                  <Text className='font-cnt text-danger text-xs'>
                    {errors.email}
                  </Text>
                )}
                {zodErrors.code && !errors?.email && (
                  <Text className='font-cnt text-danger text-xs'>
                    {zodErrors.code.message}
                  </Text>
                )}
              </View>

              <Pressable
                className={`items-center rounded-xl px-4 py-4 ${code.length < 6 || fetchStatus === 'fetching' ? 'bg-accent-300' : 'bg-accent-500 active:bg-accent-600'}`}
                onPress={handleSubmit(onVerify)}
                disabled={!getValues().code || fetchStatus === 'fetching'}>
                <Text className='font-cnt-bold text-base text-white'>
                  {code.length === 6 && fetchStatus === 'fetching'
                    ? 'Weryfikacja...'
                    : 'Zweryfikuj'}
                </Text>
              </Pressable>

              <Pressable
                className='border-accent-500 active:bg-accent-50 items-center rounded-xl border px-4 py-3'
                onPress={() => codeResend()}
                disabled={fetchStatus === 'fetching'}>
                <Text className='font-cnt-bold text-accent-700 text-sm'>
                  Wyślij ponownie
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeView>
  );
}
