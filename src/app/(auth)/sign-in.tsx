import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Href, Link, router } from 'expo-router';
import SafeView from '@/components/safe-view';
import AuthHeader from '@/components/auth-header';
import { useForm } from 'react-hook-form';
import {
  SignFormData,
  SignFormSchema,
  VerifyCodeData,
} from '@/types/zod-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@clerk/expo';
import SignVerify from '@/components/sign-verify';
import { useEffect, useState } from 'react';
import SignForm from '@/components/sign-form';
import { ProcessedErrors } from '@/types/type';

export default function SignIn() {
  const form = useForm<SignFormData>({ resolver: zodResolver(SignFormSchema) });

  const { signIn, errors, fetchStatus } = useSignIn();

  const [processedErrors, setProcessedErrors] =
    useState<ProcessedErrors | null>(null);

  const onSubmit = async (data: SignFormData) => {
    const { error } = await signIn.password({
      emailAddress: data.email,
      password: data.password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl('/(tabs)');
          router.replace(url as Href);
        },
      });
    } else if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code'
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error('Sign-in attempt not complete:', signIn);
    }
  };

  const onVerify = async (data: VerifyCodeData) => {
    await signIn.mfa.verifyEmailCode({ code: data.code });

    if (signIn.status === 'complete') {
      await signIn.finalize({
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
      console.error('Sign-in attempt not complete:', signIn);
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

  const handleCodeResend = () => signIn.mfa.sendEmailCode();

  if (signIn.status === 'needs_client_trust')
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
              title='Witaj z powrotem'
              subtitle='Zaloguj się aby wziąć udział w głosowaniach'
            />

            <SignForm
              form={form}
              onSubmit={form.handleSubmit(onSubmit)}
              fetchStatus={fetchStatus}
              errors={processedErrors}
              zodErrors={form.formState.errors}
              type='sign-in'
            />

            <View className='mt-6 flex-row justify-center gap-1'>
              <Text className='font-cnt text-sm text-neutral-600'>
                Nie masz jeszcze konta?
              </Text>
              <Link
                href='/(auth)/sign-up'
                asChild>
                <Pressable accessibilityRole='link'>
                  <Text className='font-cnt-bold text-accent-600 text-sm'>
                    Stwórz konto
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
