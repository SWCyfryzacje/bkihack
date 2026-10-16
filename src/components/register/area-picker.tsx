import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAreas } from '@/api';
import AreaRow from '@/components/register/area-row';

type Props = {
  value: string | null;
  onChange: (areaId: string) => void;
  error?: string;
};

export default function AreaPicker({ value, onChange, error }: Props) {
  const { areas, loading, error: loadError } = useAreas('osiedle');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const visible = areas.filter((a) => a.name.toLowerCase().includes(q));
  const selected = areas.find((a) => a.id === value);
  const border = error ? 'border-danger' : 'border-neutral-200';

  return (
    <View className='gap-1.5'>
      <Text className='font-cnt-bold text-sm text-neutral-700'>
        Osiedle{selected ? `: ${selected.name}` : ''}
      </Text>
      <View className={`bg-surface rounded-xl border p-2 ${border}`}>
        <TextInput
          placeholder='Szukaj osiedla…'
          placeholderTextColor='#9c9c95'
          value={query}
          onChangeText={setQuery}
          className='font-cnt mb-2 rounded-lg bg-neutral-50 px-3 py-2.5 text-base text-neutral-900'
        />
        {loading && (
          <ActivityIndicator
            color='#2078a3'
            className='my-4'
          />
        )}
        {loadError && (
          <Text className='font-cnt text-danger p-3 text-sm'>
            Nie udało się wczytać osiedli.
          </Text>
        )}
        <ScrollView
          className='max-h-56'
          nestedScrollEnabled>
          {visible.map((a) => (
            <AreaRow
              key={a.id}
              name={a.name}
              selected={a.id === value}
              onPress={() => onChange(a.id)}
            />
          ))}
          {!loading && !visible.length && (
            <Text className='font-cnt p-3 text-sm text-neutral-500'>
              Brak wyników.
            </Text>
          )}
        </ScrollView>
      </View>
      {error && <Text className='font-cnt text-danger text-xs'>{error}</Text>}
    </View>
  );
}
