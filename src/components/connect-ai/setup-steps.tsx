import { Text, View } from 'react-native';

const STEPS = [
  'Wygeneruj adres poniżej i skopiuj go.',
  'Claude: Ustawienia → Connectors → Add custom connector → wklej adres jako URL serwera. Uwierzytelnianie: brak (No sign in).',
  'ChatGPT (z komputera): w lewym pasku kliknij trzy kropki (Więcej) → Wtyczki → Dodaj (prawy górny róg) → Dodaj niestandardowy serwer MCP → wklej adres, jako nazwę wpisz „Wotum”. Uwierzytelnianie: brak.',
  'Napisz w czacie np. „Na moim osiedlu brakuje przejścia dla pieszych”.',
];

export default function SetupSteps() {
  return (
    <View className='gap-3'>
      {STEPS.map((step, i) => (
        <View
          key={i}
          className='flex-row gap-3'>
          <Text className='font-hd-bold text-accent-500 w-5 text-base'>
            {i + 1}.
          </Text>
          <Text className='font-cnt flex-1 text-base text-neutral-700'>
            {step}
          </Text>
        </View>
      ))}
    </View>
  );
}
