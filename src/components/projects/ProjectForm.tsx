// src/pages/projects/ProjectForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { projectsAPI } from '../../services/api';
import type { ProjectFormData } from '../../types';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').max(200, 'Title too long'),
  description: yup.string().required('Description is required'),
  status: yup.string().oneOf(['active', 'completed']).required('Status is required'),
});

const ProjectForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditMode = !!id;

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProjectFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'active',
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await projectsAPI.getById(id!);
      const project = response.data.project;
      setValue('title', project.title);
      setValue('description', project.description);
      setValue('status', project.status);
    } catch (err) {
      setError('Failed to load project');
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setLoading(true);
      setError('');

      if (isEditMode && id) {
        await projectsAPI.update(id, data);
      } else {
        await projectsAPI.create(data);
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? 'Edit Project' : 'Create New Project'}
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title *</label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description *</label>
          <textarea
            {...register('description')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status *</label>
          <select
            {...register('status')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && (
            <p className="text-red-600 mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Project' : 'Create Project'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
