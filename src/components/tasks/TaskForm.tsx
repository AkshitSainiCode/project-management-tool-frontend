// src/pages/tasks/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { tasksAPI } from '../../services/api';
import type { TaskFormData } from '../../types';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').max(200, 'Title too long'),
  description: yup.string().required('Description is required'),
  status: yup.string().oneOf(['todo', 'in-progress', 'done']).required('Status is required'),
  dueDate: yup.string().required('Due date is required'),
  projectId: yup.string().required('Project ID is required')
});

const TaskForm: React.FC = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditMode = !!taskId;

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'todo',
      projectId: projectId || ''
    }
  });

  useEffect(() => {
    if (isEditMode && taskId) {
      loadTask();
    } else if (projectId) {
      setValue('projectId', projectId);
    }
  }, [taskId, projectId]);

  const loadTask = async () => {
    try {
      const response = await tasksAPI.getById(taskId!);
      const task = response.data.task;
      setValue('title', task.title);
      setValue('description', task.description);
      setValue('status', task.status);
      setValue('dueDate', task.dueDate.split('T')[0]);
      setValue('projectId', task.projectId);
    } catch (err) {
      setError('Failed to load task');
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      setLoading(true);
      setError('');

      if (isEditMode && taskId) {
        await tasksAPI.update(taskId, data);
      } else {
        await tasksAPI.create(data);
      }

      navigate(`/projects/${projectId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Task' : 'Create New Task'}</h1>

      {error && <div className="text-red-600">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-md shadow">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title *</label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="text-red-600 mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description *</label>
          <textarea
            {...register('description')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && <p className="text-red-600 mt-1">{errors.description.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status *</label>
          <select
            {...register('status')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {errors.status && <p className="text-red-600 mt-1">{errors.status.message}</p>}
        </div>

        {/* Due Date */}
        <div>
          <label className="block font-medium mb-1">Due Date *</label>
          <input
            type="date"
            {...register('dueDate')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dueDate && <p className="text-red-600 mt-1">{errors.dueDate.message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/projects/${projectId}`)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
