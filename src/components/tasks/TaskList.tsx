// src/pages/tasks/TaskList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI } from '../../services/api';
import type { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onUpdate: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate }) => {
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await tasksAPI.delete(id);
      onUpdate();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      await tasksAPI.update(task._id, { status: newStatus as any });
      onUpdate();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status !== 'done' && new Date(dueDate) < new Date();
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-4 p-8 bg-white rounded-md shadow">
        <p className="text-lg mb-4">No tasks found</p>
        <p className="text-sm text-gray-500">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="p-4 border rounded-md shadow-sm bg-white flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <p className="text-gray-700">{task.description}</p>
            <div className="flex items-center gap-3">
              <span className={`inline-block px-2 py-1 text-sm rounded ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ')}
              </span>
              <p className="text-gray-500 text-sm">
                Due: {formatDate(task.dueDate)}
                {isOverdue(task.dueDate, task.status) && (
                  <span className="text-red-600 font-medium ml-2">(Overdue)</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task, e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <Link
              to={`/tasks/edit/${task.projectId}/${task._id}`}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm text-center"
            >
              Edit
            </Link>

            <button
              onClick={() => handleDelete(task._id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;