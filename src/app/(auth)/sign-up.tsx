import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Href, Link, Redirect, router } from 'expo-router';
import SafeView from '@/components/safe-view';
import AuthHeader from '@/components/auth-header';
import { useForm } from 'react-hook-form';
import {
  SignFormData,
  SignFormSchema,
  VerifyCodeData,
} from '@/types/zod-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth, useSignUp } from '@clerk/expo';
import SignVerify from '@/components/sign-verify';
import { useEffect, useState } from 'react';
import SignForm from '@/components/sign-form';
import { ProcessedErrors } from '@/types/type';

export default function SignUp() {
  const form = useForm<SignFormData>({ resolver: zodResolver(SignFormSchema) });

  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  const [processedErrors, setProcessedErrors] =
    useState<ProcessedErrors | null>(null);

  const onSubmit = async (data: SignFormData) => {
    const { error } = await signUp.password({
      emailAddress: data.email,
      password: data.password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
    }

    if (!error) {
      await signUp.verifications.sendEmailCode();
    }
  };

  const onVerify = async (data: VerifyCodeData) => {
    await signUp.verifications.verifyEmailCode({
      code: data.code,
    });

    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl('/(tabs)');
          router.replace(url as Href);
        },
      });
    } else {
      console.error('Sign-up attempt not complete:', signUp);
    }
  };

  useEffect(() => {
    Object.entries(errors.fields).forEach(([key, value]) => {
      setProcessedErrors((prevErrors) => ({
        ...prevErrors,
        [key]: value?.message,
      }));
    });
  }, [errors]);

  const handleCodeResend = () => signUp.verifications.sendEmailCode();

  if (signUp.status === 'complete' || isSignedIn) {
    return <Redirect href='/(tabs)' />;
  }

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  )
    return (
      <SignVerify
        errors={processedErrors}
        fetchStatus={fetchStatus}
        email={form.getValues().email}
        onVerify={onVerify}
        codeResend={handleCodeResend}
      />
    );

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
              title='Stwórz konto'
              subtitle='Spraw by twój głos miał znaczenie'
            />

            <SignForm
              form={form}
              onSubmit={form.handleSubmit(onSubmit)}
              fetchStatus={fetchStatus}
              errors={processedErrors}
              zodErrors={form.formState.errors}
              type='sign-up'
            />

            <View className='mt-6 flex-row justify-center gap-1'>
              <Text className='font-cnt text-sm text-neutral-600'>
                Masz już konto?
              </Text>
              <Link
                href='/(auth)/sign-in'
                asChild>
                <Pressable accessibilityRole='link'>
                  <Text className='font-cnt-bold text-accent-600 text-sm'>
                    Zaloguj się
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeView>
  );
}
