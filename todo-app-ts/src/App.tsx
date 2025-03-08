import { createSignal, onMount } from 'solid-js';

import axios from 'axios';

import { styled } from 'solid-styled-components';
import { Button } from "@kobalte/core/button";
import { TextField } from "@kobalte/core/text-field";
import { Checkbox } from "@kobalte/core/checkbox";
import { Todo } from './types';

const StyledInput = styled(TextField )`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledButton = styled(Button)`
  padding: 8px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const StyledCheckbox = styled(Checkbox)`
  margin-right: 8px;
`;

function App() {
  const [todos, setTodos] = createSignal<Todo[]>([]);
  const [newTodo, setNewTodo] = createSignal('');

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:3001/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo().trim()) {
      const response = await axios.post('http://localhost:3001/todos', {
        text: newTodo(),
        completed: false,
      });
      setTodos(response.data);
      setNewTodo('');
    }
  };

  const toggleTodo = async (index: number) => {
    const updatedTodos = todos().map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    const response = await axios.put(`http://localhost:3001/todos/${index}`, updatedTodos[index]);
    setTodos(todos().map((todo, i) => i === index ? response.data[index] : todo));
  };

  const deleteTodo = async (index: number) => {
    const response = await axios.delete(`http://localhost:3001/todos/${index}`);
    setTodos(response.data);
  };

  onMount(fetchTodos);

  return (
    <div class="todo-app">
      <h1>Todo App</h1>
      <div class="input-area">
        <StyledInput
          type="text"
          value={newTodo()}
          onInput={(e: any) => setNewTodo(e.currentTarget.value)}
          placeholder="新しいTodoを入力"
        />
        <StyledButton onClick={addTodo}>追加</StyledButton>
      </div>
      <ul class="todo-list">
        {todos().map((todo, index) => (
          <li class="todo-item">
            <StyledCheckbox
              checked={todo.completed}
              onChange={() => toggleTodo(index)}
            />
            <span class={todo.completed ? 'completed' : ''}>{todo.text}</span>
            <StyledButton onClick={() => deleteTodo(index)}>削除</StyledButton>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
