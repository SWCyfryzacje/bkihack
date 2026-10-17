import { useState } from 'react';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import SafeView from '@/components/safe-view';
import AuthHeader from '@/components/auth-header';
import AreaPicker from '@/components/register/area-picker';
import { completeOnboarding } from '@/repositories/profile-repository';
import { OnboardingFormData, OnboardingSchema } from '@/types/zod-types';

export default function Onboarding() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: { firstName: '', lastName: '', areaId: '' },
  });

  const onSubmit = async (data: OnboardingFormData) => {
    setSubmitError(null);
    try {
      await completeOnboarding(data);
      router.replace('/(tabs)');
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Nie udało się zapisać profilu. Spróbuj ponownie.'
      );
    }
  };

  return (
    <SafeView className='bg-canvas flex-1'>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          className='flex-1'
          contentContainerClassName='grow justify-center gap-4 p-6'
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}>
          <View className='w-full gap-4'>
            <AuthHeader
              title='Uzupełnij profil'
              subtitle='Podaj kilka informacji, aby korzystać z głosowań.'
            />

            <View className='gap-1.5'>
              <Text className='font-cnt-bold text-sm text-neutral-700'>
                Imię
              </Text>
              <Controller
                control={control}
                name='firstName'
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    accessibilityLabel='Imię'
                    className='bg-surface font-cnt rounded-xl border border-neutral-200 px-4 py-3 text-base text-neutral-900'
                    placeholder='Wpisz imię'
                    placeholderTextColor='#9c9c95'
                    autoCapitalize='words'
                    autoComplete='given-name'
                    returnKeyType='next'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.firstName && (
                <Text className='font-cnt text-danger text-xs'>
                  {errors.firstName.message}
                </Text>
              )}
            </View>

            <View className='gap-1.5'>
              <Text className='font-cnt-bold text-sm text-neutral-700'>
                Nazwisko
              </Text>
              <Controller
                control={control}
                name='lastName'
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    accessibilityLabel='Nazwisko'
                    className='bg-surface font-cnt rounded-xl border border-neutral-200 px-4 py-3 text-base text-neutral-900'
                    placeholder='Wpisz nazwisko'
                    placeholderTextColor='#9c9c95'
                    autoCapitalize='words'
                    autoComplete='family-name'
                    returnKeyType='next'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.lastName && (
                <Text className='font-cnt text-danger text-xs'>
                  {errors.lastName.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              name='areaId'
              render={({ field: { onChange, value } }) => (
                <AreaPicker
                  value={value || null}
                  onChange={onChange}
                  error={errors.areaId?.message}
                />
              )}
            />

            {submitError && (
              <Text
                accessibilityRole='alert'
                className='font-cnt text-danger text-sm'>
                {submitError}
              </Text>
            )}

            <Pressable
              accessibilityRole='button'
              className={`items-center rounded-xl px-4 py-4 ${isSubmitting ? 'bg-accent-300' : 'bg-accent-500 active:bg-accent-600'}`}
              disabled={isSubmitting}
              onPress={handleSubmit(onSubmit)}>
              <Text className='font-cnt-bold text-base text-white'>
                {isSubmitting ? 'Zapisywanie…' : 'Zapisz i przejdź dalej'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeView>
  );
}
