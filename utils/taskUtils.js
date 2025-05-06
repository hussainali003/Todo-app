export function createNewTask(input, now = new Date()) {

    // input.trim() return a string without white space at beginning and end. 
    const trimmed = input.trim();

    // trimmed only false when user didnt even type anything and press enter or press space then enter
    if (!trimmed) return null;
  
    const formattedDate = `${now.getHours()}:${now.getMinutes()}`;
  
    return {
      id: now.getTime().toString(),
      value: trimmed,
      createdAt: formattedDate
    };
}

export function removeTask(tasks, id) {
    return tasks.filter(task => task.id !== id)
}