import { styled } from 'nativewind';
import { SafeAreaView as SAV } from 'react-native-safe-area-context';
import { ReactNode } from 'react';

const SafeAreaView = styled(SAV);

export default function SafeView({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <SafeAreaView className={className}>{children}</SafeAreaView>;
}
