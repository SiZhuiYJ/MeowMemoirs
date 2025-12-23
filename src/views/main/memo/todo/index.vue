<script lang="ts" setup>
import TodoCheckbox from "@/components/TodoCheckbox/index.vue";
import { ref } from 'vue';
interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}
// 代办列表
const todoList = ref<Array<TodoItem>>([
  { id: 1, title: '待办事项1', completed: false },
  { id: 2, title: '待办事项2', completed: true },
  { id: 3, title: '待办事项3', completed: false },
  { id: 4, title: '待办事项4', completed: false },
  { id: 5, title: '待办事项5', completed: true },

]);
// 搜索事件
const searchTodo = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  console.log('搜索待办事项', value);
  displayedList.value = todoList.value.filter(item => item.title.includes(value));
};
for (let i = 6; i <= 100; i++) {
  todoList.value.push({ id: i, title: `待办事项${i}`, completed: Math.random() < 0.5 });
}
// 显示列表
const displayedList = ref(todoList.value);
// 新待办事项标题
const newTodoTitle = ref('');
// 添加待办事项
const addTodo = () => {
  if (newTodoTitle.value.trim() === '') return;
  const newTodo = {
    id: todoList.value.length + 1,
    title: newTodoTitle.value,
    completed: false,
  };
  todoList.value.push(newTodo);
  displayedList.value.push(newTodo);
  newTodoTitle.value = "";
};

// 勾选/撤销
const toggleTodo = (item: TodoItem, val: boolean) => {
  item.completed = !!val;
};
</script>

<template>
  <div class="todo-list">

    <div class="todo-actions">
      <div class="search-bar">
        <input type="text" placeholder="搜索待办事项..." @input="event => searchTodo(event)" />
        <button>搜索</button>
      </div>
      <div class="add-to">
        <input type="text" placeholder="添加新的待办事项..." v-model="newTodoTitle" />
        <button @click="addTodo">添加</button>
      </div>
    </div>

    <div class="content-area">
      <div class="list-column">
        <h1>待办事项</h1>
        <transition-group name="todo-fade" tag="ul" class="todo-items">
          <li class="todo-item" v-for="item in displayedList.filter(i => !i.completed)" :key="item.id"
            :id="`todo-${item.id}`" v-slide-in>
            <TodoCheckbox v-model="item.completed" :label="item.title"
              @update:modelValue="val => toggleTodo(item, val as boolean)" />
          </li>
        </transition-group>
      </div>

      <div class="list-column">
        <h1>已办事项</h1>
        <transition-group name="todo-fade" tag="ul" class="todo-items">
          <li class="todo-item" v-for="item in displayedList.filter(i => i.completed)" :key="item.id"
            :id="`todo-${item.id}`" v-slide-in>
            <TodoCheckbox v-model="item.completed" :label="item.title"
              @update:modelValue="val => toggleTodo(item, val as boolean)" />
          </li>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.todo-list {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px 48px;
  box-sizing: border-box;
}

.header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 12px;

  .title {
    font-size: 28px;
    font-weight: 700;
  }

  .time {
    font-size: 14px;
    color: #666;
  }
}

.todo-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
}

.search-bar,
.add-to {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 640px;
  margin-top: 12px;
  margin-bottom: 8px;
  gap: 8px;

  input {
    flex: 1;
    min-width: 220px;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 0;
  }

  button {
    padding: 10px 16px;
    min-width: 110px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #369870;
    }
  }
}

.content-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
  padding: 0 24px;
  box-sizing: border-box;
  align-items: start;
}

.list-column h1 {
  text-align: center;
  margin-bottom: 12px;
}

.todo-items {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  min-height: 40px;
}

.todo-item {
  margin: 8px 0;
}

/* 过渡动画（进场由指令控制，离场用 CSS 过渡） */
.todo-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.todo-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.log-panel {
  width: 100%;
  max-width: 720px;
  margin-top: 20px;
  padding: 12px 16px;
  box-sizing: border-box;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
}

.log-header {
  font-weight: 600;
  margin-bottom: 8px;
}

.log-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.log-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed #e3e3e3;

  &:last-child {
    border-bottom: none;
  }
}

.log-time {
  font-size: 12px;
  color: #888;
  min-width: 70px;
}

.log-text {
  font-size: 14px;
  color: #333;
}

@media (max-width: 768px) {
  .todo-list {
    padding: 20px 12px 32px;
    align-items: stretch;
  }

  .todo-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .search-bar,
  .add-to {
    flex-direction: column;
    gap: 10px;
    max-width: none;
    margin: 0;
  }

  .search-bar input,
  .add-to input {
    width: 100%;
    min-width: 0;
  }

  .search-bar button,
  .add-to button {
    width: 100%;
  }

  .content-area {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0;
  }

  .list-column h1 {
    font-size: 18px;
  }

  .todo-items {
    padding: 12px;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    background: #fafafa;
  }
}
</style>
