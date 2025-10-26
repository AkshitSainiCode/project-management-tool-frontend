// src/pages/projects/ProjectDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../../services/api';
import type { Project, Task } from '../../types';
import TaskList from '../tasks/TaskList';

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        projectsAPI.getById(id!),
        tasksAPI.getByProject(id!, statusFilter)
      ]);
      setProject(projectRes.data.project);
      setTasks(tasksRes.data.tasks);
    } catch (err) {
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = () => {
    loadData();
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error || !project) {
    return <div className="text-center py-10 text-red-600">{error || 'Project not found'}</div>;
  }

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <Link
          to={`/projects/edit/${project._id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Edit Project
        </Link>
      </div>

      {/* Project Info */}
      <div className="bg-white p-6 rounded-md shadow space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-4">
          {project.title}
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              project.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {project.status}
          </span>
        </h1>
        <p className="text-gray-700">{project.description}</p>

        {/* Task Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-gray-100 p-4 rounded">Total Tasks<br/><span className="font-bold">{taskStats.total}</span></div>
          <div className="bg-yellow-100 p-4 rounded">To Do<br/><span className="font-bold">{taskStats.todo}</span></div>
          <div className="bg-blue-100 p-4 rounded">In Progress<br/><span className="font-bold">{taskStats.inProgress}</span></div>
          <div className="bg-green-100 p-4 rounded">Done<br/><span className="font-bold">{taskStats.done}</span></div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <Link
            to={`/tasks/add/${project._id}`}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Task
          </Link>
        </div>

        <div className="flex gap-4 mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <TaskList tasks={tasks} onUpdate={handleTaskUpdate} />
      </div>
    </div>
  );
};

export default ProjectDetails;
