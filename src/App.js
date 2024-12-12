import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "./components/ui/card.jsx";
import { Button } from "./components/ui/button.jsx";
import { Input } from "./components/ui/input.jsx";
import { Trash2, Edit, Check, X } from 'lucide-react';

function TaskManagementApp() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:5000/api/tasks');
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (!newTask.title.trim()) return;

    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });

    const task = await response.json();
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', deadline: '' });
  };

  // Delete a task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(task => task._id !== id));
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id) => {
    const taskToToggle = tasks.find(task => task._id === id);
    const updatedTask = { ...taskToToggle, completed: !taskToToggle.completed };

    const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });

    const task = await response.json();
    setTasks(tasks.map(t => (t._id === id ? task : t)));
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
  };

  // Update a task
  const updateTask = async () => {
    if (!editingTask.title.trim()) return;

    const response = await fetch(`http://localhost:5000/api/tasks/${editingTask._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingTask),
    });

    const task = await response.json();
    setTasks(tasks.map(t => (t._id === editingTask._id ? task : t)));
    setEditingTask(null);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 min-h-screen p-6">
      {/* Header Section */}
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Task Management System</h1>
        <p className="text-gray-600">Organize your tasks effectively and efficiently</p>
      </header>

      {/* Add Task Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add a New Task</h2>
        <div className="flex flex-wrap gap-4">
          <Input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="flex-1 text-black"
          />
          <Input
            type="text"
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="flex-1 text-black"
          />
          <Input
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            className="flex-1 text-black"
          />
          <Button onClick={addTask} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-black">
            Add Task
          </Button>
        </div>
      </div>

      {/* Task List Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task._id} className="p-4 bg-white shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className={`text-lg font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>{task.description}</p>
              <p className="text-sm text-gray-500">Deadline: {task.deadline}</p>
            </CardContent>
            <div className="flex justify-between mt-4">
              <Button
                className={`mr-2 px-4 py-2 rounded-md ${task.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
                onClick={() => toggleTaskCompletion(task._id)}
              >
                {task.completed ? <Check /> : <X />}
              </Button>
              <Button className="bg-yellow-500 px-4 py-2 rounded-md" onClick={() => startEditing(task)}>
                <Edit />
              </Button>
              <Button className="bg-red-500 px-4 py-2 rounded-md" onClick={() => deleteTask(task._id)}>
                <Trash2 />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Task Section */}
      {editingTask && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-6 shadow-lg rounded-t-lg">
          <h2 className="text-lg font-bold mb-2 text-gray-800">Edit Task</h2>
          <div className="flex flex-wrap gap-4">
            <Input
              type="text"
              placeholder="Task Title"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
              className="flex-1 text-black"
            />
            <Input
              type="text"
              placeholder="Task Description"
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
              className="flex-1 text-black"
            />
            <Input
              type="date"
              value={editingTask.deadline}
              onChange={(e) =>
                setEditingTask({ ...editingTask, deadline: e.target.value })
              }
              className="flex-1 text-black"
            />
            <Button onClick={updateTask} className="bg-blue-500 text-white px-4 py-2 rounded-md text-black">
              Update Task
            </Button>
            <Button onClick={() => setEditingTask(null)} className="bg-gray-300 px-4 py-2 rounded-md text-black">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskManagementApp;
