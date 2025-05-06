import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SwipeableItem from 'react-native-swipeable-item';
import { Button } from 'react-native-elements';

import { colors } from '../theme.js'; // Import your color palette

export default function TodoList() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const insets = useSafeAreaInsets();

  const addTask = () => {
    const trimmed = task.trim();
    if (trimmed) {
      const newTask = { id: Date.now().toString(), value: trimmed };
      setTasks(prev => [...prev, newTask]);
      setTask('');
    }
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <View style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }, styles.container]}>
      <Text style={styles.heading}>My ToDo List</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task"
          placeholderTextColor="#aaa"
          value={task}
          onChangeText={setTask}
          returnKeyType="done"
        />
        <Button
          title="Add"
          buttonStyle={{ backgroundColor: colors.secondary }}
          titleStyle={{ color: colors.grey }}
          onPress={addTask}
        />
      </View>

      <FlatList
        style={styles.list}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableItem
            key={item.id}
            snapPointsRight={[80]} // Only allow swipe left to reveal right side
            onChange={(open) => {
              if (open) {
                deleteTask(item.id);
              }
            }}
          >
            <View style={styles.listItem}>
              <Text style={styles.itemText}>{item.value}</Text>
            </View>
          </SwipeableItem>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
});
