import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';

import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Button } from 'react-native-elements';
import SwipeableItem from 'react-native-swipeable-item';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';



import { colors } from '../theme.js'; // Import your color palette

export default function TodoList() {
  const insets = useSafeAreaInsets();
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem('todos', JSON.stringify(tasks))
    }
  }, [tasks, isReady]);

  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await AsyncStorage.getItem('todos');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
      setIsReady(true);
    }

    loadTasks();
  }, [])

  const scheduleNotification = async (taskTitle, deadlineDate) => {
    const triggerTime = new Date(deadlineDate); // deadlineDate must be a full Date object

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Due',
        body: `Your task "${taskTitle}" is now due.`,
        sound: true,
      },
      trigger: triggerTime, // Use Date object directly
    });

    return notificationId
  };

  const addTask = () => {
    const trimmed = task.trim();
    if (trimmed) {
      const date = new Date();
      const formattedDate = `${date.getHours()}:${date.getMinutes()}`;

      const newTask = { id: Date.now().toString(), value: trimmed, createdAt: formattedDate};

      setTasks(prev => [...prev, newTask]);
      setTask('');
      setShowTimePicker(true);

      Keyboard.dismiss();
    }
  };

  const deleteTask = async (id) => {
    const taskToDelete = tasks.find(task => task.id === id)

    if (taskToDelete?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(taskToDelete.notificationId);
    }

    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleSelectedTask = (item) => {
    if (selectedTask && selectedTask.id === item.id) {
      setSelectedTask(null);
    } else {
      setSelectedTask(item)
    }
  }

  const onTimeChange = async (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
    const now = new Date();

    const deadline = new Date();
    deadline.setHours(selectedTime.getHours())
    deadline.setMinutes(selectedTime.getMinutes())
    deadline.setSeconds(0);
    deadline.setMilliseconds(0);

    if (deadline < now) {
      return;
    }

      const notificationId = await scheduleNotification(tasks[tasks.length-1].value, deadline);
      
      const timeString = `${selectedTime.getHours()}:${String(selectedTime.getMinutes()).padStart(2, '0')}`;
      
      const updatedTask = { ...tasks[tasks.length - 1], dueDate: timeString, notificationId }; // Update latest task
      
      const updatedTasks = [...tasks.slice(0, -1), updatedTask];
      
      setTasks(updatedTasks);
      await AsyncStorage.setItem('todos', JSON.stringify(updatedTasks));
    }
  };

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Text>Loading ...</Text>
      </View>
    )
  } 

  return (
    <View style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }, styles.container]}>
      <Text style={styles.heading}>My ToDay List</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task"
          placeholderTextColor="#aaa"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={addTask}
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
            <TouchableOpacity style={styles.listItem} activeOpacity={0.8} onPress={() => toggleSelectedTask(item)}>
              {!item?.dueDate && <Text style={styles.dateText}>Noted</Text>}
              {item?.dueDate && <Text style={styles.dateText}>Todo</Text>}
              <Text style={styles.itemText}>{item.value}</Text>
              {selectedTask && selectedTask.id === item.id && (
                <View style={styles.dateContainer}>
                  <View style={styles.createdAtContainer}>
                    <MaterialIcons name='calendar-month' style={{paddingTop: 2}}  color={colors.primary} />
                    <Text style={styles.dateText}>Created At: {selectedTask.createdAt || 'N/A'}</Text>
                  </View>
                  {item?.dueDate && (
                    <View style={styles.createdAtContainer}>
                      <MaterialCommunityIcons name='calendar-clock' style={{paddingTop: 2}} color={colors.primary} />
                      <Text style={styles.dateText}>Deadline: {selectedTask.dueDate || 'N/A'}</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          </SwipeableItem>
        )}
      />
      {showTimePicker && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}
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
  dateContainer: {
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  createdAtContainer: {
    columnGap: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 10,
    fontFamily: 'Oswald-Bold',
    color: colors.primary,
  }
});
