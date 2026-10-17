import { Pressable, Text, TextInput, View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { SignFormData } from '@/types/zod-types';
import { useState } from 'react';
import { ProcessedErrors } from '@/types/type';

type Props = {
  form: UseFormReturn<SignFormData>;
  onSubmit: () => void;
  fetchStatus: 'fetching' | 'idle';
  errors: ProcessedErrors | null;
  zodErrors: any;
  type: 'sign-in' | 'sign-up';
};

export default function SignForm({
  form,
  onSubmit,
  fetchStatus,
  errors,
  zodErrors,
  type,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className='gap-4'>
      <View className='gap-1.5'>
        <Text className='font-cnt-bold text-sm text-neutral-700'>
          Adres e-mail
        </Text>
        <Controller
          control={form.control}
          name='email'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className='bg-surface font-cnt rounded-xl border border-neutral-200 py-3 pr-14 pl-4 text-base text-neutral-900'
              placeholderTextColor='#9c9c95'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder='Wpisz adres e-mail'
              keyboardType='email-address'
              autoComplete='email'
            />
          )}
        />
        {errors?.email && (
          <Text className='font-cnt text-danger text-xs'>{errors.email}</Text>
        )}
        {zodErrors.email && !errors?.email && (
          <Text className='font-cnt text-danger text-xs'>
            {zodErrors.email.message}
          </Text>
        )}
      </View>

      <View className='gap-1.5'>
        <Text className='font-cnt-bold text-sm text-neutral-700'>Hasło</Text>
        <Controller
          control={form.control}
          name='password'
          render={({ field: { onChange, onBlur, value } }) => (
            <View className='relative justify-center'>
              <TextInput
                className='bg-surface font-cnt rounded-xl border border-neutral-200 py-3 pr-14 pl-4 text-base text-neutral-900'
                placeholderTextColor='#9c9c95'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder='Wpisz hasło'
                keyboardType='default'
                autoComplete='password'
                textContentType='password'
                secureTextEntry={!showPassword}
              />
              <Pressable
                className='absolute right-4 p-1'
                hitSlop={8}
                onPress={() => setShowPassword((prev) => !prev)}
                accessibilityRole='button'
                accessibilityLabel={
                  showPassword ? 'Hide password' : 'Show password'
                }>
                <Text
                  className={`font-cnt-bold ${showPassword ? 'text-accent-600' : 'text-neutral-500'}`}>
                  {showPassword ? 'Ukryj' : 'Pokaż'}
                </Text>
              </Pressable>
            </View>
          )}
        />
        {errors?.password && (
          <Text className='font-cnt text-danger text-xs'>
            {errors.password}
          </Text>
        )}
        {zodErrors.password && !errors?.password && (
          <Text className='font-cnt text-danger text-xs'>
            {zodErrors.password.message}
          </Text>
        )}
      </View>

      <Pressable
        className={`items-center rounded-xl px-4 py-4 ${fetchStatus === 'fetching' ? 'bg-accent-300' : 'bg-accent-500 active:bg-accent-600'}`}
        onPress={onSubmit}
        disabled={fetchStatus === 'fetching'}>
        <Text className='font-cnt-bold text-base text-white'>
          {fetchStatus === 'fetching'
            ? type === 'sign-in'
              ? 'Logowanie...'
              : 'Rejestrowanie...'
            : type === 'sign-in'
              ? 'Zaloguj się'
              : 'Stwórz konto'}
        </Text>
      </Pressable>
    </View>
  );
}
