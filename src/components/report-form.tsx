import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormFeatures, SCOPES } from '@/constants/form-features';
import { ReportFormData, ReportFormSchema } from '@/types/zod-types';
import Field from '@/components/report-form-field';
import Chip from '@/components/report-form-chip';

export default function ReportForm({
  onSubmit,
}: {
  onSubmit: (values: ReportFormData) => Promise<boolean> | boolean;
}) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormData>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      title: '',
      description: '',
      isAnonymous: false,
    },
  });

  const descriptionLength = watch('description')?.length ?? 0;

  const submitForm = async (values: ReportFormData) => {
    if (await onSubmit(values)) reset();
  };

  const inputBase =
    'rounded-xl border bg-surface pl-4 pr-4 font-sans text-base text-neutral-900';

  return (
    <ScrollView
      className='bg-canvas'
      contentContainerClassName='gap-6 pb-4'
      keyboardShouldPersistTaps='handled'>
      <Controller
        control={control}
        name='title'
        render={({ field: { onChange, onBlur, value } }) => (
          <Field
            label='Tytuł'
            error={errors.title?.message}
            hint={`${value.length}/80`}>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder='np. Uszkodzone lampy na ulicy Głównej'
              placeholderTextColor='#9c9c95'
              maxLength={80}
              returnKeyType='next'
              className={`${inputBase} ${errors.title ? 'border-danger' : 'border-neutral-200'}`}
            />
          </Field>
        )}
      />

      <Controller
        control={control}
        name='scope'
        render={({ field: { onChange, value } }) => (
          <Field
            label='Zasięg'
            error={errors.scope?.message}>
            <View
              accessibilityRole='radiogroup'
              className='flex-row flex-wrap gap-2'>
              {SCOPES.map((scope) => (
                <Chip
                  key={scope.value}
                  label={scope.label}
                  selected={value === scope.value}
                  onPress={() => onChange(scope.value)}
                />
              ))}
            </View>
          </Field>
        )}
      />

      <Controller
        control={control}
        name='description'
        render={({ field: { onChange, onBlur, value } }) => (
          <Field
            label='Opis'
            error={errors.description?.message}
            hint={`${descriptionLength}/1000`}>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder='Jaki jest problem, gdzie i od kiedy?'
              placeholderTextColor='#9c9c95'
              multiline
              maxLength={1000}
              textAlignVertical='top'
              className={`${inputBase} min-h-36 ${
                errors.description ? 'border-danger' : 'border-neutral-200'
              }`}
            />
          </Field>
        )}
      />

      <Controller
        control={control}
        name='category'
        render={({ field: { onChange, value } }) => (
          <Field
            label='Kategoria'
            error={errors.category?.message}>
            <View
              accessibilityRole='radiogroup'
              className='flex-row flex-wrap gap-2'>
              {FormFeatures.map((c) => (
                <Chip
                  key={c.value}
                  label={c.label}
                  selected={value === c.value}
                  onPress={() => onChange(c.value)}
                />
              ))}
            </View>
          </Field>
        )}
      />

      <Controller
        control={control}
        name='isAnonymous'
        render={({ field: { onChange, value } }) => (
          <View className='bg-surface flex-row items-center justify-between rounded-xl border border-neutral-200 p-4'>
            <View className='flex-1 pr-4'>
              <Text className='font-sans-semibold text-base text-neutral-900'>
                Dodaj anonimowo
              </Text>
              <Text className='font-sans text-sm text-neutral-600'>
                Twoje dane nie będą widoczne dla innych mieszkańców.
              </Text>
            </View>
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ true: '#1a6086', false: '#dcdcd8' }}
            />
          </View>
        )}
      />

      <Pressable
        onPress={handleSubmit(submitForm)}
        disabled={isSubmitting}
        accessibilityRole='button'
        className='bg-primary-600 active:bg-primary-700 items-center rounded-xl py-4 disabled:opacity-50'>
        <Text className='font-sans-semibold text-base text-white'>
          {isSubmitting ? 'Publikowanie…' : 'Opublikuj inicjatywę'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
