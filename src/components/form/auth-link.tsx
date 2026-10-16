import { Link } from 'expo-router';
import { Text } from 'react-native';

type Props = {
  prompt: string;
  label: string;
  href: '/(auth)/sign-in' | '/(auth)/sign-up';
};

export default function AuthLink({ prompt, label, href }: Props) {
  return (
    <Text className='font-cnt mt-6 text-center text-sm text-neutral-600'>
      {prompt}{' '}
      <Link
        href={href}
        replace
        className='font-cnt-bold text-primary-600'>
        {label}
      </Link>
    </Text>
  );
}
