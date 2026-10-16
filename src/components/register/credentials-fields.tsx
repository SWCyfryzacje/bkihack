import { View } from 'react-native';
import TextField from '@/components/form/text-field';

type Props = {
  email: string;
  password: string;
  onChange: (field: 'email' | 'password', value: string) => void;
  errors: { email?: string; password?: string };
};

export default function CredentialsFields({
  email,
  password,
  onChange,
  errors,
}: Props) {
  return (
    <View className='gap-4'>
      <TextField
        label='E-mail'
        placeholder='jan@example.com'
        autoCapitalize='none'
        autoComplete='email'
        keyboardType='email-address'
        value={email}
        onChangeText={(v) => onChange('email', v)}
        error={errors.email}
      />
      <TextField
        label='Hasło'
        placeholder='Minimum 6 znaków'
        secureTextEntry
        autoComplete='password'
        value={password}
        onChangeText={(v) => onChange('password', v)}
        error={errors.password}
      />
    </View>
  );
}
