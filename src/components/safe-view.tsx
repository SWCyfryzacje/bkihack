import { styled } from 'nativewind';
import { SafeAreaView as SAV } from 'react-native-safe-area-context';
import { ReactNode } from 'react';
import { TAB_SCREEN_EDGES } from '@/constants/settings';

const SafeAreaView = styled(SAV);

export default function SafeView({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <SafeAreaView
      className={className}
      edges={TAB_SCREEN_EDGES}>
      {children}
    </SafeAreaView>
  );
}
