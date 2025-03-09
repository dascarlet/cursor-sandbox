import Image from "next/image";
import TodoList from './components/TodoList';
import Sidebar from './components/Sidebar';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-80 p-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Your Todo App</h1>
        <p className="mt-4 text-gray-600">Select or create todos from the sidebar to get started.</p>
      </main>
    </div>
  );
}
