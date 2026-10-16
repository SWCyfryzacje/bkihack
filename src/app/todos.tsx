import { FlatList, Text } from 'react-native';
import { useEffect, useState } from 'react';
import SafeView from '@/components/safe-view';
import { supabase } from '@/utils/supabase';

type Todo = {
  id: number | string;
  name: string;
};

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const getTodos = async () => {
      const { data, error } = await supabase.from('todos').select();

      if (error) {
        console.error('Error fetching todos:', error.message);
        return;
      }

      if (data) setTodos(data);
    };

    getTodos();
  }, []);

  return (
    <SafeView className='bg-canvas flex-1 items-center justify-center p-4'>
      <Text className='font-bold text-neutral-900'>Todo List</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text className='text-neutral-900'>{item.name}</Text>
        )}
      />
    </SafeView>
  );
}
