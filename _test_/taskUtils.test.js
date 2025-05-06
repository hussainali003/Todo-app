/* eslint-disable no-undef */
import { createNewTask } from '../utils/taskUtils';

test('should create a task with trimmed value and timestamp', () => {
  const mockDate = new Date('2025-05-06T14:05:00');
  const input = '  Buy Milk  ';
  const task = createNewTask(input, mockDate);

  expect(task).toEqual({
    id: mockDate.getTime().toString(),
    value: 'Buy Milk',
    createdAt: '14:5'
  });
});

test('should return null for empty input', () => {
  expect(createNewTask('   ', new Date())).toBeNull();
});

import { removeTask } from '../utils/taskUtils';

test('removes task by ID', () => {
  const tasks = [
    { id: '1', value: 'Buy milk' },
    { id: '2', value: 'Walk dog' },
  ];

  const updated = removeTask(tasks, '1');
  expect(updated).toEqual([{ id: '2', value: 'Walk dog' }]);
});

test('returns original array if ID not found', () => {
  const tasks = [{ id: '1', value: 'Do laundry' }];
  const updated = removeTask(tasks, '99');
  expect(updated).toEqual(tasks);
});

