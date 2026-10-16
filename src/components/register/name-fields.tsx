import { View } from 'react-native';
import TextField from '@/components/form/text-field';

type Props = {
  firstName: string;
  lastName: string;
  onChange: (field: 'firstName' | 'lastName', value: string) => void;
  errors: { firstName?: string; lastName?: string };
};

export default function NameFields({
  firstName,
  lastName,
  onChange,
  errors,
}: Props) {
  return (
    <View className='gap-4'>
      <TextField
        label='Imię'
        placeholder='Jan'
        autoComplete='given-name'
        value={firstName}
        onChangeText={(v) => onChange('firstName', v)}
        error={errors.firstName}
      />
      <TextField
        label='Nazwisko'
        placeholder='Kowalski'
        autoComplete='family-name'
        value={lastName}
        onChangeText={(v) => onChange('lastName', v)}
        error={errors.lastName}
      />
    </View>
  );
}
