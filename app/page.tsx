import Image from "next/image";
import TodoList from './components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <TodoList />
    </main>
  );
}
