import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from 'react-native-elements';

import { colors } from '../theme.js'; // Import your color palette

export default function TodoList() {
  // Task input value
  const [task, setTask] = useState('');

  // Array of tasks
  const [tasks, setTasks] = useState([]);

  // Get safe area insets for notch/padding (iOS)
  const insets = useSafeAreaInsets();

  // Add a task to the list
  const addTask = () => {
    const trimmed = task.trim();
    if (trimmed) {
      const newTask = { id: Date.now().toString(), value: trimmed };
      setTasks(prev => [...prev, newTask]);
      setTask('');
    }
  };

  return (
    <View style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }, styles.container]}>
      {/* Set status bar color and text/icon style */}
      <Text style={styles.heading}>My ToDo List</Text>

      {/* Input and add button row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task"
          placeholderTextColor="#aaa"
          value={task}
          onChangeText={setTask}
          returnKeyType="done"
        />
        <Button title="Add" buttonStyle={{backgroundColor: colors.secondary}} titleStyle={{color: colors.grey}} onPress={addTask} />
      </View>

      {/* Task list */}
      <FlatList
        style={styles.list}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
            <Text style={styles.itemText}>{item.value}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: 32,
    marginTop: 8,
    marginBottom: 32,
    color: colors.white,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Oswald-Bold',
    // You can add fontFamily if using custom fonts
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: colors.secondary,
  },
  list: {
    flex: 1,
  },
  listItem: {
    padding: 12,
    backgroundColor: colors.secondary,
    borderRadius: 4,
    marginBottom: 8,

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,

    // Elevation (Android)
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#000', // Ensure text is visible
  },
});
