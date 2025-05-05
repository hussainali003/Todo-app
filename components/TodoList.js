import react, {useState} from "react";
import {View, Text, Button, TextInput, FlatList} from 'react-native';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [value, setValue] = useState('');

    const addTodo = () => {
        
        if (value.trim()) {
            setTodos([...todos, {id: Date.now().toString(), value}])
            setValue('');
        }
    }

    return (
        <View>
            <TextInput placeholder="Add a new task" value={value} onChangeText={setValue} style={{marginTop: 32}}/>
            <Button title="Add" onPress={addTodo} />
            <FlatList data={todos} renderItem={({item}) => <Text>{item.value}</Text>} />
        </View>
    )
}

export default TodoList;