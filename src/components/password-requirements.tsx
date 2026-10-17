import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import {
  PASSWORD_BREACH_HINT,
  PASSWORD_RULES,
} from '@/constants/password-rules';

type Props = {
  password: string;
  // po próbie wysłania niespełnione wymagania podświetlamy na czerwono
  showErrors: boolean;
  breached: boolean;
};

type Status = 'met' | 'unmet' | 'failed';

const STATUS_STYLES: Record<
  Status,
  {
    icon: 'checkmark-circle' | 'ellipse-outline' | 'close-circle';
    color: string;
    text: string;
  }
> = {
  met: { icon: 'checkmark-circle', color: '#1f8a5b', text: 'text-success' },
  unmet: {
    icon: 'ellipse-outline',
    color: '#9c9c95',
    text: 'text-neutral-500',
  },
  failed: { icon: 'close-circle', color: '#d03a3a', text: 'text-danger' },
};

function Requirement({ label, status }: { label: string; status: Status }) {
  const style = STATUS_STYLES[status];

  return (
    <View className='flex-row items-center gap-1.5'>
      <Ionicons
        name={style.icon}
        size={14}
        color={style.color}
      />
      <Text className={`font-cnt text-xs ${style.text}`}>{label}</Text>
    </View>
  );
}

export default function PasswordRequirements({
  password,
  showErrors,
  breached,
}: Props) {
  return (
    <View className='gap-1'>
      {PASSWORD_RULES.map((rule, index) => (
        <Requirement
          key={index}
          label={rule.label(password)}
          status={rule.test(password) ? 'met' : showErrors ? 'failed' : 'unmet'}
        />
      ))}
      <Requirement
        label={PASSWORD_BREACH_HINT}
        status={breached ? 'failed' : 'unmet'}
      />
    </View>
  );
}
