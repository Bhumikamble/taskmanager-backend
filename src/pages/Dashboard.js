import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Task from '../components/Task';
import TaskForm from '../components/TaskForm';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleUpdateTask = (task) => {
    setSelectedTask(task);
  };

  return (
    <div>
      <Header onLogout={() => localStorage.removeItem('token')} />
      <TaskForm
        onSubmit={selectedTask ? handleUpdateTask : handleAddTask}
        task={selectedTask}
      />
      <div className="task-list">
        {tasks.map((task) => (
          <Task
            key={task._id}
            task={task}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
